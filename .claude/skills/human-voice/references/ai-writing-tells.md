# AI Writing Tells — Full Reference

Sourced from Wikipedia:Signs of AI Writing. Adapted for professional/business use.
Wikipedia-specific tells (wikitext, infobox markup, etc.) are omitted.

---

## Vocabulary

### High-signal AI words (post-2022 frequency spike)

Using one occasionally may be coincidence. Many in the same document is a strong tell.

**2023–mid-2024 era (GPT-4):**
Additionally (sentence opener), boasts, bolstered, crucial, delve, emphasizing,
enduring, garner, intricate/intricacies, interplay, key (adjective), landscape
(figurative), meticulous/meticulously, pivotal, tapestry (figurative), testament,
underscore (verb), valuable, vibrant

**Mid-2024–mid-2025 era (GPT-4o):**
align with, bolstered, crucial, emphasizing, enhance, enduring, fostering,
highlighting, pivotal, showcasing, underscore, vibrant

**Mid-2025+ era (GPT-5):**
emphasizing, enhance, highlighting, showcasing

### Promotional/puffery vocabulary
boasts a, vibrant, rich (figurative), profound, enhancing, showcasing, exemplifies,
commitment to, natural beauty, nestled, in the heart of, groundbreaking, renowned,
featuring, diverse array

### Filler significance phrases
- "plays a key/crucial/pivotal role"
- "as a testament to"
- "contributing to the broader"
- "stands as" / "serves as" (when "is" works)
- "marks a shift" / "marks a turning point"
- "setting the stage for"
- "reflects broader" / "symbolizing its ongoing"
- "deeply rooted"
- "indelible mark"
- "focal point"
- "evolving landscape"

---

## Content Patterns

### Undue significance inflation
LLMs pad content with statements about how the subject represents or contributes to
a broader theme. Often attached via present participle:

> "Revenue grew 12%, underscoring the team's commitment to excellence."
> "The station has 6 platforms, contributing to the socio-economic development
> of the region."

Fix: cut the participial clause entirely. The fact speaks for itself.

### Vague attribution / weasel wording
Words to watch: "industry reports", "observers have cited", "experts argue",
"some critics argue", "several sources/publications"

LLMs attribute opinions to unnamed authorities or exaggerate how widely a view
is held. Fix: name the source or remove the attribution.

### Canned notability / media coverage emphasis
LLMs prove importance by listing outlets: "has been featured in X, Y, and Z" or
"covered by national and regional media." Also: "maintains an active social media
presence" — particularly idiosyncratic AI phrasing.

### Challenges/Future Outlook formula
Boilerplate section structure:
> "Despite its [positive words], [subject] faces challenges including... Looking
> ahead, [subject] is well-positioned to..."

The tell is the rigid formula, not the mention of challenges.

### Ecosystem/conservation over-emphasis (in biology/environment contexts)
Tenuous connections to broader ecosystems; belaboring conservation status even
when unknown or trivial.

### Knowledge-cutoff disclaimers
> "As of my last knowledge update...", "While specific details are limited...",
> "not widely documented...", "maintains a low profile"

---

## Structure and Formatting

### Rule of three
LLMs pad descriptions with exactly three items for rhythm regardless of whether
three is the natural number:
> "Our team brings expertise, dedication, and innovation."
> "The policy affected workers, families, and communities."

### Inline-header vertical lists
- **Key Benefit**: Description.
- **Another Feature**: Description.

Use prose or a proper table instead.

### Title case headings
AI strongly tends to capitalize all main words in section headers:
> "Impact of Technology and Digitalization"
> "Challenges and Future Directions"

Human writers use sentence case.

### Overuse of bold
Mechanically bolding every instance of a key term or using bold for "key takeaways"
in running prose. Some newer models suppress this.

### Overuse of em dashes
LLMs use em dashes more than nonprofessional human writers of the same genre,
especially to "punch up" clauses in a sales-writing style. Each dash in flowing prose
is a candidate for a sentence break with added reasoning.

---

## Syntax and Grammar

### Avoidance of "is/are" (copula substitution)
LLMs substitute simpler "is/are" constructions with:
- serves as / stands as / marks / represents
- features / offers / boasts / maintains (as synonyms for "has")
- ventured into X as a candidate (vs. "was a candidate")

One study found >10% decrease in "is/are" frequency in academic writing post-2022.

### Negative parallelisms
- "Not only X, but Y"
- "Not just X, it's Y"
- "It is not X. Rather, it is Y."
- Contrast across sentences: "His life, however, took a path that..."

These appear when AI tries to sound emphatic or add nuance.

### Superficial trailing -ing clauses
Appending significance analysis to factual statements:
> "The station opened in 1987, reflecting the city's commitment to modern
> infrastructure."

---

## Tone

### Promotional / advertisement-like language
Even when prompted to write neutrally, LLMs default toward travel-guide or
press-release tone. Older models are more blatantly positive; newer models are
more subtly positive and avoid obvious superlatives.

### Press-release voice for people/companies
> "CEO [Name] emphasized the airline's commitment to sustainability, customer
> focus, and Africa's prosperity through responsible corporate practices."

### Statistical regression to the mean
LLMs omit specific/unusual facts (statistically rare) and replace them with
generic positive descriptions (statistically common). The highly specific becomes
the vaguely important.

---

## Communication Meta-Patterns (talk pages, emails, cover letters)

These appear when AI-generated text is intended as correspondence rather than content.

### Canned quality/policy assurances
> "I understand the importance of adhering to guidelines and am committed to
> contributing in a responsible manner. My intention is to provide well-referenced
> information that aligns with your standards."

### Canned offers to receive feedback
> "I am open to any suggestions. If there are specific areas that need further
> attention, I am more than willing to make adjustments."

### Overwhelmingly exhaustive justifications
Formal first-person paragraphs that itemize compliance with rules, often echoing
the exact wording of the guidelines being addressed.

### Subject lines in body text
AI sometimes prepends "Subject: Request for..." as if filling an email form.

### Stiff phrases
keen to, I am pleased to, I would like to take this opportunity to,
I trust this finds you well, I hope this helps, Of course!, Certainly!,
Would you like me to..., Is there anything else I can help with?

---

## Markup Artifacts (when pasting from chatbot interfaces)

Rarely relevant in business writing but useful for spotting copy-paste AI content:

- **Markdown in plain-text contexts**: `**bold**`, `## headings`, `- bullet`
- **ChatGPT citation artifacts**: `citeturn0search0`, `turn0image0`,
  `:contentReference[oaicite:0]{index=0}`
- **Grok artifacts**: `<grok-card data-id="...">`, `grok_render_citation_card_json`
- **Lenticular bracket citations**: `【85†L261-269】`
- **UTM parameters**: `?utm_source=chatgpt.com`, `utm_source=copilot.com`,
  `referrer=grok.com`
- **Curly quotation marks**: "..." vs "..." (ChatGPT and DeepSeek; Claude and
  Gemini typically do not produce these)
- **Placeholder dates**: `2025-XX-XX` in citations