# SurgiRecord — Competitive Audit & Strategy

**Domain:** surgirecord.com.au
**Date:** 2026-03-23
**Market:** Australian surgical day hospital software

---

## Executive Summary

The Australian day hospital software market has a clear gap: **no product delivers clinical-first, tablet-first, day-surgery-specific digital records** at an accessible price point. Existing players fall into four buckets — billing/admin tools, enterprise hospital systems, care pathway platforms, and scheduling/analytics overlays. None adequately serve the clinical floor of an independent day hospital.

SurgiRecord's positioning: **own the clinical record** from admission to discharge, purpose-built for day surgery nursing, anaesthetic, and surgical staff.

---

## Competitor Analysis

### 1. MedicalDirector Day Surgery + Bluechip (Telstra Health)

**Category:** Billing/admin-first day surgery module
**Market position:** Large installed base via Telstra Health distribution

**Strengths:**
- Massive installed base
- Strong ICD coding compliance (PHDB, HCP, VAED, ISAAC, QHAPDC)
- Federal + state statutory reporting
- Complex ECLIPSE billing, band-level theatre/accommodation billing
- Health fund extract integration

**Shortcomings:**
- Admin/billing first, clinical second — no real intra-operative clinical record
- No digital surgical safety checklist or count sheets
- No anaesthetic record
- No nursing assessments (falls risk, pressure injury, VTE)
- Desktop-era UI — not tablet/mobile friendly
- No patient portal for pre-admission

**Assessment:** Billing shell, not an EMR. Strong on the admin side, absent on the clinical floor.

---

### 2. Direct CONTROL Medical (DCM)

**Category:** Hybrid business + clinical solution
**Market position:** 15+ years serving Day Hospitals Australia members. Strongest direct competitor.

**Strengths:**
- Full pre-admission to discharge workflow
- Patient portal (demographics, insurance, pre-admission questionnaire, IFC)
- Online eligibility checks (Medicare/DVA/health funds)
- In-hospital claims, automated billing
- My Health Record integration
- 3M Grouper/Codefinder for coding
- SMS confirmations, Telehealth via Teams
- Migration paths from legacy systems (Bluechip, Simday, ZedMed, etc.)
- Active Directory security, full audit trail

**Shortcomings:**
- Clinical depth unclear — observations listed but no detailed intra-operative record
- No anaesthetic charting or count sheet functionality apparent
- Falls/pressure risk mentioned but unclear if validated assessment tools
- No operation report templating
- No implant tracking
- UI appears dated
- No AI/smart defaults or modern UX

**Assessment:** Best current option for day hospitals wanting admin + some clinical in one package. But still fundamentally a practice management system with EMR bolted on — not a clinical-first tool designed for nurses on the floor.

---

### 3. SurgiNet (Oracle/Cerner)

**Category:** Enterprise perioperative module
**Market position:** Major public health networks (Western Health, etc.)

**Strengths:**
- Deep intra-operative documentation
- Anaesthesia module (SurgiNet Anaesthesia)
- Surgeon preference cards
- Real-time meds/fluids/care visibility via PowerChart

**Shortcomings:**
- Enterprise hospital system — not designed for independent day hospitals
- Massive implementation cost + timeline
- Requires full Cerner ecosystem
- Overkill for 2-3 theatre day surgery
- Complex, steep learning curve

**Assessment:** Wrong market segment. Serves large public hospitals, not independent day surgeries.

---

### 4. Centricity Opera (GE HealthCare)

**Category:** Theatre management/scheduling
**Market position:** International theatre logistics tool

**Strengths:**
- Intelligent scheduling, materials/resource management
- Real-time theatre suite visibility

**Shortcomings:**
- Theatre management only — no clinical records
- No patient-facing documentation
- No nursing assessments or perioperative forms
- Not Australian-specific compliance

**Assessment:** Scheduling layer, not clinical. Potentially complementary.

---

### 5. Altera Digital Health (Sunrise + Provation iPro)

**Category:** Integrated OR system with EHR + AIMS
**Market position:** New to Australian market (Latrobe Regional Health, May 2025)

**Strengths:**
- Single clinical record pre-admission to discharge
- Integrated anaesthesia information management
- Modern architecture

**Shortcomings:**
- Enterprise hospital play — price prohibitive for day hospitals
- Limited Australian track record
- Integration-heavy deployment

**Assessment:** Enterprise competitor entering the space. Not targeting independent day surgery.

---

### 6. CareMonitor

**Category:** Digital perioperative care pathways
**Market position:** Pre-op preparation and post-op monitoring platform

**Strengths:**
- Automated pre-admission surveys/assessments
- Risk-based patient triage
- Personalised care plans, prehabilitation pathways
- Multi-site analytics
- Modern cloud platform with patient portal

**Shortcomings:**
- Pre-op and post-op only — no intra-operative record
- No count sheets, surgical checklist, anaesthetic record
- No billing/admin
- Designed as bolt-on to existing systems

**Assessment:** Complementary, not competitive. Potential integration partner — they handle patient prep, SurgiRecord handles the clinical floor.

---

### 7. Mondrian Health (SchedulOR)

**Category:** AI scheduling/capacity optimisation
**Assessment:** Public health system focused. Scheduling/planning only, zero clinical.

### 8. Notitia (Operatio)

**Category:** Hospital analytics/dashboards
**Assessment:** Analytics overlay requiring existing hospital systems. Not a clinical system.

---

## Gap Analysis

| Capability | MD/Bluechip | DCM | SurgiNet | CareMonitor | **SurgiRecord** |
|---|---|---|---|---|---|
| Surgical safety checklist | ❌ | ❓ | ✅ | ❌ | ✅ |
| Anaesthetic record | ❌ | ❌ | ✅ | ❌ | ✅ |
| Count sheets | ❌ | ❌ | ✅ | ❌ | ✅ |
| Falls/pressure/VTE risk | ❌ | ❓ | ❌ | ❌ | ✅ |
| Delirium risk | ❌ | ❌ | ❌ | ❌ | ✅ |
| Operation report | ❌ | ❌ | ✅ | ❌ | ✅ |
| Implant tracking | ❌ | ❌ | ✅ | ❌ | ✅ |
| Recovery + obs charting | ❌ | ❓ | ✅ | ❌ | ✅ |
| Post-op calls | ❌ | ❌ | ✅ | ✅ | ✅ |
| Consent management | ❌ | ❓ | ✅ | ❌ | ✅ |
| Clinical photos | ❌ | ❌ | ❌ | ❌ | ✅ |
| Body chart | ❌ | ❌ | ❌ | ❌ | ✅ |
| Tablet-first UI | ❌ | ❌ | ❌ | ✅ | ✅ |
| Day surgery specific | ✅ | ✅ | ❌ | ❌ | ✅ |
| Affordable for small facility | ✅ | ✅ | ❌ | ✅ | ✅ |
| Billing/IHC | ✅ | ✅ | ✅ | ❌ | 🔜 Phase 2 |
| Statutory reporting | ✅ | ✅ | ✅ | ❌ | 🔜 Phase 2 |
| Patient portal | ❌ | ✅ | ❌ | ✅ | 🔜 Phase 5 |

---

## Strategic Positioning

### The Gap
No one delivers **clinical-first, tablet-first, day-surgery-specific** software in Australia at an accessible price.

- Billing tools (MedicalDirector, DCM) → strong admin, weak clinical floor
- Enterprise systems (Cerner, Altera) → overkill, priced for large hospitals
- Care pathways (CareMonitor) → pre/post only, no intra-operative
- Scheduling (Opera, Mondrian) → logistics, not clinical records

### SurgiRecord's Play
**Own the clinical record.** The forms nurses, anaesthetists, and surgeons actually use on the floor — checklists, count sheets, obs, consent, risk assessments, recovery documentation.

### Phase 1 Strategy
- Partner with / integrate into existing billing systems (DCM, Bluechip) rather than competing on billing
- Position as the clinical layer that sits alongside their admin system
- Target independent day hospitals with 1-4 theatres

### Pricing Model (TBD)
- Per-theatre or per-facility monthly subscription
- Lower entry point than enterprise systems
- No massive implementation project — cloud-native, tablet-ready

---

## Product Roadmap

### Phase 1 — Core Clinical (Built ✅)
- Patient admission workflow
- Pre-anaesthetic assessment
- Surgical safety checklist (WHO-aligned)
- Count sheets (swabs, instruments, sharps)
- Anaesthetic record
- Intra-operative record
- Operation report
- Risk assessments (falls, pressure, VTE, delirium)
- Recovery observations
- Nursing handover
- Consent management
- Discharge documentation
- Post-op phone calls
- Clinical photos + body chart
- Progress notes + medication management
- Fluid balance
- Implant tracking

### Phase 2 — Integration & Billing
- Theatre scheduling / list management
- Surgeon preference cards
- Medicare/private billing hooks (IHC, ECLIPSE)
- Pathology & imaging request integration
- ICD coding + 3M integration
- Statutory reporting (PHDB, HCP, state health)

### Phase 3 — Intelligence
- Smart defaults from surgeon + procedure history
- Observation trend alerts (early warning scores)
- Auto-generated discharge summaries
- Post-op call scripts with outcome tracking
- Template-based operation reports

### Phase 4 — Multi-site & Compliance
- Multi-facility support
- NSQHS audit reporting dashboards
- Credentialing integration
- Benchmarking across sites (case times, complications)
- My Health Record integration

### Phase 5 — Platform
- Patient portal (pre-admission forms, post-op instructions)
- GP letter auto-generation
- API for third-party integrations
- AI-assisted clinical documentation
- CareMonitor / pathway platform integration
