#!/usr/bin/env node
/**
 * scan-wildlabs.mjs — Playwright scanner for the WILDLABS careers feed.
 *
 * RETIRED 2026-08-22. The conservation-first career strategy this feed served
 * was superseded (see modes/_profile.md § Superseded Strategy and
 * careerops_implementation_handoff.md). The feed is dominated by ecology, GIS,
 * bioacoustics and PhD/postdoc postings, which are anti-targets under the
 * current software/data/platform strategy, and the scraper writes them into
 * data/pipeline.md unfiltered.
 *
 * The Windows scheduled task `career-ops-wildlabs-scan` has been DISABLED
 * (not deleted). The script still works if it is ever wanted again:
 *   Re-enable schedule:  Enable-ScheduledTask -TaskName career-ops-wildlabs-scan
 *   Disable again:       Disable-ScheduledTask -TaskName career-ops-wildlabs-scan
 *   Remove entirely:     Unregister-ScheduledTask -TaskName career-ops-wildlabs-scan -Confirm:$false
 *   One-off manual run:  node scripts-user/scan-wildlabs.mjs --dry-run
 *
 * WILDLABS (wildlabs.net) is the highest-signal single source for conservation
 * technology roles. It aggregates postings from WCS, EarthRanger, NatureMetrics,
 * Wild Me, and the university research groups — most of which have no scannable
 * ATS at all.
 *
 * Why this is not a scan.mjs provider:
 *   1. wildlabs.net sits behind Cloudflare and returns HTTP 403 to every
 *      datacenter / curl / plain-fetch request. It needs a real browser.
 *   2. There is no RSS feed (/rss.xml, /feed, /en/rss.xml all 404) and no JSON
 *      endpoint. The listing is a server-rendered Drupal view.
 *   3. scan.mjs is deliberately zero-token and HTTP-only.
 *
 * Lives in scripts-user/ rather than the repo root because DATA_CONTRACT.md
 * classifies root-level `*.mjs` as System Layer (auto-updatable). This is a
 * user script and must survive `node update-system.mjs apply`.
 *
 * Writes to the same files as scan.mjs, in the same formats:
 *   - data/pipeline.md      → `- [ ] {url} | {company} | {title}` under the pending section
 *   - data/scan-history.tsv → url, first_seen, portal, title, company, status, location
 *
 * Usage:
 *   node scripts-user/scan-wildlabs.mjs             # scan and write
 *   node scripts-user/scan-wildlabs.mjs --dry-run   # preview only
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { chromium } from 'playwright';

const FEED_URL = 'https://wildlabs.net/en/resources?type%5Bcareers%5D=careers';
const PIPELINE_PATH = 'data/pipeline.md';
const SCAN_HISTORY_PATH = 'data/scan-history.tsv';
const APPLICATIONS_PATH = 'data/applications.md';
const SOURCE_LABEL = 'wildlabs-playwright';

// A real desktop UA — the default Playwright UA is enough to trip Cloudflare here.
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const DRY_RUN = process.argv.includes('--dry-run');

mkdirSync('data', { recursive: true });

// ── Dedup (mirrors scan.mjs loadSeenUrls) ───────────────────────────

function loadSeenUrls() {
  const seen = new Set();

  if (existsSync(SCAN_HISTORY_PATH)) {
    for (const line of readFileSync(SCAN_HISTORY_PATH, 'utf-8').split('\n').slice(1)) {
      const url = line.split('\t')[0];
      if (url) seen.add(url);
    }
  }
  if (existsSync(PIPELINE_PATH)) {
    const text = readFileSync(PIPELINE_PATH, 'utf-8');
    for (const m of text.matchAll(/- \[[ x]\] (https?:\/\/\S+)/g)) seen.add(m[1]);
  }
  if (existsSync(APPLICATIONS_PATH)) {
    const text = readFileSync(APPLICATIONS_PATH, 'utf-8');
    for (const m of text.matchAll(/https?:\/\/[^\s|)]+/g)) seen.add(m[0]);
  }
  return seen;
}

// ── Scrape ──────────────────────────────────────────────────────────

async function fetchListings() {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await (await browser.newContext({
      userAgent: USER_AGENT,
      locale: 'en-GB',
      viewport: { width: 1440, height: 900 },
    })).newPage();

    const res = await page.goto(FEED_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (res && res.status() >= 400) {
      throw new Error(`WILDLABS returned HTTP ${res.status()} — Cloudflare may be challenging this IP`);
    }

    // Career postings live at /en/career-opportunity/{slug}. Anchor on that
    // path rather than on Drupal's view classes, which change between releases.
    await page.waitForSelector('a[href*="/career-opportunity/"]', { timeout: 30000 });

    return await page.$$eval('a[href*="/career-opportunity/"]', (anchors) => {
      const out = new Map();
      for (const a of anchors) {
        const url = a.href.split('?')[0].replace(/\/$/, '');
        const title = (a.textContent || '')
          .replace(/\s+/g, ' ')
          .trim()
          // The heading anchor text is prefixed with the Drupal content-type
          // label, e.g. "Career Opportunity / Staff Software Engineer".
          .replace(/^Career Opportunity\s*\/\s*/i, '')
          .trim();
        // Skip bare "Read more" style links and thumbnail wrappers with no text.
        if (!title || title.length < 6) continue;
        // First textual anchor per URL wins — it is the heading link.
        if (!out.has(url)) out.set(url, title);
      }
      return [...out].map(([url, title]) => ({ url, title }));
    });
  } finally {
    await browser.close();
  }
}

// ── Writers (byte-compatible with scan.mjs) ─────────────────────────

// pipeline.md rows are pipe-delimited, and WILDLABS titles routinely contain a
// literal "|" (e.g. "Conservation Technology Officer | WCS Mongolia"), which
// would corrupt the row. Tabs would likewise corrupt scan-history.tsv.
function sanitize(s) {
  return s.replace(/[|\t]/g, ' - ').replace(/\s+/g, ' ').trim();
}

// Section markers, English first. Spanish variants are legacy fallbacks for
// pipeline.md files predating the English translation. Reading is tolerant,
// writing always emits English. Matches scan.mjs so both scanners agree.
const PENDING_MARKERS = ['## Pending', '## Pendientes'];
const PROCESSED_MARKERS = ['## Processed', '## Procesadas'];

function findMarker(text, markers) {
  for (const marker of markers) {
    const idx = text.indexOf(marker);
    if (idx !== -1) return { marker, idx };
  }
  return null;
}

function appendToPipeline(offers) {
  let text = existsSync(PIPELINE_PATH) ? readFileSync(PIPELINE_PATH, 'utf-8') : '';
  const lines = offers
    .map(o => `- [ ] ${o.url} | ${o.company} | ${sanitize(o.title)}`)
    .join('\n');

  const pending = findMarker(text, PENDING_MARKERS);
  if (!pending) {
    const processed = findMarker(text, PROCESSED_MARKERS);
    const insertAt = processed ? processed.idx : text.length;
    text = text.slice(0, insertAt) + `\n${PENDING_MARKERS[0]}\n\n${lines}\n\n` + text.slice(insertAt);
  } else {
    const nextSection = text.indexOf('\n## ', pending.idx + pending.marker.length);
    const insertAt = nextSection === -1 ? text.length : nextSection;
    text = text.slice(0, insertAt) + '\n' + lines + '\n' + text.slice(insertAt);
  }
  writeFileSync(PIPELINE_PATH, text, 'utf-8');
}

function appendToScanHistory(offers, date) {
  if (!existsSync(SCAN_HISTORY_PATH)) {
    writeFileSync(
      SCAN_HISTORY_PATH,
      'url\tfirst_seen\tportal\ttitle\tcompany\tstatus\tlocation\n',
      'utf-8',
    );
  }
  const lines = offers
    .map(o => `${o.url}\t${date}\t${SOURCE_LABEL}\t${sanitize(o.title)}\t${o.company}\tadded\t`)
    .join('\n');
  appendFileSync(SCAN_HISTORY_PATH, lines + '\n', 'utf-8');
}

// ── Main ────────────────────────────────────────────────────────────

const date = new Date().toISOString().slice(0, 10);

let listings;
try {
  listings = await fetchListings();
} catch (err) {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
}

if (listings.length === 0) {
  console.error(
    'Warning: 0 listings parsed. Either the feed is genuinely empty or the WILDLABS\n' +
    '         markup changed. Open the URL in a browser before assuming it is empty:\n' +
    `         ${FEED_URL}`,
  );
  process.exit(1);
}

const seen = loadSeenUrls();
// Company is not exposed on the listing page, only on each posting. Left as
// "WILDLABS" so /career-ops pipeline resolves the real org when it evaluates.
const fresh = listings
  .filter(l => !seen.has(l.url))
  .map(l => ({ ...l, company: 'WILDLABS' }));

console.log(`WILDLABS careers feed — ${listings.length} listed, ${fresh.length} new`);
for (const o of fresh) console.log(`  + ${o.title}`);

if (fresh.length === 0) {
  console.log('\nNothing new.');
} else if (DRY_RUN) {
  console.log('\n(dry run — no files written)');
} else {
  appendToPipeline(fresh);
  appendToScanHistory(fresh, date);
  console.log(`\nWrote ${fresh.length} to ${PIPELINE_PATH} and ${SCAN_HISTORY_PATH}.`);
  console.log('→ Run /career-ops pipeline to evaluate.');
}
