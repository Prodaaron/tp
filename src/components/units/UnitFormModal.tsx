"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Unit, UnitType, UnitStatus } from "@/types";
import styles from "./UnitFormModal.module.css";

interface Props {
  propertyId: string;
  unit: Unit | null; // null = creating a new unit, otherwise editing this one
  onClose: () => void;
  onSubmit: (data: Omit<Unit, "id">) => Promise<void>;
}

export function UnitFormModal({ propertyId, unit, onClose, onSubmit }: Props) {
  const [number, setNumber] = useState(unit?.number ?? "");
  const [type, setType] = useState<UnitType>(unit?.type ?? "residential");
  const [status, setStatus] = useState<UnitStatus>(unit?.status ?? "vacant");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ propertyId, number: number.trim(), type, status });
    } catch {
      setError("Couldn't save the unit. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <form
        className={styles.card}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className={styles.title}>{unit ? "Edit unit" : "Add unit"}</h2>

        <label className={styles.field}>
          <span>Unit number</span>
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="e.g. 101 or 2A"
            required
            autoFocus
          />
        </label>

        <label className={styles.field}>
          <span>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value as UnitType)}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as UnitStatus)}
          >
            <option value="vacant">Vacant</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Under maintenance</option>
          </select>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
