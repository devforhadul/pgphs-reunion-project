import { auth } from "@/firebase/firebase.init";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  sendSignInLinkToEmail,
  type User,
  isSignInWithEmailLink,
  signInWithEmailLink as firebaseSignInWithEmailLink,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { createContext, useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";


export const AuthContext = createContext<AuthContextTypes | null>(null)!;
const googleProvider = new GoogleAuthProvider();

interface AuthProviderProps {
  children: ReactNode;
}
interface AuthContextTypes {
  user: User | null;
  signinWithGoogle: () => Promise<void>;
  sendSignInLink: (email: string) => Promise<void>;
  signInWithEmailLink: () => Promise<void>;
  loading: boolean;
  logOut: () => Promise<void>;
  idToken?: string | null;
  signInWithEmailPass: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);

  const signInWithEmailPass = async (email: string, password: string) => {
    try {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setUser(user);
          toast.success("Login successfully");

          // ...
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
          alert(errorMessage);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error(error);
    }
  };

  const signinWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      setIdToken(token);
      localStorage.setItem("token", token); // Save token in localStorage
      setUser(result.user);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setIdToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  /** Send Email Link */
  const sendSignInLink = async (email: string) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/finishSignIn`,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem("emailForSignIn", email);
    console.log("Email link sent to", email);
  };

  /** Complete Email Link sign-in */
  const signInWithEmailLink = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = localStorage.getItem("emailForSignIn");
      if (!email) {
        email =
          window.prompt("Please provide your email for confirmation") || "";
      }
      try {
        const result = await firebaseSignInWithEmailLink(
          auth,
          email,
          window.location.href
        );
        const token = await result.user.getIdToken();
        setIdToken(token);
        localStorage.setItem("token", token);
        setUser(result.user);
        localStorage.removeItem("emailForSignIn");
      } catch (err) {
        console.error("Email link sign-in error:", err);
      }
    }
  };

  // Auth state change
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      console.log("Current:", currentUser);

      if (currentUser) {
        const token = await currentUser.getIdToken();
        setIdToken(token);
        localStorage.setItem("token", token);
      } else {
        setIdToken(null);
        localStorage.removeItem("token");
      }

      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  const userInfo: AuthContextTypes = {
    user,
    signinWithGoogle,
    loading,
    logOut,
    idToken,
    sendSignInLink,
    signInWithEmailLink,
    signInWithEmailPass,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
}
