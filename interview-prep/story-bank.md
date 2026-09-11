# Story Bank — Master STAR+R Stories

This file accumulates your best interview stories over time. Each evaluation (Block F) adds new stories here. Instead of memorizing 100 answers, maintain 5-10 deep stories that you can bend to answer almost any behavioral question.

**Rebuilt 2026-08-22** from the validated technical-evidence review in `careerops_implementation_handoff.md` § 13. Every story below is traceable to `cv.md`. The `**Caveats:**` line on each story lists what must NOT be claimed — those are as binding as the story itself, and several are enforced mechanically by `config/cv-facts.json`.

## How it works

1. Every time `/career-ops offer` generates Block F (Interview Plan), new STAR+R stories get appended here
2. Before your next interview, review this file — your stories are already organized by theme
3. `node match-star.mjs "<question>"` scores these stories against a behavioural question and formats the best match to ATS paste length
4. The "Big Three" questions can be answered with stories from this bank:
   - "Tell me about yourself" → combine 2-3 stories into a narrative
   - "Tell me about your most impactful project" → pick your highest-impact story
   - "Tell me about a conflict you resolved" → find a story with a Reflection

**Field labels matter.** `match-star.mjs` parses `**S (Situation):**` / `**T (Task):**` / `**A (Action):**` / `**R (Result):**` / `**Reflection:**` / `**Best for questions about:**`, one line each. A story written with short labels (`**S:**`) is invisible to the matcher.

## Coverage map

| Theme | Story |
|-------|-------|
| End-to-end system ownership · architecture trade-offs · performance · reliability | SharePoint Platform Modernization |
| Reusable platform design · technical debt · security integration · influencing adoption | Reusable Authentication Modernization |
| Pragmatic backend architecture · avoiding overengineering · delivery | Translation Backend |
| Methodological ML judgement · failure · knowing when to stop | Trading System |
| Failure and learning · risk · supplier verification · physical systems | Talaria Supplier Failure |
| Technical leadership in a physical system · trade studies · delegation | Talaria Powertrain Architecture |
| Vendor and technical governance · disagreement · escalation · ownership | Dropshirt Vendor Intervention |

## Stories

<!-- Format (indented one space so the parser does not read this comment as a story):
 ### [Theme] Story Title
 **Source:** Report #NNN — Company — Role
**S (Situation):** ...
**T (Task):** ...
**A (Action):** ...
**R (Result):** ...
**Reflection:** What I learned / what I'd do differently
**Best for questions about:** [list of question types this story answers]
-->

### [Platform Ownership / Reliability] SharePoint Platform Modernization
**Source:** cv.md — MSF, AI Software Engineer (Nov 2024 – Jan 2026)
**S (Situation):** MSF relied on old PowerShell-based processes to crawl SharePoint mission sites, with API throttling, ad-hoc retries, Excel-based error handling and brittle multi-stage processing; the service principal I worked with covered 30 Amsterdam-managed mission sites inside the global tenant.
**T (Task):** Build a maintainable, queryable platform for operational SharePoint data at multi-million-item scale, and hand it over to the internal consumers who would live with it.
**A (Action):** Built a direct Microsoft Graph REST integration and used SharePoint REST only where Graph lacked the capability; implemented Graph delta synchronization with state persisted roughly per library; handled pagination, retry/backoff, duplicate and overlapping responses, soft deletion and source-level failure isolation so one bad source could not block a run; retained raw JSON in bronze for debugging; built Delta bronze/silver/gold layers; owned the dbt transformations, tests and dimensional model; deployed through Databricks Asset Bundles with dev/prod separation and CI/CD; trained the downstream IT consumer and handed over query patterns.
**R (Result):** 3.2m+ items processed across 30 Amsterdam-managed mission sites, full runs completing in under 30 minutes and weekly incremental runs in under 5 minutes, replacing the brittle PowerShell/Excel process with clean, queryable operational data.
**Reflection:** Performance improvements usually come from choosing a better system boundary or algorithm rather than micro-optimizing compute — I moved off brittle SDK and legacy layers to first-party APIs, tested whether concurrency actually helped instead of assuming it, and stopped short of Spark tuning once it was clear Graph I/O dominated. Reliability is a design decision too: partial failure and restart semantics have to be specified, not discovered.
**Best for questions about:** most difficult technical problem, architecture decisions, end-to-end ownership, handling ambiguity, reliability and failure handling, performance work, legacy modernization, system design, stakeholder management, trade-offs, delivery and handover
**Caveats:** Scope is 30 Amsterdam-managed mission sites, NOT the global MSF tenant. Do not reuse the retired "4 days → 30 minutes" claim. Do not claim deep Spark performance specialization. Do not assert exact historical checkpoint semantics beyond delta sync with per-library state.

---

### [Reusable Platform Design] Reusable Authentication Modernization
**Source:** cv.md — MSF, AI Software Engineer
**S (Situation):** Existing Microsoft-integrated pipelines relied on brittle and partly deprecated authentication paths built on third-party abstraction layers, which made credential changes risky and certificate handling awkward.
**T (Task):** Provide a maintainable migration path across multiple credential modes and improve certificate handling, without forcing every pipeline to be rewritten at once.
**A (Action):** Designed an authentication abstraction and credential factory around Azure Identity that hid credential-specific token logic from callers; supported transitional credential methods while warning on deprecated paths; accounted for SharePoint-specific token behaviour; solved certificate formatting and upload problems; added reusable Azure Key Vault certificate tooling to the shared open-source MSF Toolbox; wrote broad tests; and argued the case internally for first-party identity libraries over convenience wrappers.
**R (Result):** A reusable capability that other pipelines could adopt incrementally, with adoption beginning across the Data & Analytics pipelines before I left.
**Reflection:** Core platform integrations are better served by a thin, well-designed abstraction over first-party primitives than by a brittle third-party convenience layer — the abstraction earns its place only if it makes the migration path shorter for the next team, which is why I shipped it as shared tooling rather than as project-local code.
**Best for questions about:** architecture decisions, simplifying complexity, building reusable tooling, technical debt, security and identity integration, migrations, influencing adoption without authority, designing for other engineers
**Caveats:** Do not claim organisation-wide standardisation — adoption was beginning, not complete. Do not describe this as critical-vulnerability remediation or as eliminating an MFA bypass risk. Exact certificate lifecycle and cryptographic details are not established.

---

### [Pragmatic Architecture] Translation Backend — Right-Sized System Design
**Source:** cv.md — MSF, AI Software Engineer
**S (Situation):** MSF wanted to evaluate internal translation approaches with a small population of evaluators, across several external AI, translation, speech and document services.
**T (Task):** Build and deploy a usable evaluation application with acceptable latency, including background document and speech workflows, without building infrastructure the use case did not justify.
**A (Action):** Designed a fully asynchronous FastAPI backend; integrated Azure, OpenAI, Anthropic, Hugging Face, DeepL, speech and document services; implemented background jobs for long-running work; containerized frontend and backend separately; set up Azure DevOps CI/CD, a container registry and Terraform infrastructure; chose lightweight SQLite and Blob persistence appropriate to the expected scale; deliberately skipped rate-limiting and worker complexity that the load did not warrant; and recommended against Streamlit on performance and UX grounds.
**R (Result):** The application shipped and met its latency expectations; the evaluation app itself saw limited direct adoption, while the document-translation endpoint was later reused more broadly through the organisation-wide chatbot.
**Reflection:** Architecture should reflect the actual scale and the actual users — unnecessary infrastructure makes a prototype harder to deliver and harder to operate, and the part of this system that survived was the small, well-shaped endpoint rather than the application around it.
**Best for questions about:** architecture and design decisions, pragmatic trade-offs, avoiding overengineering, delivery under constraints, third-party integration, applied AI in a production system, stakeholder management, a project that did not land the way you expected
**Caveats:** Do not call it a widely adopted production platform. The exact Azure hosting product is uncertain. The ~€150k figure was addressable third-party licensing spend, NOT realized savings — prefer omitting it. Fine-tuning was Azure-managed, never custom training infrastructure. Do not use the retired "+18 BLEU" figure.

---

### [Judgement / Knowing When to Stop] Trading System — Methodological Discipline
**Source:** cv.md — Selected Engineering Project
**S (Situation):** I wanted to know whether a classical-ML long/short strategy over S&P 500 constituents could survive honest validation, so I built the research and paper-trading system myself rather than trusting a backtest library's defaults.
**T (Task):** Build a methodology that avoided the standard historical-testing errors and could run automatically against IBKR, then decide honestly whether the result justified real capital.
**A (Action):** Purchased point-in-time S&P 500 membership data to remove survivorship bias; implemented walk-forward, non-overlapping temporal folds; added explicit code-level leakage guards; modelled transaction costs and slippage; ranked constituents to build long/short portfolios; built strategy optimization and then reviewed the whole-strategy optimisation critically; containerized the system and automated headless IBKR paper trading.
**R (Result):** The system paper traded for several months and broadly tracked the backtest over that limited period, and I deliberately stopped before deploying live capital because strategy-level meta-overfitting risk remained material.
**Reflection:** Good engineering and research judgement includes stopping when the evidence quality does not justify deployment — a sophisticated optimizer does not compensate for an invalid experimental design, and the most valuable thing I built was the validation harness, not the model.
**Best for questions about:** a difficult technical project, experimental design, data leakage, methodological rigor, trade-offs, failure, judgement, a decision to stop or say no, risk awareness, what you learned from a project that did not ship
**Caveats:** No demonstrated live alpha. No professional quant expertise, no deep financial econometrics claim, no persistent performance claim.

---

### [Failure / Risk] Talaria Supplier Failure
**Source:** cv.md — Talaria B.V. / Boeing GoFly (2018–2020)
**S (Situation):** Talaria used a budget-constrained propeller shaft manufactured by an external supplier for an eVTOL prototype, and under deadline and equipment constraints only one shaft was available.
**T (Task):** Verify the shaft well enough to integrate it into a flight prototype, with the verification tools and time actually available to a student team.
**A (Action):** Ran pre-integration checks covering dimensions and spin testing, but did not obtain material certification or perform destructive load testing on a sample; integrated the shaft and proceeded to a tethered test; after the aircraft struck a wall under maximum control input and the shaft failed, ran the post-failure inspection that showed the supplier had effectively manufactured it as two joined pieces, invalidating the continuous-shaft assumption the design rested on.
**R (Result):** The failure exposed a major supplier-verification weakness in how we sourced and accepted critical hardware, and changed how the team handled critical-component procurement afterwards.
**Reflection:** For critical hardware you have to name the dominant failure modes explicitly, procure redundant critical parts where practical, destructively test one part against the critical load path, and refuse to let deadline pressure quietly delete a verification step — the checks we ran confirmed geometry, which was never the risk.
**Best for questions about:** failure and what you learned, risk management, supplier and vendor verification, an engineering decision you would make differently, physical testing, working under deadline pressure, technical leadership, safety-critical judgement
**Caveats:** Describe accident causality carefully — the impact and the defect both contributed. This was undergraduate student-team engineering; do not imply aerospace certification experience.

---

### [Technical Leadership / Physical Systems] Talaria Powertrain Architecture and Subsystem Leadership
**Source:** cv.md — Talaria B.V. / Boeing GoFly (2018–2020)
**S (Situation):** An early-stage student eVTOL team had to choose a propulsion architecture under competition rules and hard weight, size and technology-maturity constraints, with no settled answer at the start.
**T (Task):** Lead the powertrain and subsystem engineering, and coordinate the design work across the people assigned to it.
**A (Action):** Compared propulsion architectures and evaluated piston versus electric approaches; designed the bevel gearbox and propeller shafts; performed CAD and FEM work and standard mechanical analysis covering bearings, gears, loads, clearance and lubrication; delegated work to two full-time student engineers plus additional part-time contributors; coordinated interfaces with the other engineering leads; and deliberately sought review from more experienced engineering leadership before critical hardware was manufactured and tested.
**R (Result):** Substantial subsystem design and prototype integration work was completed as the team converged on electric propulsion.
**Reflection:** Strong subsystem ownership means knowing which decisions are mine to make alone and which ones have physical consequences serious enough to justify pulling in someone more experienced — the judgement is in telling the two apart, not in maximising autonomy.
**Best for questions about:** technical leadership, architecture and trade-off decisions, physical and multidisciplinary systems, handling ambiguity, delegation, coordinating across teams, knowing when to escalate
**Caveats:** Powertrain and subsystem engineering only — do NOT attribute controls work. Undergraduate context must stay clear. Do not imply recent professional mechanical-engineering expertise.

---

### [Technical Governance / Ownership] Dropshirt Vendor Intervention
**Source:** cv.md — Dropshirt B.V., Co-Founder & CTO (2021–2023)
**S (Situation):** Dropshirt outsourced its core ecommerce application to an external engineering team, and over time delivery slowed and maintainability got visibly worse while the business depended on the product.
**T (Task):** As co-founder and CTO, work out whether that team and that architecture could carry the business, and intervene if not.
**A (Action):** Learned enough of the Next.js codebase and its context to inspect quality first-hand rather than relying on status reports; identified overengineered microservice boundaries, convoluted infrastructure, weak API extensibility, missing tests, poor migration capability and credentials exposed in the frontend; documented the pattern of recurring maintainability and delivery problems; and replaced the original vendor team through an existing professional contact rather than continuing to escalate inside a relationship that was not improving.
**R (Result):** The architecture became substantially cleaner, the recurring defects were resolved, and the product reached a stable state before its sale to a Belgian buyer.
**Reflection:** Outsourcing does not outsource technical accountability — founder-side ownership requires enough implementation understanding to judge maintainability, security and vendor quality yourself, because by the time the symptoms are visible on a roadmap it is already expensive.
**Best for questions about:** disagreement and escalation, poor technical quality, vendor and stakeholder management, ownership, architecture review, requirements engineering, working through ambiguity, a hard call you had to make
**Caveats:** The core production application was OUTSOURCED — do not claim personal architecture or implementation of the platform, and do not present this as conventional engineering-team management. Commercial figures (ARR, CAGR, DAUs) are unvalidated and must not be used as established evidence.

---

## Conditional story — do not lead with it

**Drone-navigation refactoring and deployment.** Useful only when a role specifically asks about inheriting someone else's code, Jetson/Linux deployment, or walking away from technical debt. The supported evidence is Python refactoring, version-control and abstraction cleanup, Jetson deployment, and the judgement that the system needed a fundamental redesign rather than another patch. The navigation algorithms were **inherited** and live quantitative performance was never established — this is not a robotics, computer-vision or SLAM story, and must never be used as primary evidence of algorithm expertise.
