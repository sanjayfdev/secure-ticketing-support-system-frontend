# Secure Ticketing & Support System - Frontend

A modern and responsive frontend application for the Secure Ticketing & Support System built using React.js.

---

# Features

- Responsive UI
- User Authentication
- Ticket Dashboard
- Create Ticket
- View My Tickets
- Admin Dashboard
- Update Ticket Status
- Protected Routes
- JWT Authentication Integration

---

# Tech Stack

- React.js
- React Router DOM
- Axios
- Material UI
- Zustand
- Zod
- react-form-hook

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/sanjayfdev/secure-ticketing-support-system-backend.git
```

---

## 2. Move to Frontend Folder

```bash
cd secure-ticketing-support-system-backend
```

---

## 3. Install Dependencies

```bash
npm install
```

---

# Run Frontend

```bash
npm run dev
```

---

# Frontend Running URL

```bash
http://localhost:5173
```

---

# Application Flow

## Step 1 - Register

New users must first create an account.

Navigate to:

```bash
/register
```

Provide:
- Name
- Email
- Password

---

## Step 2 - Login

After successful registration, login using:

```bash
/login
```

---

## Step 3 - Access Dashboard

After login:

### User Features

- Create Support Ticket
- View Submitted Tickets
- Track Ticket Status

### Admin Features

- View All Tickets
- Update Ticket Status
- Resolve Tickets

---

# Backend Connection

Update API Base URL in your frontend environment/config file.

Example:

```js
const API_URL = "http://localhost:5000/api";
```

---

# Pages

## User Pages

- Login
- Register
- Dashboard
- Create Ticket
- My Tickets

---

## Admin Pages

- Admin Dashboard
- All Tickets
- Ticket Status Update

---

# Authentication

JWT token is stored after login and used for protected API requests.

Authorization Header Example:

```bash
Authorization: Bearer YOUR_TOKEN
```

---

# Responsive Design

Supports:
- Desktop
- Tablet
- Mobile Devices

---

# Future Improvements

- Dark Mode
- Charts & Analytics
- Real-Time Notifications
- Ticket Priority
- File Attachments
- Search & Filters

---

# Author

Sanjay Kumar