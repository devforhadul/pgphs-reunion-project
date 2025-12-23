import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/provider/AuthProvider";
import { FiLoader } from "react-icons/fi";

export default function FinishSignIn() {
  const { signInWithEmailLink, user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    const completeSignIn = async () => {
      await signInWithEmailLink();
    };
    completeSignIn();
  }, []);

  // Redirect when user is logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // change to your desired route
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-10 flex flex-col items-center max-w-sm w-full">
        <div className="mb-6">
          <FiLoader className="animate-spin text-5xl text-blue-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          Signing you in
        </h1>
        <p className="text-gray-500 text-center">
          Please wait a moment while we complete your login.
        </p>
      </div>
    </div>
  );
}
