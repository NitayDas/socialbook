import { Navigate } from "react-router-dom";
import { useUser } from "./UserProvider";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  console.log("ProtectedRoute - user:", user, "loading:", loading); // Debugging line

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;