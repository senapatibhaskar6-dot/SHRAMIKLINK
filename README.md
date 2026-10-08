# IndustrialContractorWorkerLink (ICWL)

> **Founder**: Bhaskar Senapati  
> **Headquarters**: Assam & Northeast India  
> **Platform**: Indigenous B2B SaaS for Industrial Manufacturing & Contract Labour Operations

![ICWL Logo](/ICWL.png)

## Overview
**IndustrialContractorWorkerLink (ICWL)** is an end-to-end B2B compliance and workforce governance platform designed for manufacturing plants, principal employers, licensed labour contractors, and contract workers across industrial belts in India.

### Key Pillars & Four-Stakeholder Ecosystem:
1. **Industry HR & Principal Employer Management**:
   - Central governance, CLRA registration audit, Form XVI/XVII monitoring, muster roll verification, and Compliance-Locked billing approvals.
2. **Plant & Factory Supervisors**:
   - Biometric/face/OTP gate entry verification, real-time muster roll approvals, shift assignment, and ground-level attendance auditing.
3. **Licensed Labour Contractors**:
   - Workforce roster mapping, direct deployment, wage disbursement, EPF/ESIC statutory challan deposits, and automated GST billing.
4. **Contract Workers (Unskilled Labour)**:
   - Digital worker ID cards, Aadhaar-verified attendance logs, wage transparency, statutory benefits tracking, and zero-proxy identity safeguards.

---

## Core Innovations
- **Compliance-Locked Billing**: Contractor and vendor invoices are digitally locked until valid EPF (ECR) and ESIC remittances are uploaded and verified by the system.
- **Pure Unskilled Labour Specialization**: Tailored specifically for factory floor manual workforce, loading/unloading, packaging, and plant maintenance operations.
- **Multilingual Localization**: Native support across Assamese, Hindi, Bengali, Marathi, Tamil, Telugu, Gujarati, and English.
- **PWA & Mobile-First Interface**: Full progressive web app support with offline capabilities for gate terminals and supervisors.

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion
- **Backend / Server**: Node.js, Express, tsx, esbuild
- **Database / Auth**: Drizzle ORM, PostgreSQL / Cloud SQL, Firebase Auth
- **PWA**: Custom Service Worker (`/sw.js`), Web App Manifest (`/manifest.json`), Offline Caching

---

## Deployment & Build
To build for production (compatible with Vercel, Netlify, and Cloud Run):

```bash
# Install dependencies
npm install

# Run type check and lint
npm run lint

# Build client bundle & server executable
npm run build

# Start production server
npm start
```

---

## License & Compliance
Built in accordance with the **Factories Act, 1948**, **Contract Labour (Regulation & Abolition) Act, 1970 (CLRA)**, and **Payment of Bonus Act, 1965**.
© 2026 IndustrialContractorWorkerLink (ICWL). All rights reserved.
