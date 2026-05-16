<div align="center">

# 🧠 StudyBuddy — AI-Powered Study Universe

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3-F55036?style=for-the-badge&logo=meta&logoColor=white)](https://groq.com)
[![Three.js](https://img.shields.io/badge/Three.js-3D_UI-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**An intelligent, futuristic learning assistant that transforms raw study material into structured summaries, adaptive quizzes, flashcards, personalized study plans, and an AI chat tutor — all powered by blazing-fast Groq LLM inference.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Screenshots](#-screenshots) • [License](#-license)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Smart Summaries** | Upload PDFs or paste text → AI generates a comprehensive executive summary with 8–10 exhaustive key points |
| 🧪 **Adaptive Quizzes** | Auto-generates 20 multiple-choice questions with explanations from your study material |
| 🃏 **Flashcards** | Creates 10 interactive flip-cards for rapid revision with 3D flip animations |
| 📅 **Study Planner** | Generates a personalized day-by-day study plan based on your subject, goal, and timeframe |
| 💬 **AI Chat Tutor** | Conversational AI assistant that answers questions about your uploaded material in real-time |
| 🔐 **User Authentication** | Secure JWT-based login/register system with bcrypt password hashing |
| 🎨 **Immersive 3D UI** | Three.js animated orb on the landing page with glassmorphism design system |

---

## 🛠 Tech Stack

### Frontend
- **React 19** + TypeScript + Vite
- **Tailwind CSS 4** — Utility-first styling
- **Framer Motion** — Page transitions & micro-animations
- **Three.js** (React Three Fiber + Drei) — 3D animated landing page
- **GSAP** — Scroll-triggered hero animations
- **Lenis** — Smooth scrolling engine
- **Axios** — HTTP client

### Backend
- **Node.js + Express 5** — REST API server
- **MongoDB Atlas + Mongoose** — Cloud database & ODM
- **Groq SDK** — Ultra-fast LLM inference (Llama 3.3 70B)
- **JWT + Bcrypt** — Authentication & password security
- **Multer + pdf-parse** — File upload & PDF text extraction

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ installed
- **MongoDB Atlas** account (free tier works)
- **Groq API Key** — Get one at [console.groq.com](https://console.groq.com)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/study-buddy.git
cd study-buddy
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
```

Start the backend server:

```bash
node server.js
```

> You should see: `Server running on port 5000` and `MongoDB Connected`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> The app will be available at `http://localhost:5173`

---

## 🏗 Architecture

```
study-buddy/
├── backend/
│   ├── controllers/
│   │   ├── aiController.js       # AI processing (summary, quiz, flashcards, plan, chat)
│   │   └── authController.js     # Login & Register logic
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   └── User.js               # Mongoose user schema
│   ├── routes/
│   │   ├── ai.js                 # AI API routes
│   │   └── auth.js               # Auth API routes
│   ├── server.js                 # Express server entry point
│   └── .env                      # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx   # 3D hero landing page
│   │   │   ├── AuthPage.tsx      # Login/Register form
│   │   │   ├── Dashboard.tsx     # Main dashboard with bento grid
│   │   │   ├── UploadPage.tsx    # PDF upload & text input
│   │   │   ├── SummaryPage.tsx   # AI-generated summary display
│   │   │   ├── QuizPage.tsx      # Interactive MCQ quiz
│   │   │   ├── FlashcardsPage.tsx# 3D flip flashcards
│   │   │   ├── StudyPlanner.tsx  # AI study plan generator
│   │   │   └── ChatAssistant.tsx # Real-time AI chat tutor
│   │   ├── App.tsx               # Router & Lenis setup
│   │   ├── main.tsx              # React entry point
│   │   └── index.css             # Global styles & design tokens
│   └── index.html
│
└── README.md
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |

### AI Processing (Protected — requires JWT)
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/ai/process` | `type: "summary"` + text/file | Generate comprehensive summary |
| `POST` | `/api/ai/process` | `type: "quiz"` + text/file | Generate 20-question MCQ quiz |
| `POST` | `/api/ai/process` | `type: "flashcards"` + text/file | Generate 10 flashcards |
| `POST` | `/api/ai/process` | `type: "plan"` + subject, purpose, duration | Generate study plan |
| `POST` | `/api/ai/process` | `type: "chat"` + question + text | Chat with AI about material |

---

## 📸 Screenshots

> Add your screenshots here after deployment:
> 
> `![Landing Page](screenshots/landing.png)`  
> `![Dashboard](screenshots/dashboard.png)`  
> `![Quiz Page](screenshots/quiz.png)`  

---

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `GROQ_API_KEY` | API key from [Groq Console](https://console.groq.com) |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ by Lovesh Chittora**

*If this project helped you, consider giving it a ⭐ on GitHub!*

</div>
