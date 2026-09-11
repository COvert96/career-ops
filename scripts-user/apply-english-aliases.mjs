#!/usr/bin/env node
/**
 * apply-english-aliases.mjs — English command aliases for the three Spanish modes.
 *
 * career-ops upstream still names three mode files in Spanish: modes/oferta.md,
 * modes/ofertas.md and modes/contacto.md. Everything else (offer-prep, cover,
 * email, triage, discover, upskill, ...) is already English, and the *contents*
 * of all three are English too — only the filenames and command tokens are not.
 *
 * WHY ALIASES AND NOT A RENAME
 * Renaming the files would touch ~30 reference sites, including 8 assertions in
 * test-all.mjs and tests/updater-upgrade-safety.test.mjs, so `npm test` would
 * fail. A blind find/replace is worse: `oferta` is also the canonical Offer
 * *status alias* in templates/states.yml, and modes/{pl,da,ua}/oferta.md are
 * legitimately Polish/Danish/Ukrainian. Adding routing rows costs three lines
 * per file, breaks nothing, and leaves upstream's manifest untouched.
 *
 * WHY THIS IS A SCRIPT
 * Every SKILL.md is System Layer (DATA_CONTRACT.md), so `node update-system.mjs
 * apply` overwrites all 8 copies. Re-run this afterwards. It is idempotent:
 * running it twice changes nothing.
 *
 * Usage:
 *   node scripts-user/apply-english-aliases.mjs             # apply
 *   node scripts-user/apply-english-aliases.mjs --dry-run   # preview
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'fs';
import path from 'path';

const DRY_RUN = process.argv.includes('--dry-run');

// English command → the upstream mode it routes to.
const ALIASES = [
  { en: 'offer', es: 'oferta' },
  { en: 'offers', es: 'ofertas' },
  { en: 'contact', es: 'contacto' },
];

// Stale v1.8 duplicates left behind when upstream re-created the Spanish files.
// modes/offer.md was 8.7 KB against oferta.md's 70 KB — reading one of these
// silently downgrades the agent to pre-1.27 evaluation logic.
const STALE_ORPHANS = ALIASES.map(a => `modes/${a.en}.md`);

let changed = 0;
let skipped = 0;

// ── 1. Remove stale orphan mode files ───────────────────────────────

for (const orphan of STALE_ORPHANS) {
  if (!existsSync(orphan)) continue;
  const canonical = `modes/${ALIASES.find(a => orphan === `modes/${a.en}.md`).es}.md`;
  if (!existsSync(canonical)) {
    // Never delete the only copy of a mode. If upstream's file is missing this
    // is a broken install, not an orphan to clean up.
    console.error(`  ! ${orphan}: canonical ${canonical} missing — refusing to delete`);
    continue;
  }
  console.log(`  - remove stale orphan ${orphan}`);
  if (!DRY_RUN) unlinkSync(orphan);
  changed++;
}

// ── 2. Add alias rows to every SKILL.md copy ────────────────────────

// The updater materializes one copy per CLI (.claude, .opencode, .cursor, ...)
// rather than symlinking, so all of them need patching. Discovered rather than
// hardcoded, so a newly supported CLI is picked up automatically.
function findSkillFiles() {
  return readdirSync('.', { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name.startsWith('.'))
    .map(d => path.join(d.name, 'skills', 'career-ops', 'SKILL.md'))
    .filter(existsSync);
}

const skillFiles = findSkillFiles();
if (skillFiles.length === 0) {
  console.error('No */skills/career-ops/SKILL.md found — run from the repo root.');
  process.exit(1);
}

for (const file of skillFiles) {
  let text = readFileSync(file, 'utf8');
  const original = text;

  for (const { en, es } of ALIASES) {
    const aliasRow = `| \`${en}\` | \`${es}\` |`;
    if (text.includes(aliasRow)) continue; // already applied

    // Anchor on the upstream row and insert directly after it, so the alias sits
    // next to the command it forwards to instead of at the end of the table.
    const anchor = `| \`${es}\` | \`${es}\` |`;
    if (!text.includes(anchor)) {
      console.error(`  ! ${file}: anchor row for \`${es}\` not found — upstream table may have changed`);
      continue;
    }
    text = text.replace(anchor, `${anchor}\n${aliasRow}`);
  }

  // Advertise the aliases in the help hint so they are discoverable.
  //
  // The hint is a "[a | b | c]" list, so membership must be tested on whole
  // pipe-delimited tokens. A \b regex is wrong here: \boffer\b matches inside
  // the existing `offer-prep` token, so the script concluded `offer` was already
  // present and silently skipped it.
  text = text.replace(/^(argument-hint: ")(.*)"$/m, (m, prefix, body) => {
    const tokens = body.replace(/^\[|\]$/g, '').split('|').map(t => t.trim());
    for (const { en, es } of ALIASES) {
      if (tokens.includes(en)) continue;
      const at = tokens.indexOf(es);
      if (at === -1) continue;
      tokens.splice(at + 1, 0, en);
    }
    return `${prefix}[${tokens.join(' | ')}]"`;
  });

  if (text === original) { skipped++; continue; }
  console.log(`  + ${file}`);
  if (!DRY_RUN) writeFileSync(file, text, 'utf8');
  changed++;
}

// ── Summary ─────────────────────────────────────────────────────────

console.log(
  `\n${changed} file(s) ${DRY_RUN ? 'would change' : 'changed'}, ${skipped} already current.`,
);
if (DRY_RUN) console.log('(dry run — nothing written)');
else if (changed > 0) {
  console.log('\nEnglish commands now available: ' + ALIASES.map(a => `/career-ops ${a.en}`).join(', '));
  console.log('Re-run this after every `node update-system.mjs apply`.');
}
