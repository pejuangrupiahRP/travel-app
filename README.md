# 🌍 Travel Booking Website

A fullstack travel booking website where users can explore tour packages, register/login to book trips, and admins can monitor and manage the system through a secured dashboard.

---

## ✨ Features

### 👤 User (Visitor & Customer)
- View landing page and tour packages without login
- View package details (destination, price, facilities, schedule)
- User authentication (Register & Login)
- Booking tour packages (login required)
- Secure user session management

> ℹ️ Visitors can freely explore the website, but **must register and login** to book any tour package.

---

### 🛠️ Admin
- Admin authentication (login required)
- Monitor bookings and users
- Manage tour packages
- Monitor website activity through admin dashboard

> 🔐 Admin access is protected and only accessible after login.

---

## 🔄 Application Flow

### User Flow
1. User opens the landing page
2. User views tour packages
3. If interested → user must **login**
4. If user does not have an account → **register first**
5. User books a tour package after successful login

### Admin Flow
1. Admin opens admin login page
2. Admin logs in
3. Admin accesses dashboard
4. Admin monitors and manages website data

---

## 🧱 Tech Stack

### Backend
- **Node.js**
- **Express.js**
- RESTful API
- Authentication & Authorization
- Database (configured in backend)

### Frontend
- **React.js**
- Component-based architecture
- API integration with backend
- Responsive UI

---

## 📁 Project Structure

