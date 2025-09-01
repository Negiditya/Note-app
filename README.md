# Note App

A full-stack **MERN note-taking application** with authentication, allowing users to create, update, delete, and view notes. This project includes email + OTP login, and JWT-based authorization.

---

## Features

- **User Authentication**
  - Sign up and login using **email + OTP**.

- **Notes Management**
  - Create, update, and delete notes.
  - Add **descriptions** to notes.
  - Notes are tied to the authenticated user.

- **Authorization**
  - JWT-based authentication to secure note operations.

- **Responsive Design**
  - Mobile-friendly interface that closely follows the provided design.

---

## Technology Stack

- **Frontend:** ReactJS 
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT

---

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/Negiditya/Note-app
```

2. Navigate to the project directory:
```bash
cd note-app
```

3. Install dependencies for **frontend and backend**:
```bash
cd backend
npm install        # Backend dependencies
cd ../frontend
npm install       # Frontend dependencies
```

4. Create a `.env` file in the backend root folder with the following variables:
```

MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret>
GOOGLE_CLIENT_ID=<Your Google OAuth Client ID>
GOOGLE_CLIENT_SECRET=<Your Google OAuth Client Secret>
```

5. Create a `.env` file in the frontend (`/frontend`) for Vite to connect to the backend:
```
VITE_API_BASE_URL=<Your Backend API URL>
```

6. Run the backend server:
```bash
node server.js
```

7. Run the frontend:
```bash
cd frontend
npm run dev
```

8. Open the app in your browser:
```
http://localhost:5173
```

---

## Deployment

The project is deployed on **Vercel**:
[Live Demo](https://note-app-mu-roan.vercel.app/)

---

## Usage

- Sign up or login with **email + OTP**.
- Create a new note, add a title and description.
- Update or delete existing notes.
- All actions are **secured using JWT**.

---

## Folder Structure

```
note-app/
│
├── frontend/ # React frontend (Vite + TS)
├── backend/ # Node.js backend
├── README.md # Project documentation

```

---

## Author

**Aditya Negi**  


