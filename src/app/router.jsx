
import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";



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
]);

export default router;