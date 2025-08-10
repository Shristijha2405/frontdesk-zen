# MediDesk Pro – Front Desk Management System

MediDesk Pro is a full-stack web application designed for clinics to manage patient queues, appointments, and front desk operations efficiently.

🚀 **Live Demo**: [https://frontdesk-zen-7qj8.vercel.app](https://frontdesk-zen-7qj8.vercel.app)

---

## 📌 Features

- **User Authentication** – Secure login & signup using JWT.
- **Patient Management** – Add, search, update, and manage patients in real-time.
- **Queue System** – Assign queue numbers automatically for walk-in patients.
- **Appointment Scheduling** – View and manage upcoming appointments.
- **Status Tracking** – Update patient status (Waiting, With Doctor, Completed, Cancelled).
- **Responsive UI** – Works on desktop, tablet, and mobile.
- **Role-Based Access** – Admin & staff roles for better security.
- **Deployed on Vercel** – Fast and serverless-ready frontend.

---

## 🛠 Tech Stack

### **Frontend**
- [Next.js](https://nextjs.org/) – React framework
- [Tailwind CSS](https://tailwindcss.com/) – Styling
- [TypeScript](https://www.typescriptlang.org/) – Type safety

### **Backend**
- [NestJS](https://nestjs.com/) – Backend framework
- [TypeORM](https://typeorm.io/) – Database ORM
- [MySQL](https://www.mysql.com/) – Relational database
- [JWT](https://jwt.io/) – Authentication

### **Deployment**
- Frontend – [Vercel](https://vercel.com/)
- Backend – Node server (can be deployed on Railway, Render, etc.)
- Database – MySQL (e.g., PlanetScale, AWS RDS, or local)

---

## 📂 Project Structure

frontend/
├── pages/
├── components/
├── public/
├── styles/
└── ...
backend/
├── src/
├── entities/
├── modules/
├── main.ts
└── ...


---
⚡ Installation & Setup

1. Clone Repository**
bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

2. Setup Backend
cd backend
npm install

-Create .env file in backend folder:

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=medidesk
JWT_SECRET=your_jwt_secret

-Run backend:
npm run start:dev

3. Setup Frontend
cd frontend
npm install

-Create .env.local in frontend:
NEXT_PUBLIC_API_URL=http://localhost:3000

Run frontend:
npm run dev



