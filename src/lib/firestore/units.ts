import {
  collection,
  doc,
  addDoc,
  setDoc,
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

// Full overwrite, not a partial merge: if an optional field (layout, notes,
// areaSqm) was cleared or no longer applies (e.g. switching from residential
// to commercial), it needs to actually disappear from the document.
export async function updateUnit(id: string, data: Omit<Unit, "id">): Promise<void> {
  await setDoc(doc(db, "units", id), data);
}

export async function deleteUnit(id: string): Promise<void> {
  await deleteDoc(doc(db, "units", id));
}
