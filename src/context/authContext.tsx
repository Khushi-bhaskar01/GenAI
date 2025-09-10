import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { app } from "../firebase/firebase";
import type { User } from "firebase/auth";

// 1. Define the context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// 2. Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// 3. Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
