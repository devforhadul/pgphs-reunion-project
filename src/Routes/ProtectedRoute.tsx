import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { AuthContext } from "@/provider/AuthProvider";
import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useContext(AuthContext);
  const ADMIN_EMAILS = [
    "forhadul75@gmail.com",
    "fiforhad2003@gmail.com",
    "shakilchowdhuryshihab84@gmail.com",
  ];

  if (!auth) return <LoadingOverlay />; // Context এখনও load হচ্ছে

  const { user, loading } = auth;

  if (loading) return <LoadingOverlay />;

  if (!user) {
    // যদি login না করা থাকে
    return <Navigate to="/login" replace />;
  }

  if (!ADMIN_EMAILS.includes(user.email!)) {
    // যদি email match না করে
    return <Navigate to="/unauthorized" replace />;
  }

  // সব ঠিক থাকলে children render হবে
  return <>{children}</>;
}
