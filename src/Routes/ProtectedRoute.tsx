import { AuthContext } from "@/provider/AuthProvider";
import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router";


interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useContext(AuthContext);

  if (!auth) return <p>Loading...</p>; // Context এখনও load হচ্ছে

  const { user, loading } = auth;

  if (loading) return <p>Loading...</p>;

  if (!user) {
    // যদি login না করা থাকে
    return <Navigate to="/login" replace />;
  }

  if (user.email !== "forhadul75@gmail.com") {
    // যদি email match না করে
    return <Navigate to="/unauthorized" replace />;
  }

  // সব ঠিক থাকলে children render হবে
  return <>{children}</>;
}
