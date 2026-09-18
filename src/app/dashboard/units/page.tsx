"use client";

import { useEffect, useState } from "react";
import type { Property, Unit } from "@/types";
import { getProperty, createProperty } from "@/lib/firestore/properties";
import { listUnits, createUnit, updateUnit, deleteUnit } from "@/lib/firestore/units";
import { PropertySetupForm } from "@/components/units/PropertySetupForm";
import { UnitsTable } from "@/components/units/UnitsTable";
import { UnitFormModal } from "@/components/units/UnitFormModal";
import styles from "./page.module.css";

export default function UnitsPage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalUnit, setModalUnit] = useState<Unit | null | undefined>(undefined); // undefined = closed

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const prop = await getProperty();
        if (cancelled) return;
        setProperty(prop);
        if (prop) {
          setUnits(await listUnits(prop.id));
        }
      } catch {
        if (!cancelled) {
          setError(
            "Couldn't load units. If this is the first time, Firestore may need a composite index for this query — check the browser console for a link to create it."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateProperty(data: { name: string; address: string }) {
    const created = await createProperty(data);
    setProperty(created);
  }

  async function handleSaveUnit(data: Omit<Unit, "id">) {
    if (modalUnit) {
      await updateUnit(modalUnit.id, data);
      setUnits((prev) =>
        prev.map((u) => (u.id === modalUnit.id ? { ...data, id: modalUnit.id } : u))
      );
    } else {
      const created = await createUnit(data);
      setUnits((prev) => [...prev, created].sort((a, b) => a.number.localeCompare(b.number)));
    }
    setModalUnit(undefined);
  }

  async function handleDeleteUnit(unit: Unit) {
    if (!confirm(`Delete unit ${unit.number}? This can't be undone.`)) return;
    await deleteUnit(unit.id);
    setUnits((prev) => prev.filter((u) => u.id !== unit.id));
  }

  if (loading) return null;

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!property) {
    return (
      <div>
        <h1 className={styles.title}>Units</h1>
        <PropertySetupForm onSubmit={handleCreateProperty} />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Units</h1>
        <button className={styles.addButton} onClick={() => setModalUnit(null)}>
          Add unit
        </button>
      </div>

      <UnitsTable units={units} onEdit={setModalUnit} onDelete={handleDeleteUnit} />

      {modalUnit !== undefined && (
        <UnitFormModal
          propertyId={property.id}
          unit={modalUnit}
          onClose={() => setModalUnit(undefined)}
          onSubmit={handleSaveUnit}
        />
      )}
    </div>
  );
}
