import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";

const AdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;