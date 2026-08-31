# MedLex Portfolio, Course, and Payment Platform

## 1. Product idea

MedLex should be one connected digital product with three jobs:

1. Establish Dr. Ahmed Abouelghit and MedLex as a credible authority in forensic and medicolegal psychiatry.
2. Sell and deliver structured professional courses through a secure learning platform.
3. Convert institutional visitors into consultation, training, and partnership enquiries.

The public website builds trust, the course storefront converts that trust into enrolments, and the private Academy manages learning, certificates, rewards, and payments.

## 2. Primary audiences

- Psychiatrists, psychologists, trainees, and other clinicians.
- MRCPsych CASC candidates.
- Legal professionals, courts, prosecution offices, and legal teams.
- Ministries, universities, medical schools, and professional associations.
- MedLex administrators who manage learners, payments, access, and programme settings.

## 3. Product areas

### Public portfolio and marketing site

- Home page with positioning, credibility, pathways, flagship course, founder profile, and calls to action.
- Founder portfolio with qualifications, jurisdictions, court experience, teaching, and advisory work.
- Three pathway pages: Medico-Legal Education, The CASC Academy, and MedLex Foundations.
- Individual course landing pages with outcomes, syllabus, audience, delivery, language, price, access duration, instructor, FAQs, and purchase action.
- Institutional services for evaluations, expert testimony, report review, training, and partnerships.
- Contact, institutional enquiry, and register-interest forms.
- Arabic and English versions with proper RTL/LTR support.

### Course commerce

- Account creation and login before purchase.
- One-time purchase per course with time-limited access.
- Paymob Hosted Checkout so MedLex never stores card details.
- Coupon and points discounts.
- Payment success, pending, failed, and retry experiences.
- Payment history and downloadable receipts where supported.

### Learner Academy

- My Courses dashboard with progress, access expiry, points, and next action.
- Ten sequential learning pages per course in the initial model.
- Multiple-choice activities with server-side answer validation.
- Page progress that unlocks the next page only at 100%.
- Learn Mode and Exam Mode where a programme requires both.
- Completion certificate PDF.
- One downloadable course gift with download tracking.
- Feedback and social-sharing actions with reward points.
- Profile, account details, and payment history.

### Administration

- Separate protected admin access and role-based permissions.
- Dashboard for enrolments, revenue, completion, expiring access, gifts, and feedback actions.
- User table with filters for course, payment, progress, access, gift, and feedback status.
- Learner detail page with enrolments, transactions, progress, certificate, points, and audit events.
- Course settings for price, access duration, completion points, availability, and gift file.
- Coupon and feedback-template management.
- Payment reconciliation and safe manual access correction with an audit trail.

## 4. Core customer journey

Visitor discovers MedLex -> reviews founder authority and a pathway -> opens a course page -> creates an account -> applies a coupon if available -> pays through Paymob -> webhook confirms payment -> enrolment and expiry are created -> learner resumes from My Courses -> completes every required activity -> receives points, certificate, and gift -> gives feedback or shares -> returns for another course using a discount.

The course page has three states:

- Visitor: marketing content plus sign-in/register action.
- Signed in, not enrolled: marketing content plus purchase action.
- Enrolled with valid access: resume-course action and Academy navigation.

Expired access returns the learner to the purchase state without deleting prior progress or certificates.

## 5. Visual direction

- Premium editorial design rather than a generic SaaS or playful e-learning look.
- Deep midnight navy, warm ivory, muted slate, and restrained antique gold.
- Serif display headings paired with a highly legible sans-serif interface font.
- Fine rules, numbered sections, legal-document details, and case-file motifs.
- Clear trust hierarchy: authority first, programme outcomes second, purchase action third.
- Accessible contrast, visible keyboard focus, 44px minimum targets, reduced-motion support, and responsive layouts at 375px, 768px, 1024px, and 1440px.
- Arabic pages use true RTL layouts; English course content remains LTR when embedded inside Arabic application chrome.

## 6. Recommended technical architecture

- Next.js with TypeScript for the public site, learner Academy, admin area, and server endpoints.
- PostgreSQL for relational course, enrolment, payment, progress, coupon, and certificate data.
- Prisma or Drizzle for schema migrations and typed database access.
- Auth.js or a managed authentication provider, using secure HTTP-only sessions and verified email.
- Paymob Hosted Checkout plus signed webhooks for payment confirmation.
- Private object storage for gifts and generated certificates, served through short-lived signed URLs.
- Transactional email for registration, payment, expiry, and certificate messages.
- Vercel plus managed PostgreSQL/object storage for the simplest deployment, or a VPS when operational control is more important.

Public pages should be statically generated or cached for performance and SEO. Account, checkout, Academy, course content, and admin routes should be authenticated and `noindex`.

## 7. Important data entities

- Users and roles.
- Courses, course versions, pages, questions, and answer options.
- Enrolments and access periods.
- Page/question progress and attempts.
- Payment attempts, provider events, and refunds/adjustments if introduced later.
- Coupons, point ledger entries, and redemptions.
- Certificates and gift-download events.
- Feedback templates and outbound-channel clicks.
- Admin audit events.

A point ledger is safer than storing only a mutable points balance. Payment webhook events should also be stored with unique provider IDs so repeated webhooks cannot create duplicate enrolments.

## 8. Payment and security rules

- Never store raw card data; redirect to hosted checkout.
- Verify Paymob webhook signatures using the raw request data before changing payment or enrolment state.
- Treat the webhook as the source of truth, not the browser success redirect.
- Make payment processing idempotent and keep every attempt for reconciliation.
- Validate question answers on the server and return only the result/explanation needed by the interface.
- Authorise every course-page, file-download, certificate, and admin request on the server.
- Rate-limit authentication, answer submission, checkout creation, and public forms.
- Keep secrets in environment variables and maintain an admin audit log.
- Add privacy, terms, payment, access-expiry, and refund/no-refund policies before launch.

## 9. MVP scope

The first release should include:

- Bilingual public portfolio and three pathway/course marketing pages.
- Authentication and profiles.
- Paymob payment for one-time, time-limited course access.
- My Courses, sequential learning pages, server-validated questions, and saved progress.
- Certificate, one gift per course, points/coupons, and payment history.
- Admin users table, learner details, core course settings, payment visibility, and feedback templates.
- SEO for public pages, analytics, error monitoring, backups, and end-to-end tests for the complete purchase-to-certificate journey.

Defer WhatsApp Business automation, a full visual course CMS, subscriptions, multiple instructors, live-session scheduling, and mobile apps until usage proves the need.

## 10. Decisions required before development

- Final price, currency, access duration, and completion points for each course.
- Exact points-to-currency conversion and coupon rules.
- Whether progress survives repurchase after access expires (recommended: yes).
- Refund and cancellation policy, even if the initial decision is no refunds.
- Required course content, correct answers, explanations, and downloadable gifts.
- Certificate wording, signatory, serial/verification method, and branding.
- Final Arabic and English copy, social links, feedback templates, and support channels.
- Legal entity information, Paymob account ownership, tax/receipt requirements, and privacy retention periods.

## 11. Delivery sequence

1. Confirm business rules and content inventory.
2. Finalise information architecture, user flows, design system, and responsive screens.
3. Build the database, authentication, roles, and audit foundation.
4. Build public portfolio/pathway/course pages and bilingual SEO.
5. Integrate Paymob in test mode and complete payment reconciliation.
6. Build Academy progress, questions, certificates, gifts, points, and coupons.
7. Build the admin dashboard.
8. Complete accessibility, security, payment, RTL, and end-to-end testing.
9. Launch with monitoring, backups, operational documentation, and a rollback plan.

## 12. Success measures

- Visitor-to-course-page and course-page-to-checkout conversion.
- Checkout success and retry recovery rate.
- Course start, page completion, and full completion rate.
- Average time to completion and access-expiry rate.
- Certificate/gift download and feedback participation.
- Repeat purchase and coupon redemption.
- Qualified institutional enquiries.

