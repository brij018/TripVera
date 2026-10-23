import React from "react";
import { useEffect, useState } from "react";
import { auth, googleAuthProvider } from "../config/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import authContext from "./auth-context";

const AuthContextProvider = ({ children, childern }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleAuthProvider);
  };
  const logout = () => {
    return signOut(auth);
  };

  const value = {
    login,
    user,
    loading,
    signup,
    logout,
    loginWithGoogle,
  };
  return (
    <authContext.Provider value={value}>
      {children || childern}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
