import { db } from "../firebase/firebase";
import { collection, doc, setDoc, getDocs, updateDoc, onSnapshot } from "firebase/firestore";

const usersCollection = collection(db, "users");

// 1️⃣ Create user doc
export const createUserDoc = async (uid: string, name: string, email: string) => {
  try {
    console.log("🔹 Creating Firestore doc for UID:", uid);
    const userDoc = doc(db, "users", uid);
    await setDoc(userDoc, {
      name,
      email,
      duration: "",
      title: "",
      skills: { primary: [], secondary: [], status: "" },
      roadmap: {},
      tasks: [],
    });
    console.log("✅ Firestore doc created for UID:", uid);
  } catch (err: any) {
    console.error("❌ Error creating Firestore doc:", err.message);
    throw err;
  }
};

// 2️⃣ Get all users
export const getUsers = async () => {
  try {
    console.log("🔹 Fetching all users");
    const snapshot = await getDocs(usersCollection);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("✅ Users fetched:", data.length);
    return data;
  } catch (err: any) {
    console.error("❌ Error fetching users:", err.message);
    throw err;
  }
};

// 3️⃣ Listen for live updates
export const listenUserDoc = (uid: string, callback: (data: any) => void) => {
  try {
    console.log("🔹 Listening to Firestore doc UID:", uid);
    const userDoc = doc(db, "users", uid);
    return onSnapshot(userDoc, (docSnap) => {
      if (docSnap.exists()) {
        console.log("🔹 Firestore doc updated:", docSnap.data());
        callback(docSnap.data());
      }
    });
  } catch (err: any) {
    console.error("❌ Error in onSnapshot:", err.message);
    throw err;
  }
};

// 4️⃣ Update roadmap
export const updateRoadmap = async (uid: string, roadmap: any) => {
  try {
    console.log("🔹 Updating roadmap for UID:", uid);
    const userDoc = doc(db, "users", uid);
    await updateDoc(userDoc, { roadmap });
    console.log("✅ Roadmap updated for UID:", uid);
  } catch (err: any) {
    console.error("❌ Error updating roadmap:", err.message);
    throw err;
  }
};
