import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";

const ProtectedRoute = () => {
//   const token = useAuthStore((state) => state.token);

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

  return <Outlet />;
};

export default ProtectedRoute;