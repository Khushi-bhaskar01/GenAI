import { auth } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";

export const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
  try {
    console.log("🔹 Signing up user:", email);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
      console.log("✅ Profile updated with displayName:", displayName);
    }
    console.log("✅ Signup successful, UID:", cred.user.uid);
    return cred.user;
  } catch (err: any) {
    console.error("❌ Signup error:", err.message);
    throw err;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    console.log("🔹 Signing in user:", email);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Signin successful, UID:", cred.user.uid);
    return cred.user;
  } catch (err: any) {
    console.error("❌ Signin error:", err.message);
    throw err;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("✅ User signed out");
  } catch (err: any) {
    console.error("❌ Signout error:", err.message);
    throw err;
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    console.log("🔹 Auth state changed:", user?.uid ?? "No user");
    callback(user);
  });
};
