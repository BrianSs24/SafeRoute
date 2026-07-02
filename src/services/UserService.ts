import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

export type UserProfile = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoURL?: string;
};

export async function saveUserProfile(
  profile: UserProfile
) {
  const userRef = doc(
    db,
    "users",
    profile.uid
  );

  await setDoc(
    userRef,
    profile,
    { merge: true }
  );
}

export async function getUserProfile(
  uid: string
) {
  const userRef = doc(
    db,
    "users",
    uid
  );

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
) {
  const userRef = doc(
    db,
    "users",
    uid
  );

  await updateDoc(
    userRef,
    data
  );
}
export async function loadCurrentUserProfile(
  uid: string
) {
  const userRef = doc(
    db,
    "users",
    uid
  );

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}