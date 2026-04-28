# Sovereign Ledger Frontend Architecture

This project has been refactored into a scalable, production-ready React frontend optimized for dynamic integration with a Spring Boot backend. 

## 📂 Project Structure

```text
src/
├── components/      # Reusable UI components (Navbar, Sidebar, etc.)
├── pages/           # Page-level components (LandingPage, Login, Dashboard, AdminPanel)
├── layouts/         # Layout wrappers for different application areas (MainLayout, AdminLayout)
├── routes/          # Centralized route definitions and Protected Route wrappers
├── services/        # API layer for interacting with Spring Boot (Axios instances & interceptors)
├── store/           # Global state management (AuthContext for JWT and user state)
├── hooks/           # Custom React hooks
├── utils/           # Helper functions
├── assets/          # Static assets (images, icons)
├── App.jsx          # Root component wrapping Providers and Router
└── main.jsx         # Application entry point
```

## 🔗 Backend Compatibility (Spring Boot)

### API Layer
The frontend uses `axios` for API calls, configured in `src/services/api.js`. 
- Base URL can be configured via the `.env` variable `VITE_API_URL` (default: `http://localhost:8080/api`).
- **JWT Authentication**: Axios interceptors automatically attach the `Bearer` token from `localStorage` to every request.
- **Error Handling**: A global response interceptor watches for `401 Unauthorized` responses and automatically logs the user out.

### Authentication Flow
The state is managed in `src/store/AuthContext.jsx`.
1. Users authenticate via the `Login.jsx` page.
2. The context makes an API call to your Spring Boot `/api/auth/login` endpoint.
3. The returned JWT token and User Details (including `role`) are stored in `localStorage` and React state.
4. Protected routes in `src/routes/index.jsx` restrict access based on the user's role (`ADMIN` or `USER`).

## 🎨 UI & Styling
- The design system uses the exact theme configuration exported from the Stitch AI project.
- **Tailwind CSS** is configured in `tailwind.config.js` to provide consistent utility classes mapping to the system's color variables.
- Component mock data has been structured to easily swap with dynamic API props.

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Configure your backend URL (Optional):
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
