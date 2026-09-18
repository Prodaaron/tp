import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Unit } from "@/types";

export async function listUnits(propertyId: string): Promise<Unit[]> {
  const snap = await getDocs(
    query(
      collection(db, "units"),
      where("propertyId", "==", propertyId),
      orderBy("number")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Unit);
}

export async function createUnit(data: Omit<Unit, "id">): Promise<Unit> {
  const ref = await addDoc(collection(db, "units"), data);
  return { id: ref.id, ...data };
}

export async function updateUnit(id: string, data: Omit<Unit, "id">): Promise<void> {
  await updateDoc(doc(db, "units", id), data);
}

export async function deleteUnit(id: string): Promise<void> {
  await deleteDoc(doc(db, "units", id));
}
