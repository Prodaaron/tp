"use client";

import { useState, type FormEvent } from "react";
import styles from "./PropertySetupForm.module.css";

interface Props {
  onSubmit: (data: { name: string; address: string }) => Promise<void>;
}

export function PropertySetupForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), address: address.trim() });
    } catch {
      setError("Couldn't save the building. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Set up your building</h2>
      <p className={styles.subtitle}>
        This is a one-time step — units will belong to this property.
      </p>

      <label className={styles.field}>
        <span>Building name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Tirsit Tower"
          required
          autoFocus
        />
      </label>

      <label className={styles.field}>
        <span>Address</span>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? "Saving…" : "Save building"}
      </button>
    </form>
  );
}
