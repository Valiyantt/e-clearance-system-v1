# 🧾 E-Clearance System

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/franzs-projects-cc5c4e1e/v0-project)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/90XtHenOJDo)

A **web-based digital clearance management platform** designed to streamline the student clearance process for academic institutions.  
Built with **Next.js (App Router)** and **TypeScript**, the system integrates modular APIs and database connections to automate department sign-offs, track clearance progress, and reduce manual paperwork.

---

## 🚀 Live Deployment

🔗 **Production URL:**  
[https://vercel.com/franzs-projects-cc5c4e1e/v0-project](https://vercel.com/franzs-projects-cc5c4e1e/v0-project)

---

## 🧩 System Overview

The **E-Clearance System** provides a centralized portal for:
- 🧑‍🎓 **Students** – Request and track clearance status from departments.
- 🏫 **Departments** – Approve or reject student clearance submissions.
- 👨‍💼 **Administrators** – Manage users, system configurations, and reports.

All actions are logged for transparency and accountability.

---

## ⚙️ Core Features

| Feature | Description |
|----------|--------------|
| **Multi-Role Access Control** | Separate portals for Students, Departments, and Admins. |
| **Automated Clearance Workflow** | Each department can digitally sign off student records. |
| **Secure Authentication** | Password-protected logins and session handling. |
| **Database Integration** | Centralized data persistence for clearance transactions. |
| **Departmental Dashboard** | Summaries of pending, approved, and rejected requests. |
| **Responsive UI** | Built using modern React components and Next.js App Router. |
| **Scalable API Routes** | RESTful endpoints under `/app/api/...` for modular expansion. |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js (App Router), TypeScript, React, TailwindCSS |
| **Backend** | Node.js / Next.js API Routes |
| **Database** | (Configurable) MongoDB / Supabase / Firebase (depending on deployment) |
| **Deployment** | Vercel |
| **Version Control** | GitHub |

---

## 🧠 System Architecture

Frontend (Next.js + React)
│
├── Authentication & Routing
│
├── API Endpoints (/app/api)
│ ├── Clearance
│ ├── Faculty Signatures
│ ├── Student Records
│ └── System Settings
│
└── Database Layer (Prisma / Supabase / MongoDB)



## 📦 Installation & Setup
---
\`\`\`bash
# 1️⃣ Clone the repository
git clone https://github.com/<your-username>/e-clearance-system.git
cd e-clearance-system

# 2️⃣ Install dependencies
npm install

# 3️⃣ Create your .env file
cp .env.example .env

# 4️⃣ Run development server
npm run dev

# 5️⃣ Open in browser
http://localhost:3000
\`\`\`

| Variable                 | Description                       |
| ------------------------ | --------------------------------- |
| `DATABASE_URL`           | Database connection string        |
| `JWT_SECRET`             | Secret key for authentication     |
| `NEXT_PUBLIC_API_URL`    | Public API endpoint               |
| `ADMIN_DEFAULT_PASSWORD` | Default admin password (optional) |


⚠️ Do not commit your .env file to Git.


| Role         | Name                                                               |
| ------------ | ------------------------------------------------------------------ |
| Project Lead | Franz Tovie G. Alverio                                             |
| Developers   | Lucky Richmon C. Almarinez (Backend Developer)                     |
| Developers   | Kyla Celine A. Jamilano    (Frontend Developer)                    |
| Adviser      | Jan Patrick Luiz Dalicano                                          |
| Institution  | Saint Michael’s College of Laguna – Department of Computer Studies |


🧾 License
---
This project is developed for academic and research purposes.
© 2025 Saint Michael’s College of Laguna. All rights reserved.

🧱 Built With
---
Next.js
React
TypeScript
TailwindCSS
Vercel
v0.app

💬 Notes
---
This repository is automatically synced with the deployed project on v0.app.
Further development should be committed here, and deployment will auto-update through Vercel CI/CD.
