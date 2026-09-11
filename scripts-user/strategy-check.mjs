#!/usr/bin/env node
/**
 * strategy-check.mjs — behavioural validation that the CURRENT career strategy
 * is actually active in this repo.
 *
 * Strategy source: `careerops_implementation_handoff.md` (2026-08-22). This
 * script implements the acceptance criteria in its §18 "Tests / fixtures /
 * validation" and §20 "Acceptance criteria" that can be checked deterministically.
 *
 * What it CAN check (zero tokens, no network, no model):
 *   1. Scanner behaviour — the real `buildTitleFilter` / `buildContentFilter`
 *      from scan.mjs, run against representative postings, so a config edit
 *      that silently re-opens an anti-target or closes a target family fails here.
 *   2. Claim discipline — the real `verifyFacts` from verify-cv-facts.mjs, run
 *      against cv.md, the story bank and the profile files, plus a synthetic
 *      document carrying every retired claim (which MUST be blocked).
 *   3. Story bank — parses with match-star.mjs, covers the required themes.
 *   4. Config invariants — archetypes, tiers, anti-targets, target companies,
 *      and the absence of retired strategy vocabulary in the user layer.
 *
 * What it CANNOT check: how a language model scores a given JD. Archetype
 * classification and the A-G evaluation are model work; this script pins the
 * deterministic layer underneath them and the instructions they are handed.
 *
 * Lives in scripts-user/ because root-level *.mjs is System Layer per
 * DATA_CONTRACT.md and would be in scope for `update-system.mjs apply`.
 *
 * Usage:
 *   node scripts-user/strategy-check.mjs
 *   node scripts-user/strategy-check.mjs --verbose
 */

import { readFileSync, existsSync, writeFileSync, unlinkSync, mkdtempSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import yaml from 'js-yaml';

import { buildTitleFilter, buildContentFilter, matchedTitleKeywords } from '../scan.mjs';
import { verifyFacts } from '../verify-cv-facts.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VERBOSE = process.argv.includes('--verbose');

let passed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed++;
    if (VERBOSE) console.log(`  ok    ${name}`);
  } else {
    failures.push(detail ? `${name} — ${detail}` : name);
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

const read = (rel) => (existsSync(join(ROOT, rel)) ? readFileSync(join(ROOT, rel), 'utf8') : null);

// ── Load the user layer ──────────────────────────────────────────────
const profile = yaml.load(read('config/profile.yml') || '{}') || {};
const portals = yaml.load(read('portals.yml') || '{}') || {};
const cv = read('cv.md') || '';
const profileMd = read('modes/_profile.md') || '';
const briefMd = read('modes/_brief.md') || '';
const customMd = read('modes/_custom.md') || '';
const storyBank = read('interview-prep/story-bank.md') || '';

// =====================================================================
// 1. Scanner behaviour — title filter
// =====================================================================
section('1. Scanner — title filter (role families in, anti-targets out)');

const titleFilter = buildTitleFilter(portals.title_filter);

// [title, shouldSurface, why]
const TITLE_CASES = [
  // Tier A — must surface
  ['Software Engineer', true, 'ordinary SWE titles must keep surfacing'],
  ['Software Engineer, Platform', true, 'Tier A platform'],
  ['Backend Software Engineer', true, 'Tier A backend'],
  ['Backend Engineer (Python)', true, 'Tier A backend'],
  ['Platform Software Engineer', true, 'Tier A platform'],
  ['Infrastructure Software Engineer', true, 'Tier A infrastructure'],
  ['Python Software Engineer', true, 'Tier A python'],
  ['Data Engineer', true, 'ordinary data titles must keep surfacing'],
  ['Data Platform Engineer', true, 'Tier A data platform'],
  ['Data Infrastructure Engineer', true, 'Tier A data infrastructure'],
  ['Software Engineer, Data', true, 'Tier A data'],
  ['Data Systems Engineer', true, 'Tier A data systems'],
  // Tier B — physical-world infrastructure must surface
  ['Fleet Platform Engineer', true, 'Tier B fleet'],
  ['Fleet Infrastructure Engineer', true, 'Tier B fleet'],
  ['Robotics Data Infrastructure Engineer', true, 'Tier B robotics data'],
  ['Software Engineer, Robotics Infrastructure', true, 'Tier B robotics infra'],
  ['Telemetry Platform Engineer', true, 'Tier B telemetry'],
  ['Mission Software Engineer', true, 'Tier B mission software'],
  ['Edge Software Engineer', true, 'Tier B edge'],
  ['Industrial IoT Engineer', true, 'Tier B industrial IoT'],
  ['Research Platform Engineer', true, 'research infrastructure'],
  ['Scientific Software Engineer', true, 'scientific software'],
  ['Simulation Platform Engineer', true, 'simulation platform'],
  // Tier B secondary / Tier C
  ['Applied AI Engineer', true, 'Tier B secondary AI'],
  ['AI Platform Engineer', true, 'Tier B secondary AI platform'],
  ['ML Infrastructure Engineer', true, 'Tier B secondary ML infra'],
  ['MLOps Engineer', true, 'Tier B secondary MLOps'],
  ['Forward Deployed Engineer', true, 'Tier C FDE'],
  ['Deployment Engineer', true, 'Tier C deployment'],
  // Level: junior with ownership surfaces, senior surfaces (judged at eval time)
  ['Junior Backend Engineer', true, 'junior titles are judged on content, not filtered'],
  ['Senior Software Engineer', true, 'small deep-tech companies title mid-level roles Senior'],
  // Anti-targets — must NOT surface
  ['Perception Engineer', false, 'anti-target: perception'],
  ['SLAM Engineer', false, 'anti-target: SLAM'],
  ['Localization Engineer', false, 'anti-target: localization'],
  ['Sensor Fusion Engineer', false, 'anti-target: sensor fusion'],
  ['Computer Vision Engineer', false, 'anti-target: CV'],
  ['Robotics Software Engineer (C++/ROS2)', false, 'anti-target: robot runtime'],
  ['Controls Engineer', false, 'anti-target: controls'],
  ['GNC Engineer', false, 'anti-target: GNC'],
  ['Embedded Software Engineer', false, 'anti-target: embedded'],
  ['Firmware Engineer', false, 'anti-target: firmware'],
  ['Staff Software Engineer', false, 'unsupported seniority'],
  ['Principal Platform Engineer', false, 'unsupported seniority'],
  ['Engineering Manager, Platform', false, 'anti-target: management'],
  ['Head of Data Engineering', false, 'anti-target: management'],
  ['Technical Lead, Backend', false, 'anti-target: lead'],
  ['Product Manager, AI Platform', false, 'anti-target: generic PM'],
  ['Prompt Engineer', false, 'anti-target: prompt craft'],
  ['Research Scientist, Machine Learning', false, 'anti-target: ML research'],
  ['BI Developer', false, 'anti-target: reporting'],
  ['Analytics Engineer', false, 'anti-target: analytics-only'],
  ['Data Analyst', false, 'anti-target: analysis-only'],
  ['Data Scientist', false, 'anti-target: not the target craft'],
];

for (const [title, want, why] of TITLE_CASES) {
  const got = titleFilter(title);
  check(`${want ? 'surfaces' : 'filtered'}: "${title}"`, got === want, got === want ? '' : why);
}

// =====================================================================
// 2. Scanner behaviour — content filter (role content beats title)
// =====================================================================
section('2. Scanner — content filter (role content beats title)');

const contentFilter = buildContentFilter(portals.content_filter);
const matched = (title) => matchedTitleKeywords(title, portals.title_filter);

const REPORTING_DATA_JD =
  'You will own our reporting estate. Day to day you will work as a Power BI developer building ' +
  'dashboards for stakeholders and maintaining the data warehouse.';
const PLATFORM_DATA_JD =
  'You will build Python ingestion pipelines from difficult operational APIs into our lakehouse, ' +
  'with incremental processing, dbt models, data quality tests, CI/CD and real platform ownership.';
const SALES_SOLUTIONS_JD =
  'You will own a quota, run pre-sales demos and handle account management for enterprise clients.';
const ENGINEERING_SOLUTIONS_JD =
  'You will write Python, integrate our API and SDK into customer environments, deploy to production ' +
  'and own the debugging when it breaks in the field.';
const ROBOTICS_FLEET_JD =
  'Build the backend for our robot fleet: MQTT and gRPC telemetry ingestion, time-series storage, ' +
  'cloud and edge reliability. Our perception team uses SLAM; you will not work on it. ROS2 preferred, not required.';

check(
  'reporting-heavy "Data Engineer" is rejected on content',
  contentFilter(REPORTING_DATA_JD, matched('Data Engineer')) === false,
  'a BI/reporting JD must not pass just because the title says Data Engineer',
);
check(
  'platform "Data Engineer" passes on content',
  contentFilter(PLATFORM_DATA_JD, matched('Data Engineer')) === true,
  'ingestion/lakehouse/dbt/CI-CD content is a Tier A match',
);
check(
  'sales-heavy "Solutions Engineer" is rejected on content',
  contentFilter(SALES_SOLUTIONS_JD, matched('Solutions Engineer')) === false,
  'quota/pre-sales/account-management is not an engineering role',
);
check(
  'engineering-heavy "Solutions Engineer" passes on content',
  contentFilter(ENGINEERING_SOLUTIONS_JD, matched('Solutions Engineer')) === true,
  'Tier C fits when there is significant coding',
);
check(
  'robotics fleet/telemetry JD is NOT vetoed by SLAM/perception vocabulary',
  contentFilter(ROBOTICS_FLEET_JD, matched('Software Engineer')) === true,
  'a fleet-infra JD that merely mentions the perception team must survive the scanner',
);
check(
  'empty description always passes (providers without descriptions must not be dropped)',
  contentFilter('', matched('Software Engineer')) === true,
);

// =====================================================================
// 3. Claim discipline — the retired claims must be blocked
// =====================================================================
section('3. Claim discipline — retired claims are mechanically blocked');

const factsConfig = join(ROOT, 'config/cv-facts.json');
check('config/cv-facts.json exists (fact gate is armed)', existsSync(factsConfig));

const RETIRED_CLAIMS = [
  ['+18 BLEU improvement on medical translation', '+18 BLEU'],
  ['Saved MSF 150k annual licensing costs', 'realized EUR 150k savings'],
  ['Cut the pipeline from 4 days to 30 minutes', '"4 days to 30 minutes"'],
  ['I architected Next.js and grew it to 100k ARR with 800% CAGR', 'Dropshirt full-stack / commercial figures'],
  ['I led 10+ engineers across powertrain and controls at Talaria', 'Talaria controls ownership'],
  ['I am transitioning into robotics after building custom model training infrastructure', 'robotics transition framing + custom training'],
  ['The platform covered the global MSF tenant and every MSF mission site', 'globalized SharePoint scope'],
  ['My visual navigation algorithm ran on the Jetson', 'drone algorithm ownership'],
];

const tmp = mkdtempSync(join(tmpdir(), 'strategy-check-'));
try {
  for (const [text, label] of RETIRED_CLAIMS) {
    const file = join(tmp, 'doc.md');
    writeFileSync(file, text);
    const result = verifyFacts(readFileSync(file, 'utf8'), { cwd: ROOT });
    check(`blocked: ${label}`, result.verdict === 'block', `verdict was "${result.verdict}"`);
  }

  // The canonical evidence must pass unchanged.
  const GOOD = readFileSync(join(ROOT, 'cv.md'), 'utf8');
  const goodResult = verifyFacts(GOOD, { cwd: ROOT });
  check('cv.md itself passes the fact gate', goodResult.verdict !== 'block',
    goodResult.verdict === 'block' ? JSON.stringify({ invented: goodResult.invented, forbidden: goodResult.forbidden, facts: goodResult.unsupportedFacts }) : '');

  // The `**Caveats:**` lines deliberately QUOTE the retired claims in order to
  // prohibit them, so they are stripped before the gate runs — otherwise the
  // prohibition would trip the check it exists to enforce.
  const bankClaims = storyBank
    .split('\n')
    .filter((line) => !line.startsWith('**Caveats:**'))
    .join('\n');
  const bankResult = verifyFacts(bankClaims, { cwd: ROOT });
  check('story-bank.md story text carries no forbidden phrase', bankResult.forbidden.length === 0,
    bankResult.forbidden.join(', '));
  check('story-bank.md caveats still name the retired claims',
    /\+18 BLEU/.test(storyBank) && /4 days/.test(storyBank) && /outsourced/i.test(storyBank));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

// The scope claim must stay precise in the canonical sources.
check('cv.md keeps the 30 Amsterdam-managed-site scope',
  /30 Amsterdam-managed/.test(cv) && !/30[–\-]40/.test(cv));
check('story bank keeps the 30 Amsterdam-managed-site scope',
  /30 Amsterdam-managed/.test(storyBank) && !/30[–\-]40/.test(storyBank));

// =====================================================================
// 4. Story bank
// =====================================================================
section('4. Story bank — parses and covers the required themes');

const list = spawnSync(process.execPath, [join(ROOT, 'match-star.mjs'), '--list'], { cwd: ROOT, encoding: 'utf8' });
const listOut = `${list.stdout || ''}${list.stderr || ''}`;
const storyCount = Number((listOut.match(/Story Bank — (\d+) stories/) || [])[1] || 0);
check('match-star.mjs parses the story bank', storyCount >= 7, `parsed ${storyCount} stories`);

const REQUIRED_STORIES = [
  ['SharePoint platform ownership', /SharePoint Platform Modernization/i],
  ['reusable authentication modernization', /Authentication Modernization/i],
  ['pragmatic FastAPI backend architecture', /Translation Backend/i],
  ['trading-system methodology / judgement', /Trading System/i],
  ['Talaria physical-system failure and learning', /Talaria Supplier Failure/i],
  ['Talaria technical leadership', /Talaria Powertrain/i],
  ['Dropshirt vendor / technical governance', /Dropshirt Vendor Intervention/i],
];
for (const [label, re] of REQUIRED_STORIES) {
  check(`story present: ${label}`, re.test(storyBank));
}
check('drone navigation is NOT a primary robotics/CV story',
  /inherited/i.test(storyBank) && !/### \[[^\]]*\] Drone/i.test(storyBank));
check('every story carries its evidence caveats',
  (storyBank.match(/\*\*Caveats:\*\*/g) || []).length >= 7);

// =====================================================================
// 5. Config invariants
// =====================================================================
section('5. Config invariants — the strategy is encoded, not just described');

const archetypes = profile?.target_roles?.archetypes || [];
const archetypeNames = archetypes.map((a) => a?.name || '');
const EXPECTED_ARCHETYPES = [
  ['Deep-Tech Software / Backend / Platform', 'primary'],
  ['Data Platform / Data Infrastructure', 'primary'],
  ['Physical-World / Robotics Data Infrastructure', 'primary'],
  ['Engineering-Heavy Applied AI / AI Platform', 'secondary'],
  ['Forward-Deployed / Technical Solutions', 'adjacent'],
];
for (const [name, fit] of EXPECTED_ARCHETYPES) {
  const hit = archetypes.find((a) => (a?.name || '').startsWith(name));
  check(`archetype present with fit=${fit}: ${name}`, !!hit && hit.fit === fit,
    hit ? `fit was "${hit.fit}"` : 'missing');
}
check('no retired archetype survives in profile.yml',
  !archetypeNames.some((n) => /Field & Environmental|AI\/LLM Engineer|LLMOps|Solutions Architect/i.test(n)),
  archetypeNames.join(' | '));
check('anti-targets are declared in profile.yml', Array.isArray(profile.anti_targets) && profile.anti_targets.length >= 8);
check('level target is early/mid to mid, never senior',
  archetypes.every((a) => /Early\/Mid/i.test(a?.level || '')),
  archetypes.map((a) => a?.level).join(', '));
check('no fixed compensation floor', profile?.compensation?.no_fixed_floor === true &&
  profile?.compensation?.target_range === undefined);
check('sustainability rule is encoded', !!profile?.compensation?.sustainability_rule?.savings_investments);

const tier1 = profile?.target_companies?.tier_1 || [];
for (const c of ['Fugro', 'ICEYE', 'Ocean Infinity', 'Six Robotics', 'RIVR']) {
  check(`Tier 1 target present: ${c}`, tier1.includes(c));
}
check('Tier 2 targets present', (profile?.target_companies?.tier_2 || []).length >= 10);
check('discovery generalizes beyond the named list',
  (profile?.discovery_categories || []).length >= 10);

// Tracked companies actually reachable by the scanner
const tracked = (portals.tracked_companies || []).filter((c) => c.enabled !== false).map((c) => c.name);
for (const c of ['Fugro', 'Ocean Infinity', 'RIVR', 'ICEYE', 'Path Robotics', 'ANYbotics', 'Nearfield Instruments']) {
  check(`tracked and enabled in portals.yml: ${c}`, tracked.includes(c));
}

// Mode files
check('modes/_profile.md overrides the generic archetype table',
  /Archetype Detection Override/.test(profileMd));
check('modes/_profile.md records the superseded strategy',
  /Superseded Strategy/.test(profileMd));
check('modes/_brief.md exists for two-pass triage', briefMd.length > 0);
check('triage brief lists the anti-targets as hard DQs',
  /Hard DQ/.test(briefMd) && /SLAM/.test(briefMd) && /Engineering Manager/.test(briefMd));
check('triage brief does NOT DQ the manageable gaps',
  !/Hard DQ[\s\S]*?Kubernetes/.test(briefMd.split('## Quick Scoring Guide')[0] || ''));
check('triage brief lists Kubernetes/observability as a manageable gap',
  /Manageable Gaps/.test(briefMd) && /Kubernetes/.test(briefMd));
check('modes/_custom.md encodes the procedural house rules', /Role content decides fit/.test(customMd));

// No retired strategy vocabulary left ACTIVE in the user layer. The
// "Superseded Strategy" section names the retired concepts on purpose, so it is
// excluded — everything above it is the live strategy.
const profileMdActive = profileMd.split('## Superseded Strategy')[0] || '';
const RETIRED_VOCAB = [
  ['conservation-first sector bonus', /Conservation, biodiversity, wildlife/i, profileMdActive],
  ['field & environmental archetype', /Field & Environmental Systems/i, profileMdActive],
  ['WILDLABS as primary discovery source', /Primary discovery source: WILDLABS/i, profileMdActive],
  ['medior-senior level target', /Medior–Senior|Medior-Senior/i,
    (profileMdActive.split('## Your Level Calibration')[1] || '').split('\n## ')[0]],
  ['AI-specialist headline', /AI Engineer building production LLM systems/i, read('config/profile.yml') || ''],
  ['fixed comp floor', /walk-away/i, briefMd],
];
for (const [label, re, haystack] of RETIRED_VOCAB) {
  check(`retired: ${label} is gone`, !re.test(haystack));
}

// =====================================================================
section('Result');
const total = passed + failures.length;
if (failures.length === 0) {
  console.log(`\n  PASS — ${passed}/${total} strategy checks green.\n`);
  process.exit(0);
}
console.log(`\n  FAIL — ${failures.length}/${total} strategy checks failed:\n`);
for (const f of failures) console.log(`    - ${f}`);
console.log('');
process.exit(1);
