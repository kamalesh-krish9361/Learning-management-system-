# AuraLMS – Modern Learning Management System (LMS)
### Premium Full-Stack Web Application for Next-Gen EdTech

AuraLMS is a full-stack, responsive, and production-ready **Learning Management System (LMS)** designed to deliver a premier commercial EdTech experience akin to modern platforms like Coursera, Udemy, and Duolingo.

---

## 🎨 Design & Palette Highlights

Per requirements, AuraLMS adopts an energetic, high-contrast, modern palette with **reduced emphasis on corporate blue**, spotlighting:
- **Primary Royal Violet & Deep Purple** (`#7c3aed`, `#6366f1`, `#9333ea`)
- **Sunset Amber & Energetic Warm Orange** (`#f59e0b`, `#f97316`, `#ea580c`)
- **Vibrant Emerald & Mint** (`#10b981`, `#059669`)
- **Deep Obsidian / Dark Slate** for distraction-free video player and elegant card borders
- **Plus Jakarta Sans & Inter** typography with micro-animations and glowing badges

---

## 🚀 Key Features by User Role

### 1. Student
- **Authentication**: JWT-based login, registration, and session recovery.
- **Course Marketplace**: Real-time keyword search, category filters, difficulty pills (Beginner, Intermediate, Advanced), and price sorting.
- **Course Enrollment**: Instant one-click enrollment with lifetime access.
- **Learning Player**: Immersive, distraction-free video classroom with responsive player, lesson navigation checklist, downloadable resources (PDFs, boilerplates), and lesson notes.
- **Lesson Discussions**: Real-time Q&A thread system with instructor reply indicators.
- **Interactive Quizzes**: Timed assessments, automatic scoring, question-by-question breakdown with explanations, and celebratory confetti upon passing.
- **Accredited Certificates**: Cryptographically formatted diplomas complete with verification IDs, printable/downloadable modal.
- **Student Dashboard**: Welcome banner, active daily streak, enrolled courses, interactive weekly study hours bar chart, and achievement badges.

### 2. Instructor
- **Instructor Studio Dashboard**: Live KPIs for active courses, total enrolled students, dynamic gross revenue, and student review ratings.
- **Course Management**: List, inspect, and delete courses.
- **Course Creator Modal**: Add new courses with titles, categories, pricing, levels, duration, thumbnails, and descriptions.
- **Assignment Evaluation**: View student repository submissions, assign grades (0–100), and write instructor feedback.

### 3. Administrator
- **Admin Command Portal**: High-level platform KPIs covering platform users, active courses, total enrollments, and gross volume.
- **User Governance**: Full user directory with role assignment (Student $\leftrightarrow$ Instructor $\leftrightarrow$ Admin), account status toggling (Active, Approved, Suspended), and deletion.
- **Course Catalog Moderation**: Review and audit all platform courses across instructors.
- **Category Architecture**: View active categories and create new learning taxonomy domains.

---

## ⚡ Instant 1-Click Demo Accounts

AuraLMS includes an **Instant Demo Role Switcher** right in the top navigation bar and login screen:

| Role | Name | Email | Password | What You Can Test |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | Alex Morgan | `student@auralms.com` | `password123` | Enrolled courses, video player, quizzes, certificate modal, wishlist |
| **Instructor** | Dr. Elena Vance | `instructor@auralms.com` | `password123` | Course creation, revenue stats, student progress, assignment grading |
| **Admin** | Sarah Jenkins | `admin@auralms.com` | `password123` | User role switcher, instructor approvals, category manager |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Canvas Confetti
- **Router**: React Router DOM v6
- **Backend**: Node.js, Express.js, JWT, Bcrypt.js, CORS, Dotenv
- **Database & Storage**: Dual-mode storage engine featuring zero-config persistent JSON database (`server/src/data/db.json` with pre-seeded rich masterclasses) with optional MongoDB connection via `MONGODB_URI`.

---

## 💻 Quick Start & Running Locally

### 1. Prerequisites
- **Node.js** v18+ (tested on v26)
- **NPM** v9+

### 2. Setup & Installation
```bash
# In the project root:
npm.cmd install

# Install server packages:
cd server
npm.cmd install

# Install client packages:
cd ../client
npm.cmd install
```

### 3. Start the Application
To run both backend API server and frontend client concurrently:

```bash
# From root directory:
npm.cmd run dev
```

Alternatively, run in separate terminals:
```bash
# Terminal 1: Backend Server (runs on http://localhost:5000)
cd server
npm.cmd run dev

# Terminal 2: Frontend Client (runs on http://localhost:5173)
cd client
npm.cmd run dev
```

Open your browser at:
👉 **`http://localhost:5173`**

---

## 📡 REST API Endpoints Overview

### Auth (`/api/auth`)
- `POST /register`: Create new user
- `POST /login`: Log in and receive JWT token
- `GET /me`: Get current authenticated profile
- `PUT /profile`: Update profile info
- `POST /wishlist/:courseId`: Toggle course in wishlist
- `GET /demo-accounts`: Metadata for quick demo accounts

### Courses (`/api/courses`)
- `GET /`: Filtered course catalog (`search`, `category`, `level`, `price`, `sort`)
- `GET /categories`: Learning categories
- `GET /:id`: Course details and reviews
- `POST /`: Create course (Instructors & Admins)
- `PUT /:id`: Update course
- `DELETE /:id`: Delete course
- `POST /:id/reviews`: Submit course review

### Enrollments (`/api/enrollments`)
- `GET /my-enrollments`: List user enrolled courses with progress
- `GET /check/:courseId`: Check if student is enrolled
- `POST /enroll/:courseId`: Enroll in a course
- `POST /progress`: Mark lesson completed / update progress
- `GET /certificate/:courseId`: Retrieve official certificate

### Quizzes (`/api/quizzes`)
- `GET /course/:courseId`: Fetch course quiz questions
- `POST /submit/:courseId`: Calculate score, check pass/fail, return breakdown
- `GET /my-history`: Student quiz examination history

### Instructor (`/api/instructor`)
- `GET /overview`: Studio stats, revenue, courses, recent enrollments, assignments
- `POST /assignments/:assignId/grade/:subId`: Grade student submission

### Admin (`/api/admin`)
- `GET /overview`: Platform high-level overview
- `GET /users`: List all platform users
- `PUT /users/:id`: Change role or status
- `DELETE /users/:id`: Delete user account
- `POST /categories`: Create new category
- `DELETE /categories/:id`: Remove category
