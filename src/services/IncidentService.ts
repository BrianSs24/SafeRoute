import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Incident } from "../models/Incident";


export async function createIncident(data: Incident) {

  await addDoc(
    collection(db, "incidents"),
    {
      ...data,
      createdAt: serverTimestamp(),
      status: "Pendiente",
    }
  );

}
export async function getIncidentsByUser(userId: string) {

  const q = query(
    collection(db, "incidents"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

}
export async function getAllIncidents() {

  const snapshot = await getDocs(
    collection(db, "incidents")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

}