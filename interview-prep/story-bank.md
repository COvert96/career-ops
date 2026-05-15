# Story Bank — Master STAR+R Stories

This file accumulates your best interview stories over time. Each evaluation (Block F) adds new stories here. Instead of memorizing 100 answers, maintain 5-10 deep stories that you can bend to answer almost any behavioral question.

## How it works

1. Every time `/career-ops oferta` generates Block F (Interview Plan), new STAR+R stories get appended here
2. Before your next interview, review this file — your stories are already organized by theme
3. The "Big Three" questions can be answered with stories from this bank:
   - "Tell me about yourself" → combine 2-3 stories into a narrative
   - "Tell me about your most impactful project" → pick your highest-impact story
   - "Tell me about a conflict you resolved" → find a story with a Reflection

## Stories

<!-- Stories will be added here as you evaluate offers -->
<!-- Format:
### [Theme] Story Title
**Source:** Report #NNN — Company — Role
**S (Situation):** ...
**T (Task):** ...
**A (Action):** ...
**R (Result):** ...
**Reflection:** What I learned / what I'd do differently
**Best for questions about:** [list of question types this story answers]
-->

### [Impact / Agentic AI] MSF AI Translation Platform
**Source:** Report #049 — Neno — AI Engineer
**S:** MSF paying EUR 150k/year to a third-party SaaS for field translation across active humanitarian missions.
**T:** Architect and ship a replacement in-house — no team, no template, no precedent.
**A:** Built FastAPI + Azure AI Foundry agentic pipeline; designed context engineering for medical-domain LLMs; fine-tuned multilingual models; built BLEU evaluation framework and QA dashboard; deployed globally.
**R:** EUR 150k annual savings; live across multiple active global field missions.
**Reflection:** Would build the evaluation framework before shipping v1 — production signals revealed gaps that offline BLEU didn't catch. The observability layer should be day-one infrastructure, not a retrofit.
**Best for questions about:** end-to-end AI delivery, measurable impact, agentic systems, build-vs-buy decisions, production LLM engineering, context engineering

---

### [Evaluation / Observability] BLEU Scoring Pipeline and QA Dashboard
**Source:** Report #049 — Neno — AI Engineer
**S:** Production LLM models degraded silently — no visibility until users noticed translation quality drops.
**T:** Build monitoring that catches regressions before they reach users.
**A:** Designed scheduled BLEU scoring pipeline; built QA dashboard with automated alerts on score drops; integrated into CI/CD.
**R:** Removed manual review bottleneck; enabled continuous model improvement in production.
**Reflection:** Automated evals need a human review step for distribution shifts — a score that holds on your test set can still fail on next week's real-world data.
**Best for questions about:** evaluation frameworks, observability, production ML, quality assurance, preventing silent failures

---

### [Early-Stage Ownership] Dropshirt Zero to EUR 100k ARR
**Source:** Report #049 — Neno — AI Engineer
**S:** Two co-founders, zero product, real customers waiting, EUR 0 revenue.
**T:** Build a full-stack platform, ship it, and grow it into a business as the sole technical founder.
**A:** Architected Next.js/AWS platform; integrated Mollie, Shopify, WooCommerce; hired and led 6-person team; ran Agile sprints.
**R:** EUR 100k ARR, 1,900+ DAUs, ~800% CAGR within 12 months.
**Reflection:** Shipping fast beats shipping right at stage 0 — but technical debt compounds at the pace of revenue. Learned to time refactors to funding milestones, not to discomfort.
**Best for questions about:** early-stage experience, startup ownership, product delivery, technical leadership, founding engineer fit

---

### [Automation / Pipeline] Databricks ETL Re-engineering
**Source:** Report #049 — Neno — AI Engineer
**S:** Data team waited 4 days per full ETL cycle — zero real-time operational reporting possible.
**T:** Re-architect 3 pipeline systems without disrupting active humanitarian operations.
**A:** Rebuilt with medallion pattern; eliminated unnecessary full refreshes; Terraform IaC; CI/CD-managed Databricks jobs.
**R:** 4 days -> 30 minutes end-to-end. Near-real-time operational reporting enabled.
**Reflection:** The speedup wasn't the architecture — it was eliminating unnecessary full refreshes. Always profile before refactoring; assumptions about bottlenecks are almost always wrong.
**Best for questions about:** automation, pipeline optimization, reducing manual effort, infrastructure as code, reliability

---

### [Reliability / Security] Authentication Vulnerability Remediation
**Source:** Report #049 — Neno — AI Engineer
**S:** Shared credentials across 3 production pipelines carrying live humanitarian data — MFA bypass risk.
**T:** Remediate without triggering downtime across active field missions.
**A:** Replaced shared credentials with Python certificate-based auth module; phased rollout with rollback plan; zero-downtime migration.
**R:** All 3 systems remediated; zero incidents during migration.
**Reflection:** Security debt is invisible until it isn't. Document the before-state explicitly so the organisation retains institutional memory of why the control exists.
**Best for questions about:** production reliability, security engineering, risk management, high-quality standards, working under pressure
