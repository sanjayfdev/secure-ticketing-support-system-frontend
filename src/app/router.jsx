import { createBrowserRouter, Navigate } from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardPage from "../features/tickets/pages/DashboardPage";
import AdminDashboardPage from "../features/admin/pages/AdminDashboard";

const router = createBrowserRouter([
  /*
    =========================================
    PUBLIC ROUTES
    =========================================
  */
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    path: "/",
    element: <DashboardPage />,
  },

  {
    path: "/admin-dashboard",
    element: <AdminDashboardPage/>,
  },

]);

export default router;
