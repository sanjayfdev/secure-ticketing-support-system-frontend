import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardPage from "../features/tickets/pages/DashboardPage";
import CreateTicketPage from "../features/tickets/pages/CreateTicketPage";
import MyTicketsPage from "../features/tickets/pages/MyTicketPage";
import AdminDashboardPage from "../features/admin/pages/AdminDashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../guards/ProtectedRoute";
import NotFound from "../pages/NotFound";

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

  /*
    =========================================
    PROTECTED ROUTES
    =========================================
  */

  {
    element: <ProtectedRoute />,

    children: [
      {
        element: <DashboardLayout />,

        children: [
          {
            index: true,
            element: <DashboardPage />,
          },

          {
            path: "create-ticket",
            element: <CreateTicketPage />,
          },

          {
            path: "my-tickets",
            element: <MyTicketsPage />,
          },

          {
            path: "admin",
            element: <AdminDashboardPage />,
          },
        ],
      },
    ],
  },

  /*
    =========================================
    NOT FOUND
    =========================================
  */

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;