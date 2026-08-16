# Orbitus Global Overseas PRD

## Original problem statement
Build a comprehensive conversion-focused study-abroad agency website for Orbitus Global Overseas with a responsive React frontend, accessible interactions, a multi-step student intake funnel, destination and service content, WhatsApp CTAs, and a POST /api/leads endpoint.

## Architecture decisions
- React single-page experience with Framer Motion, Lucide icons, and CSS design system.
- FastAPI endpoint stores validated lead documents in MongoDB using existing MONGO_URL and DB_NAME.
- Public contact CTAs use the supplied Hyderabad/London and WhatsApp/mobile details.

## Implemented
- Conversion-focused hero, sticky admissions bar/header, destination cards, services, five-step roadmap, reviews, FAQ, footer and floating WhatsApp.
- Three-step profile assessment with required-field validation, state retention, API submission, error state, and personalized success CTA.
- Server-side validation for email, phone, consent, required fields, and lead persistence.

## Prioritized backlog
- P0: Connect successful leads to CRM or email notifications.
- P1: Add real university partner/accreditation assets and verified success stories.
- P2: Add destination guide detail pages and application tracking.

## Verification history
- 2026-08-16: Full end-to-end regression after validation patch PASSED. Browser flow: steps 1/2/3 each block incomplete input with a visible inline error; back-navigation retains answers (english=IELTS confirmed); valid lead submitted from UI showed personalized success screen with WhatsApp CTA. API: valid payload 200 + persisted to MongoDB, empty budget 422, malformed payload 422. Deployment-readiness health check: no blockers found.
- 2026-08-16: Editorial redesign shipped (kinetic masked hero reveal, Lenis smooth scroll, gold city marquee, numbered manifesto chapters, parallax spotlight hero frame, framer-motion scroll reveals). Fonts now Fraunces + Instrument Sans + DM Mono. Modal flow and all testids re-verified after redesign.
- 2026-08-16: Lead alerts wired via Resend (non-blocking asyncio.to_thread, fire-and-forget after lead insert). Requires RESEND_API_KEY in backend/.env to go live; without it the alert is skipped and logged ("RESEND_API_KEY not set; skipping lead alert email"). Alert recipient: ALERT_EMAIL=Contact.orbitusglobal@gmail.com; sender: SENDER_EMAIL=onboarding@resend.dev. Verified: lead POST returns 200 and skip-log appears.

- 2026-08-16: Lead alerts ACTIVATED. RESEND_API_KEY added to backend/.env (user-registered Resend account: contact.orbitusglobal@gmail.com). ALERT_EMAIL must stay lowercase — Resend free-tier recipient check is case-sensitive. Verified live: POST /api/leads returned 200 and "Lead alert email sent" logged; confirmation email delivered via Resend (id 62487a9d).

## Next tasks
- Verify a domain at resend.com/domains to unlock alerts to additional team inboxes beyond the registered address.
- CRM webhook integration.
- Admin lead review dashboard.
