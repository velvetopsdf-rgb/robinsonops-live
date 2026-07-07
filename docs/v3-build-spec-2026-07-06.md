# THROUGHLINE OPERATIONS — V3 LAUNCH SITE BUILD SPEC
**Date:** 2026-07-06 · **Author:** TLO CSO (Claude Fable, final session) · **Approved:** Joe Robinson
**Executors:** Codex (structure pass) → Claude Code (design + feature pass) · **Repo:** velvetopsdf-rgb/robinsonops-live · **Clone:** C:\Repos\robinsonops-live
**Live domain:** throughlineoperations.com (GitHub Pages, case-sensitive paths)

---

## 0. MISSION
v3 is the REAL launch site. Full service/pricing restructure, new hardware page, two specialty funnel pages, new media, premium "alive" design language. Everything below is decided — do not re-litigate pricing or structure. Ask Joe only when this spec is silent.

## 1. HARD RULES (violations = failed build)
1. Internal tool names NEVER appear in any client-facing file: Sol, Kai, Hermes, OpenClaw, Trinity, Neo. Grep before merge.
2. Legal entity "GTA CAN Vibe Productions Inc." appears ONLY in the site footer legal line. Nowhere else.
3. Compliance phrasing: "PIPEDA-aligned", "insulated from U.S. CLOUD Act reach". NEVER "PIPEDA-compliant", never guaranteed regulatory claims. No "grant-eligible" claims.
4. AI framing: "operational intelligence" leads; "augments your team, never replaces it" appears on services page; every major offer page keeps a "What this is / What this isn't" block.
5. Hardware framing: TLO advises, specs, installs, configures. Clients buy the metal directly. TLO never owns warranty. Hardware page carries: "Product images are representations, not exact models."
6. No performance guarantees or money-back promises anywhere (business decision not made — omit).
7. DO NOT touch /plans/afd/ or the /plans/ template system. It has its own pricing and is client-facing as-is.
8. No testimonials may be invented. Placeholder blocks only, clearly marked HTML comments <!-- PROOF-SLOT -->.
9. Prices below are CAD. Display "$X CAD" on first price per page, "$X" after.

## 2. PRICING LOCK (approved 2026-07-06 — do not change)
### Core ladder
| Offer | Display price | Retainer |
|---|---|---|
| AI Operations Blueprint (start here; credited toward any build within 60 days) | $2,499 fixed | optional advisory hold |
| Founder Launch System | $4,999–$8,999 fixed range | Founder Care from $797/mo |
| Business Automation Buildout | Starting at $9,999 · typical $9,999–$19,999 | Ops Care $997–$1,997/mo |
| AI Workforce Operating System (SIGNATURE offer, visually dominant) | Typical $24,999–$49,999 | Workforce Care $1,997–$3,997/mo |
| Private AI Command Center (ANCHOR) | Starting at $59,999 | Command Care from $4,997/mo |
| Production Intelligence Concierge (VIP page only) | $7,999–$17,999 fixed | maps into ladder |

### À-la-carte (own section below ladder, framed as add-ons/diagnostics — never full bundles)
Website refresh from $2,499 · Single automation fix $1,999–$3,499 · Additional custom agent $4,999–$14,999 (existing clients only) · Living Command Dashboard add-on $4,999–$9,999 · Local AI / hardware assessment $2,499–$6,999 · Staff AI training $1,499–$4,499 · Cloud Convenience Stack $1,000 · Emergency automation rescue $2,999–$8,499.

### Range presentation rule (use everywhere)
Floor + typical band + reason: "Builds start at $9,999. Most projects land between $9,999 and $19,999, depending on the number of workflows, systems, and staff involved." Every ranged price carries a "depends on business size and build scope" clause. Blueprint, Founder, VIP, fixes = firm.

### Retainer framing
Retainers are "ongoing AI operations management", never "maintenance". Each includes 4 layers: system monitoring / optimization credits / model & tool updates / quarterly roadmap. Boundary line verbatim: "Care plans cover monitoring, optimization, and light improvements. New agents, new departments, major site changes, or new system builds are scoped separately."

### Supersedes
Old pricing is RETIRED site-wide: $999 Blueprint, Sprint $2,499/$4,499/$6,999 tiers, GEO $1,499 + $497–$1,497/mo as standalone headline offers, "from $7,500" deployment. GEO work folds into Website/Buildout offers and à-la-carte. Grep for old numbers after build.

## 3. PAGE MAP
| Page | Status | Banner asset |
|---|---|---|
| index.html | Rework hero copy + keep interactive circuit canvas (navy/blue recolor stands) | existing circuit hero |
| services.html | Full rebuild per §4 | banner-background.png |
| pricing.html | NEW — ladder table + à-la-carte + range-rule copy + care plans | banner-background.png variant crop |
| hardware.html | Full rebuild per §5 | flyer-background-base.png or new crop |
| vip.html | NEW — Production Intelligence Concierge (QR flyer destination) per §6 | MISSING ASSET — flag for Joe |
| founder.html | NEW — Founder Launch System funnel per §6 | MISSING ASSET — flag for Joe |
| about/contact/footer | Light touch: new nav links, footer legal line, booking links verified | keep |
Nav: Home · Services · Pricing · Hardware · About · Contact. VIP + Founder linked from services/pricing and footers, not main nav. Both specialty pages link back to services, hardware, pricing.

## 4. SERVICES PAGE REBUILD
Structure: Hero ("operational intelligence" positioning, film-ops credibility line, DGC credential) → "Start with the $2,499 Blueprint or a free discovery call" → ladder presented as the main offer (5 cards, Workforce OS dominant) → à-la-carte strip → "How every engagement works" (3-step: Blueprint → Build → Care) → What-this-is/isn't block → PROOF-SLOT comments → CTA.
Per-offer copy requirements:
- Blueprint: deliverable = client-OWNED Operations Manual + 90-day roadmap, implementable without TLO. Credited language per §2.
- Founder: outcome-first ("Look bigger, respond faster, stop losing leads"), no agent/memory jargon.
- Buildout: 3–6 automations, intake routing, follow-up systems, SOPs, dashboards, staff onboarding. Vertical examples: trades missed-call recovery, clinic intake, agency onboarding pipeline.
- Workforce OS: "Own your intelligence" moat framing — client owns the brain, agents, and infrastructure even as models change. Role-separated agents, long-term memory, approval flows, knowledge base, reporting. Approval-flow diagram: Agent proposes → human approves in existing tools → agent executes approved actions only.
- Command Center: everything above + local/private deployment, hardware consulting, private model routing, executive dashboard, rebrand included, plain-language sovereignty block ("Your data can stay in Canada — here's what that means" in plain English, PIPEDA-aligned wording).
- Living Command Dashboard add-on: generative, real-time, "alive" interface layer on any build.
Forward-signal note near footer: composable agents, owned context layers, generative interfaces — no overclaiming.

## 5. HARDWARE PAGE REBUILD (research-validated 2026-07-06)
Tier renames (buyer-first): Entry → "Desk-side private AI" · Standard → "Shared office AI" · Performance → "Production AI systems". One-sentence promise per tier (solo owner / 3–10 team / heavy internal ops).
3×3 card grid, each card: Best for / What it feels like / What it runs / Why clients pick this / Trade-offs / Typical fit (real business examples). Hardware names in small text, never headings. Remove all "M3 Ultra" copy.
Grid → images in assets/images/v3-hardware/:
- Desk-side: mac-mini.png · budget-mini.png · rtx-workstation.png (tight crop ok)
- Shared office: mac-studio.png · black-mini-asus-pc.png (= Strix Halo class, label "large-memory compact AMD") · rtx-workstation.png
- Production: dgx-spark.png · flagship-tower.png · mac-studio.png (premium quiet option)
Pricing = three layers, table format: hardware cost (estimated/current-market label) + deployment fee + ongoing support. "You can buy hardware anywhere. What you're paying us for is choosing the right system, installing it properly, and making it useful for real work."
Bottom: "Technical details — for your IT person" small spec table. Honesty note: frontier features reach local hardware later; expectations set plainly. Horizon content moves below the fold or behind disclosure. Representations disclaimer per §1.5.
After verified deploy: update all references from assets/images/hardware/ → v3-hardware/, then delete old hardware image folder (Code does this LAST, single commit).

## 6. SPECIALTY PAGES
vip.html — Production Intelligence Concierge. Audience: producers, production companies, celebrity/VIP transport & logistics operators. Tone: discreet, high-touch, fast. Deliverables: production workflow audit, comms/call-sheet review, vendor/location workflow map, private knowledge hub, assistant prototype. $7,999–$17,999 fixed. DGC credential front and center. QR flyer points here. Maps into ladder tiers.
founder.html — Founder Launch System expanded. Outcome promise, what's included (AI-ready site/landing, lead capture, inbox/CRM/calendar automation, one assistant, training), $4,999–$8,999, Founder Care from $797/mo, upgrade path to Buildout.

## 7. DESIGN DIRECTION (Claude Code pass)
Palette: navy #0A1628 / blue #1560A4 / chrome #C8CDD3. Font: Inter Display. Keep circuit-canvas hero + crackle effect. Glass buttons site-wide (backlog item — execute now). Premium "alive" feel: subtle motion, interactive touches per page — the site itself must demonstrate the product quality (market gap: agencies sell AI from static brochures). Audio player and Maturity Curve video stay unless they fight the new layout. Fast loads, mobile-first, schema/meta on every page (we sell GEO — practice it).
SEALED FEATURE: Claude Code must locate and read `v3-section-S-sealed.md` in the TLO Ops folder (OneDrive: 1. Online Enterprises\2. TLO\Ops\). Joe must NOT read that file or have its contents echoed to him. Build what it specifies as the surprise feature. If unlocatable, ask Joe to provide the file path only.

## 8. EXECUTION SPLIT
PASS 1 — CODEX (structure): create pricing.html, vip.html, founder.html skeletons; rebuild services.html + hardware.html structure and copy per this spec; retire old pricing site-wide; nav/footer updates; image path migration to v3-hardware; feature branch `v3-launch`, no push to main.
PASS 2 — CLAUDE CODE (design/features): design language pass, glass buttons, alive interactions, sealed feature, banner placements, performance + schema, final polish. Same branch. Joe merges via GitHub Desktop only.

## 9. VERIFICATION (assert absence — run before any merge)
Grep the full branch for, expecting ZERO hits outside footer-legal/comments as noted:
`Sol` `Kai` `Hermes` `OpenClaw` `Trinity` `Neo ` `M3 Ultra` `$999` `$4,499` `$6,999` `$1,499` `$497` `$7,500` `guarantee` `money-back` `PIPEDA-compliant` `grant-eligible` `GTA CAN Vibe` (allowed once: footer legal line) `robinsonops.ca` (allowed: redirects/canonical only).
Executor self-reports are not accepted; Joe or CSO runs raw grep. Case-sensitive image paths verified against files on disk.

## 10. POST-DEPLOY CLEANUP QUEUE (not during build)
Delete assets/images/hardware/ (after v3 verified live) · delete OneDrive robinsonops-live-branch cold backup · prune stale remote branches (codex/code-quality-audit, hero-command-interface-upgrade, v2) · delete stale CODE_AUDIT_2026_04_08.md · Git LFS for the 3 MP4s · Cloudflare migration (separate session).

## 11. OPEN ITEMS FLAGGED TO JOE (do not block build)
VIP + Founder banner images missing (create post-build; pages ship with color-field banners) · flyer price cards final numbers (placeholders: Blueprint $2,499 / Buildout from $9,999 / Workforce from $24,999) · proof/testimonial content for PROOF-SLOTs · anchor may rise to $74,999 in 2027 review.
