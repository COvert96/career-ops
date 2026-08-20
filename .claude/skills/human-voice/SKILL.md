---
name: human-voice
description: >
  Write, edit, or review professional text so it sounds specific, natural, and non-promotional.
  Use for business writing such as emails, reports, proposals, executive summaries, bios,
  LinkedIn posts, press releases, web copy, cover letters, and internal updates. Also use when
  the user says text sounds AI-generated, robotic, generic, too formal, over-polished, or needs
  a human touch.
---

# Human Voice Skill

Write or edit professional text so it reads like a specific person wrote it for a specific audience.

Prioritize:
- clarity over polish
- specificity over abstraction
- plain language over inflated language
- the user's intent over generic “better writing”
- natural rhythm over symmetrical structure

Do not invent facts, numbers, sources, credentials, outcomes, or personal details.

## Modes

### Generate

Use when creating new text.

1. Infer audience, purpose, tone, and constraints from the request.
2. Ask a question only if a missing fact blocks a useful draft.
3. Otherwise write a usable draft and avoid fake specificity.
4. Keep the register appropriate to the context.

### Edit

Use when rewriting, proofreading, or de-AI-ing existing text.

1. Preserve the original meaning, facts, and intent.
2. Remove AI tells and over-polished phrasing.
3. Keep authentic details, even if slightly imperfect.
4. Return the revised text first unless the user asked for analysis first.
5. Add a brief change note only when useful or requested.

### Review

Use when the user asks whether text sounds AI-generated.

1. Identify the strongest tells.
2. Explain only the material issues.
3. Provide a cleaner rewrite if appropriate.

## Output Rules

Follow the user's requested format.

If no format is specified:
- For generation: provide the finished draft.
- For editing: provide the rewritten version, then a short note on major changes.
- For review: provide concise findings, then an optional rewrite.

Do not add long explanations unless the user asks.

## Editing Workflow

For edit and review tasks, scan in this order:

1. **Facts and intent**
   - Preserve claims, names, numbers, chronology, and commitments.
   - Do not upgrade vague claims into specific claims.

2. **AI vocabulary**
   - Replace inflated, generic, or ornamental wording.
   - Keep user-supplied, quoted, technical, or legally necessary terms when appropriate.

3. **Structure**
   - Remove fake rule-of-three phrasing.
   - Avoid boilerplate “challenges / future outlook” endings.
   - Replace inline-header bullet lists with prose or a real table when the format feels artificial.

4. **Syntax**
   - Split compressed sentences.
   - Reduce em/en dashes.
   - Remove trailing “-ing” significance clauses.
   - Avoid “not only X, but Y” and “not just X, it is Y” constructions.

5. **Tone**
   - Remove promotional inflation.
   - Remove vague attribution unless a source is named.
   - Match the audience: internal note, application, public announcement, executive summary, etc.

6. **Final read**
   - Check whether the result sounds like a specific person writing to a specific audience.
   - If it sounds like a job posting, press release, or generic company blog, rewrite again.

## Common AI Tells to Remove

### Inflated adjectives and adverbs

Avoid these unless they are precise and necessary:

pivotal, crucial, vital, robust, vibrant, profound, groundbreaking, meticulous,
meticulously, seamlessly, comprehensive, dynamic, innovative, cutting-edge,
transformative, invaluable, paramount, intricate, nuanced, multifaceted, notable,
noteworthy, rich, diverse

### Inflated verbs

Avoid these as filler:

underscore, highlight, delve, garner, foster, cultivate, bolster, showcase,
leverage, spearhead, navigate, facilitate, enable, streamline, align with,
resonate with, emphasize, enhance

Prefer direct verbs.

Examples:
- “uses” instead of “leverages”
- “shows” instead of “showcases”
- “helps” instead of “facilitates”
- “is” instead of “serves as”

### Abstract nouns

Avoid ornamental abstractions:

landscape, tapestry, ecosystem, journey, synergy, paradigm, framework,
touchstone, testament, cornerstone, foundation, backbone

Keep them only when technically accurate or central to the domain.

### Stock openers and closers

Avoid:

- Additionally
- Furthermore
- Moreover
- It is worth noting
- It is important to note
- In conclusion
- In summary

Use the next sentence directly.

### Filler phrases

Avoid:

- plays a key role
- plays a crucial role
- as a testament to
- contributing to the broader
- stands as
- serves as
- marks a shift
- setting the stage for
- in the heart of
- nestled

## Structural Rules

### Do not pad with three-part lists

Bad:
> Our team brings expertise, dedication, and innovation to every project.

Better:
> Our team specializes in X and Y.

Use the number of points the content actually needs.

### Do not add superficial significance

Bad:
> Revenue grew 12%, underscoring the team's commitment to excellence.

Better:
> Revenue grew 12%.

Only explain significance when it adds real information.

### Avoid artificial inline-header bullets

Avoid this when it reads like generated content:

- **Key Benefit**: Description.
- **Another Feature**: Description.

Use prose, a table, or fewer bullets.

## Syntax Rules

### Prefer simple verbs

Bad:
> The dashboard serves as a central hub for tracking performance.

Better:
> The dashboard tracks performance centrally.

### Treat dashes as a warning sign

A dash often means two thoughts have been compressed into one sentence.

Bad:
> I built the evaluation pipeline — a system that tracked model performance over time.

Better:
> I built the evaluation pipeline. It tracked model performance over time.

Rule of thumb:
- Zero dashes is usually better.
- One dash per paragraph is the maximum unless the user’s style clearly uses them.

### Avoid formulaic contrast

Avoid:
> not only X, but Y

Avoid:
> not just X, it is Y

Rewrite directly.

## What Good Looks Like

Good professional human writing is:

- **Specific**: uses concrete details when known.
- **Honest**: does not oversell.
- **Uneven in a natural way**: sentence lengths vary because ideas vary.
- **Audience-aware**: internal notes do not sound like press releases.
- **Plain**: ordinary things are described ordinarily.

Bad:
> I built the platform, designed the evals, fine-tuned the models, and shipped to field teams.

Better:
> I built the platform from scratch. I also designed the evaluation pipeline so we could track model quality over time instead of reviewing outputs manually.

The goal is not just shorter writing. The goal is writing with real cause, constraint, and consequence.

## Preserve Authenticity

Do not make every sentence smooth.

Keep:
- useful awkwardness
- personal specificity
- grounded uncertainty
- short sentences that land
- details that sound like the user

Remove:
- generic confidence
- fake warmth
- polished symmetry
- motivational filler
- claims that could apply to anyone

## Validation Checklist

Before finalizing, check:

- Does this preserve the original facts and intent?
- Did I remove inflated AI language?
- Did I avoid adding unsupported claims?
- Does the tone fit the audience?
- Are sentence lengths naturally varied?
- Are dashes, stock openers, and formulaic contrasts reduced?
- Would this sound plausible if sent by a real person?

If the answer to any item is no, revise before responding.

## Optional Reference

For a fuller taxonomy of AI-writing tells, consult `references/ai-writing-tells.md` when available.

Use the reference only for difficult reviews or when the user explicitly asks for a detailed AI-writing analysis.