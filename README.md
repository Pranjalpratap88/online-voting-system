# Online Voting System - Sovereign Ledger

A production-grade, secure, and transparent digital voting platform built with **Spring Boot**, **React**, and **MongoDB**. This project provides a robust framework for managing elections, candidate nominations, and secure citizen voting with real-time results.

## 🚀 Features

- **Multi-Role Access**: Dedicated portals for **Admins** and **Citizens**.
- **Secure Authentication**: JWT-based login, OTP verification, and password reset functionality.
- **Voter Management**: Comprehensive citizen registry with Voter ID verification.
- **Election Command Center**: Create, manage, and monitor elections with ease.
- **Candidate Nomination**: Citizens can apply for candidacy, with a streamlined admin approval workflow.
- **Fraud Prevention**: Ensures one vote per citizen per election.
- **Real-time Results**: Instant tabulation and visualization of election outcomes.
- **Modern UI/UX**: Dark-themed, responsive design built with Tailwind CSS.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router 7
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security (JWT-based)
- **Database**: MongoDB (Atlas)
- **Mailing**: Spring Mail (SMTP)
- **Build Tool**: Maven

## 📋 Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher
- **MongoDB**: A running MongoDB instance (Local or Atlas)
- **Maven**: For backend dependency management

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Online-Voting-System
```

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Update `src/main/resources/application.properties` with your MongoDB URI and Mail credentials:
   ```properties
   spring.data.mongodb.uri=your_mongodb_uri
   spring.mail.username=your_email
   spring.mail.password=your_app_password
   ```
3. Build and run the backend:
   ```bash
   mvn clean install
   ```

### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (if needed) or ensure the API base URL in services matches your backend port (default: 8080).
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🎮 Execution Commands

| Component | Command | Description |
| :--- | :--- | :--- |
| **Backend** | `mvn spring-boot:run` | Start the Spring Boot API |
| **Frontend** | `npm run dev` | Start the React development server |
| **Build Frontend** | `npm run build` | Generate production build |

## 🔑 Default Credentials

- **Admin Account**:
  - **Email**: `admin@onlinevoting.portal`
  - **Password**: `admin123`

---

## 📂 Project Structure

```text
Online Voting System/
├── backend/            # Spring Boot Application
│   ├── src/main/java/  # Java Source Code
│   └── src/resources/  # Configuration & Properties
├── frontend/           # React Application (Vite)
│   ├── src/pages/      # UI Pages
│   └── src/components/ # Reusable UI Components
└── ...
```
