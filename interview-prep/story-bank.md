# Story Bank — Master STAR+R Stories

This file accumulates your best interview stories over time. Each evaluation (Block F) adds new stories here. Instead of memorizing 100 answers, maintain 5-10 deep stories that you can bend to answer almost any behavioral question.

## How it works

1. Every time `/career-ops offer` generates Block F (Interview Plan), new STAR+R stories get appended here
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

---

### [Adoption / Change Management] PowerShell to CI/CD Automation
**Source:** Report #005 — One Acre Fund — Tupande AI Engineering Lead
**S:** Critical data jobs at MSF ran as ad-hoc PowerShell scripts on individual engineers' machines — no version control, no repeatable deployment.
**T:** Turn tribal scripts into governed infrastructure without stalling the team's delivery.
**A:** Rewrote the scripts as version-controlled Databricks jobs with Terraform IaC and CI/CD deployment; migrated the team's working habits alongside the code, not after it.
**R:** Manual deployments eliminated; operational risk removed from active humanitarian data flows.
**Reflection:** The technical migration took weeks; the behaviour change took months. Adoption is the real deliverable — budget for it explicitly instead of treating it as a rollout afterthought.
**Best for questions about:** organizational adoption, change management, automation, championing new tooling, influencing without authority, infrastructure as code

---

### [Governance / Standards] AI and Data Governance Model
**Source:** Report #005 — One Acre Fund — Tupande AI Engineering Lead
**S:** MSF's AI and data pipelines ran across globally distributed infrastructure with no coherent access-control or data-governance model.
**T:** Design RBAC and governance that met enterprise security requirements without blocking field teams who needed the data.
**A:** Built a custom RBAC model and data-governance framework covering AI and data pipelines; designed it with the teams who would work under it rather than handing it down.
**R:** Compliance achieved with enterprise security requirements across globally distributed infrastructure.
**Reflection:** Governance designed *with* the people who live under it gets followed; governance handed down gets routed around. The technical model was the easy half.
**Best for questions about:** AI governance, establishing standards, RBAC and access control, data governance, compliance, balancing control with usability

---

### [Forward Deployed / Adoption] Egypt Field QA Tooling
**Source:** Report #006 — IFS — Forward Deployed AI Engineer
**S:** Field coordinators in Egypt depended on MSF translation output for operational work but had no way to judge whether it was trustworthy.
**T:** Give non-engineers a way to evaluate model quality themselves, without ML knowledge and without routing every question through engineering.
**A:** Built QA tooling that surfaced quality signals in operational terms rather than as BLEU scores; designed it around what coordinators actually needed to decide, not around what the model emitted.
**R:** Coordinators independently evaluated translation quality; the review bottleneck came off the engineering team.
**Reflection:** The hardest part was never the models. It was helping field teams understand where the system was reliable — and that is a product problem, not a modelling one.
**Best for questions about:** forward-deployed work, customer-facing engineering, non-technical users, human-in-the-loop, driving adoption, translating technical output into business terms

---

### [Enablement / Handoff] MSF Python Enablement and AI Guidelines
**Source:** Report #006 — IFS — Forward Deployed AI Engineer
**S:** Semi-technical MSF staff depended on engineering for analysis work they were capable of doing themselves, and the organisation had no shared position on how AI should be used.
**T:** Transfer capability instead of accumulating dependency, and help set the guardrails.
**A:** Ran Python training sessions for semi-technical staff; contributed to shaping organisational AI usage guidelines.
**R:** Staff self-served on work that previously queued behind engineering; the guidelines gave the org a consistent position on AI use.
**Reflection:** Handoff is a design decision, not a final phase. If you build it so only you can run it, you have not finished.
**Best for questions about:** enablement, mentorship, knowledge transfer, customer handoff, AI governance and policy, influencing without authority

---

### [Integration / Delivery Speed] Dropshirt Enterprise Integration Layer
**Source:** Report #006 — IFS — Forward Deployed AI Engineer
**S:** Merchants needed to connect existing commerce stacks to the Dropshirt platform, and onboarding was the growth bottleneck.
**T:** Make third-party integration fast and repeatable rather than bespoke per merchant.
**A:** Integrated Mollie, Shopify, and WooCommerce; built a common abstraction over inconsistent third-party APIs so each new merchant was configuration rather than code.
**R:** Merchant onboarding time cut to under 24 hours.
**Reflection:** Every vendor's sandbox lies. Budget integration time for the gap between the documentation and production behaviour, not for the happy path.
**Best for questions about:** enterprise API integration, middleware, delivery speed, reducing onboarding friction, working around third-party constraints

---

### [Orchestration / Guardrails] Trading Platform Multi-Stage Orchestration
**Source:** Report #006 — IFS — Forward Deployed AI Engineer
**S:** An automated equity trading pipeline needed to make decisions that no single model should be trusted to make unsupervised.
**T:** Orchestrate signal generation, risk validation, and code-quality enforcement with guardrails that actually held.
**A:** Designed explicit hand-offs between stages with evaluation checkpoints at each boundary; enforced code quality automatically through SonarQube and Radon; added scheduled retraining and performance monitoring.
**R:** A live pipeline safe enough to leave running unattended.
**Reflection:** Guardrails are cheaper than recovery. The checkpoints that felt like overhead in week one are exactly what made it safe to walk away from.
**Best for questions about:** multi-agent orchestration, human-in-the-loop design, guardrails and safety, automated evaluation checkpoints, production ML reliability

---

### [Stakeholder Influence] Talaria: Engineer to Business Lead
**Source:** Report #005 — One Acre Fund — Tupande AI Engineering Lead
**S:** The Boeing GoFly eVTOL program had a credible technical concept but needed funding and external partners to keep going.
**T:** Move from leading the powertrain build to owning partnerships and roadmap as the programme scaled.
**A:** Led 10+ engineers across powertrain and controls to deliver sub-systems in 12 months, then pivoted to driving cross-team coordination and external stakeholder alignment.
**R:** Competitive eVTOL prototype delivered; €50k in sponsorship funding secured.
**Reflection:** Technical credibility is what makes stakeholder influence stick. The pivot only worked because I had built the thing first — the partners were buying a demonstrated system, not a pitch.
**Best for questions about:** stakeholder influence, business acumen, IC-to-leadership transitions, cross-functional coordination, securing buy-in and funding, technical leadership at scale
