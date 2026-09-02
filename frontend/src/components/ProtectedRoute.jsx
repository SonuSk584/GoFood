import { useContext } from "react";
import { AuthContext } from "../context/Authcontext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" />;

  return children;
}

export default ProtectedRoute;