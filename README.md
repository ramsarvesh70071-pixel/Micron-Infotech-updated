# Micron InfoTech - Full-Stack Project

React website + Express/MongoDB API + Admin Panel. **Sab kuch database se aata hai** (courses, branches, reviews,
placements, FAQs, partner logos, blogs, legal pages, team, contact details, banner...). Admin panel se edit karo,
website par turant dikhega. Website ke saare forms real database me save hote hain.

```
Micron-InfoTech/
  client/   React + Vite + Tailwind (website + /admin panel)
  server/   Express + TypeScript + Mongoose (REST API)
  scripts/  setup.mjs (one-command setup), dev.mjs (run both)
  docs/     AUDIT.md (kya kami thi, kya fix hua, aage kya karna hai)
  extras/   unused-static-data (Services / Internships ka purana content, abhi kisi page me use nahi)
```

## Requirements
- Node.js 18.18+ (LTS)
- MongoDB: local MongoDB Community Server **ya** free MongoDB Atlas cluster

## Quick start (Windows / Mac / Linux)
```bash
npm run setup     # server/.env banata hai (random JWT secret + admin password), npm install, database seed
npm run dev       # API http://localhost:5000  +  Website http://localhost:5173
```
- Admin panel: http://localhost:5173/admin/login
- Admin email/password `server/.env` me hai (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`). **Pehle login ke baad password badal do.**
- Atlas use karna ho to `server/.env` me `MONGODB_URI` set karo, phir `npm run seed`.

MongoDB chalu nahi hoga to server saaf error dikhake band ho jata hai (koi in-memory fallback nahi, taaki data kabhi gum na ho).

## Commands
| Command | Kaam |
|---|---|
| `npm run dev` | API + website dono (development) |
| `npm run seed` | Khaali collections me starting content daalta hai (safe, dobara chalane par kuch overwrite nahi) |
| `npm run seed:reset` | Content collections ko wipe karke dobara seed (leads/users/tickets safe rehte hain) |
| `npm run build` | Server + client production build |
| `npm start` | Production API (compiled) |
| `npm test` | Server integration tests (real MongoDB chahiye; `TEST_MONGODB_URI` se DB badal sakte ho) |
| `npm run typecheck` | Dono projects ka TypeScript check |

## Production deploy
**Option A - ek hi server (sabse aasaan):** `npm run build`, phir `server/.env` me `NODE_ENV=production`, `SERVE_CLIENT=true`,
`MONGODB_URI`, `JWT_SECRET` (32+ chars), `ALLOWED_ORIGINS=https://yourdomain.com` set karo, `npm run seed:prod` (pehli baar) aur `npm start`.
Express hi API + React app dono serve karega. HTTPS reverse proxy (Nginx/Caddy/Render) ke peeche rakho.

**Option B - alag hosting (Vercel + Render):** client par `VITE_API_URL=https://api.example.com/api`, server par
`ALLOWED_ORIGINS=https://yourdomain.com` aur `COOKIE_SAMESITE=none` (HTTPS zaroori).

## Admin panel roles
| Role | Access |
|---|---|
| superadmin | sab kuch + admin users |
| admin | sab content + leads + settings (users nahi) |
| editor | website content (courses, blogs, FAQs...) |
| counselor | enquiries, trainer/franchise applications, jobs |
| support | support helpdesk tickets |

## API overview
Public: `GET /api/{courses,branches,reviews,placements,partners,faqs,blogs,corporate-clients,case-studies,legal,team,settings,jobs}`
Forms: `POST /api/{enquiries,applications,jobs,support,support/track,reviews,newsletter}`
Admin (login zaroori): `/api/admin/<resource>` (GET/POST/PUT/DELETE), `/api/admin/dashboard/stats`, `/api/admin/users`, `/api/admin/settings`.
Health: `GET /api/health`.

Detail me kya badla aur kya baaki hai: **docs/AUDIT.md**
# Micron-Infotech-updated
