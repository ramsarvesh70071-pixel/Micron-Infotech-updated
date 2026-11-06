# Audit report - Client.zip + Server.zip

## A. Jo kami / bugs mile (aur ab fix ho chuke hain)

### Data dynamic nahi tha
1. Public site ka lagbhag sab content `client/src/data/*.ts` aur pages ke andar hardcoded tha (courses, branches, reviews,
   placements, FAQs, partners, blogs, legal, team, contact numbers, banner, stats). Admin panel me edit karne se website par
   **kuch nahi badalta tha**. -> Ab sab MongoDB se aata hai; `client/src/data` hata diya gaya.
2. Admin ke courses/reviews ka schema website ke data se alag tha (naam, fee, fields mismatch) - do alag "sach". -> Ek hi schema.
3. Server ke seed data me bani-banayi fees/ratings (jo client se match nahi karte the). -> Ab seed sirf aapki site ke original content se bana hai.

### Forms database me save hi nahi hote the
4. Contact, Become a Trainer, Franchise, Post Job, Support, Corporate RFP aur Footer newsletter - **sab fake the** (sirf
   `setTimeout` se "success" dikhate the). Leads kho rahi thin. -> Ab sab API par jaate hain, validation + spam protection ke saath.
5. Enroll modal: API fail hone par bhi "success" dikhata tha, blank email par fake email (`phone@student...`) banata tha,
   aur har enquiry me branch "BTM Layout" hardcode tha. -> Real error dikhata hai, email required, branch/course DB se.
6. Support ticket number client par `Math.random()` se banta tha (server me kuch save nahi), "confirmation email bhej di gayi"
   likha tha jabki koi email nahi jaati. -> Server par secure random ticket (MIC-XXXXXXXX) + tracking (ticket + email dono chahiye).
7. Course cards par har course me "100% Placement" aur "Internship" hardcoded tha. -> Ab course ke apne fields se.
8. Blog "Read More" sirf enroll modal kholta tha, article page tha hi nahi. -> `/blog/:slug` page + admin se content.

### Database / architecture
9. Mongo connect na hone par server chupchap **in-memory store** par chala jata tha -> restart par saara data gayab. Har controller
   me double code (memory + Mongo). -> In-memory hata diya; ek hi Mongoose path; Mongo na ho to saaf error.
10. Mongo wala code kabhi test nahi hua tha (tests sirf memory fallback par). -> 35 integration tests real MongoDB 7 par.

### Security
11. Login page par **hardcoded demo credentials** (`Admin@123456`) ka one-click button; README/bat file me bhi. -> Hata diya; admin
    password env se (`SEED_ADMIN_PASSWORD`) ya random generate.
12. Hardcoded JWT secret fallback. -> Production me `JWT_SECRET` (32+ chars) zaroori; dev me random.
13. JWT `localStorage` me tha (XSS se chori ho sakta hai) aur CSV export URL me token jata tha (jo kaam bhi nahi karta tha).
    -> httpOnly cookie + CSRF header; CSV fetch se download.
14. Token verify me DB check nahi hota tha: deactivate/delete user 7 din tak access rakhta tha. -> Har request par DB se user check.
15. Public `GET /api/jobs` sabhi jobs + recruiter email/phone leak karta tha. -> Sirf admin-approved jobs, bina contact details.
16. Public review submit turant live ho jata tha (spam). -> Hamesha unapproved; admin approve karega.
17. Support tracking sirf 6-digit number se (guess ho sakta). -> Cryptographic ticket + email match + rate limit.
18. `PUT /courses/:id` me `req.body` seedha DB me (mass-assignment). -> Whitelist + schema validation.
19. Public `?all=true` inactive records leak karta tha; query-string NoSQL operator injection; regex search injection.
    -> Public filter zabardasti `active/approved`; query values sirf string; regex escape.
20. `normalizeEmail()` Gmail ke dots hata deta tha (login mismatch). -> Sirf lowercase.
21. CSV export me formula injection (`=HYPERLINK(...)`). -> Neutralize.
22. Weak password policy (6 chars). -> 10+ chars, upper+lower+number. Last super admin ko demote/delete nahi kar sakte.
23. Roles sirf 3 the. -> 5 roles (superadmin, admin, editor, counselor, support) + server-side RBAC aur UI me role ke hisaab se menu.
24. Rate limits: login 10 failed/15 min, forms 20/hour, ticket lookup 15/15 min, honeypot field.
25. CORS non-production me sab origins allow karta tha. -> Hamesha allow-list.

### Brand / content leftovers (dusri company ka template)
26. Site Inventateq (inventateq.com) se copy hui lagti hai: legal pages me `info@/legal@/accounts@inventateq.com` aur unka phone
    number, Support page par `lms.inventateq.com`, Post-Job page par "Inventateq Graduates", Franchise/About me "INVENTATEQ".
    Matlab privacy/legal/support queries **kisi aur company ke email par** jaati. -> Sab hata ke settings (aapke email/phone) se jod diya.

## B. Admin panel me ab kya hai
Dashboard (DB aggregates), Leads/Enquiries (+CSV), Trainer/Franchise, Employer Jobs, Support, Newsletter, Courses, Branches,
Reviews (approve/feature), Placements, Partner Logos, FAQs, Blogs, Team, Corporate Clients, Case Studies, Legal pages,
**Site Settings** (phone, WhatsApp, email, banner, headline numbers, SEO), Admin Users, My Account.
Saare content/lead pages ek generic `ResourceManager` se bane hain (search, filter, inline toggle/status, create/edit/delete, role-based).

## C. Aapko zaroor dekhna hai (mere se verify nahi ho sakta)
- **Third-party assets:** ~58 images/logos abhi bhi `inventateq.b-cdn.net` se hotlink hote hain (HomePage ke icons/images + kai
  logos seed me), aur ~49 student photos `randomuser.me` ke stock faces hain. Ye doosre ki property hai aur kabhi bhi toot sakti hai.
  Apne logos/photos upload karke admin panel me URL badlo.
- **Placement / media / hiring claims:** "10,579 placed", "20,516 reviews", "Forbes/NDTV/Hindustan Times" media logos, Google/Microsoft
  hiring logos, student naam + packages, "14+ years", "11,540+ professionals", "2,000+ brands" jaise claims seed me/pages me
  maujood hain. Agar ye Micron InfoTech ke **asli, verify kiye hue** numbers nahi hain to publish mat karo - bhramak placement
  claims par consumer-protection action ho sakta hai. Admin -> Site Settings / Placements / Partners me sahi data daalo ya hatao.
- **Legal pages:** text copy hua hai; maine sirf company-specific email/domain/phone badle. Kisi vakeel se review karwao.
- **Contact details:** sab branches ka ek hi phone (+91 7676765421) aur `info@microninfotech.com` seed me hain; branch-wise sahi
  number/email Admin -> Branches me daalo. Support/legal/placement emails Site Settings me khaali hain (tab tak general email dikhta hai).
- Hardcoded marketing copy ab bhi pages ke andar hai (e.g. "2,000+ brands", "95%" PlacementRoadmap, About ka story text).

## D. Testing jo hua
- Server: 35 integration tests (supertest) real MongoDB 7.0 par - pass.
- Client: TypeScript check + production build - pass. 17 UI smoke tests (jsdom) real API+MongoDB ke saath: pages render, forms DB me save,
  admin list/toggle/create - pass.
- Production mode: compiled server + SERVE_CLIENT, SPA fallback, CORS block, fail-fast errors - verified.
- **Real browser (Chrome) me click-through nahi hua** aur MongoDB Atlas se connect nahi kiya (sandbox me local MongoDB use hua). Pehle
  `npm run dev` chalake ek baar pages dekh lo.

## E. Aage kya hona chahiye (recommended, abhi implement nahi)
1. **Image upload** (Cloudinary/S3) - abhi admin me sirf image URL daal sakte ho.
2. **Email/WhatsApp notification** naye lead par (Nodemailer/Resend) + student ko confirmation mail.
3. **Services & Internships pages** - content `extras/unused-static-data` me hai, par site me page/route hi nahi.
4. **Mentors section** (About page par) - data DB me hai (kind=mentor), UI nahi.
5. **Jobs board page** - API ready (`GET /api/jobs`), public page nahi.
6. Course detail page `/courses/:slug` (syllabus DB me support hai), SEO (sitemap, meta per page, prerender/SSR), analytics.
7. 2-factor login / password reset by email, audit log (kisne kya badla), backups (Atlas automated backup).
8. Payments (Razorpay) + student dashboard/LMS integration agar online enrolment chahiye.
9. CI (GitHub Actions: typecheck + tests), Docker compose (api + mongo), error monitoring (Sentry).
10. Admin panel me image/rich-text editor aur drag-and-drop ordering.
