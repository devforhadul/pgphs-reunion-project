import { auth } from "@/firebase/firebase.init";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { createContext, useEffect, useState, type ReactNode } from "react";

export const AuthContext = createContext<AuthContextTypes | null>(null)!;
const googleProvider = new GoogleAuthProvider();

interface AuthProviderProps {
  children: ReactNode;
}
interface AuthContextTypes {
  user: User | null;
  signinWithGoogle: () => Promise<void>;
  loading: boolean;
  logOut: () => Promise<void>;
  idToken?: string | null;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);

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

  // Auth state change
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

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
  };

  return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>;
}
