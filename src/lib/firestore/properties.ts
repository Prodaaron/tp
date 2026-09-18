import { collection, addDoc, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Property } from "@/types";

// MVP is a single building. This returns the first property doc if one
// exists, or null if the building hasn't been set up yet.
export async function getProperty(): Promise<Property | null> {
  const snap = await getDocs(query(collection(db, "properties"), limit(1)));
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Property;
}

export async function createProperty(data: Omit<Property, "id">): Promise<Property> {
  const ref = await addDoc(collection(db, "properties"), data);
  return { id: ref.id, ...data };
}
