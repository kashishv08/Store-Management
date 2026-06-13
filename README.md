# Store Management — Full-Stack Admin Platform

> Efficient management of products, categories, and user roles with secure authentication and GraphQL APIs.

🔗 **[Live Demo](https://store-management-pink-one.vercel.app/)** <!-- replace with your actual live link -->

---

## ✨ Features

- 🛍️ **Product & category management** — full CRUD with real-time updates
- 👥 **Role-based access control** — separate permissions for staff and admin users
- 🔐 **JWT authentication** — secure, stateless auth across all routes
- ⚡ **GraphQL APIs** — efficient, typed data fetching with Prisma ORM
- 🗄️ **Caching strategies** — optimized data handling for scalable performance
- 🎨 **Modular UI** — Radix UI components for accessible, maintainable interfaces

---

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat&logo=radixui&logoColor=white)

---

## ⚙️ Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/kashishv08/Store-Management.git
cd Store-Management

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your keys (see below)

# 4. Run database migrations
npx prisma migrate dev

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

---

## 🏗️ Architecture Highlights

- **GraphQL + Prisma** — type-safe API layer with efficient database queries
- **JWT auth** — stateless authentication with role claims embedded in tokens
- **RBAC** — admin vs staff roles enforced at both API and UI level
- **Caching** — client-side query caching to reduce redundant API calls
- **Modular components** — Radix UI primitives for accessible, reusable UI

---

## 📁 Project Structure
