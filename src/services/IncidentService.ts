import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
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

/**
 * Actualiza solo los campos editables de un incidente.
 * Latitud/longitud se omiten a propósito para preservar la ubicación original del reporte.
 */
export async function updateIncident(
  incidentId: string,
  data: {
    type: string;
    description: string;
    riskLevel: "Bajo" | "Medio" | "Alto";
  }
) {
  const incidentRef = doc(db, "incidents", incidentId);

  await updateDoc(incidentRef, {
    type: data.type,
    description: data.description,
    riskLevel: data.riskLevel,
  });
}

/** Elimina un documento concreto de la colección `incidents` por su id. */
export async function deleteIncident(incidentId: string) {
  const incidentRef = doc(db, "incidents", incidentId);
  await deleteDoc(incidentRef);
}