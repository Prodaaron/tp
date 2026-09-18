import type { Unit } from "@/types";
import styles from "./UnitsTable.module.css";

const STATUS_LABEL: Record<Unit["status"], string> = {
  occupied: "Occupied",
  vacant: "Vacant",
  maintenance: "Under maintenance",
};

const TYPE_LABEL: Record<Unit["type"], string> = {
  residential: "Residential",
  commercial: "Commercial",
};

interface Props {
  units: Unit[];
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
}

export function UnitsTable({ units, onEdit, onDelete }: Props) {
  if (units.length === 0) {
    return <p className={styles.empty}>No units yet — add your first unit.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Unit</th>
          <th>Type</th>
          <th>Status</th>
          <th aria-label="Actions" />
        </tr>
      </thead>
      <tbody>
        {units.map((unit) => (
          <tr key={unit.id}>
            <td className={styles.number}>{unit.number}</td>
            <td>{TYPE_LABEL[unit.type]}</td>
            <td>
              <span className={`${styles.badge} ${styles[unit.status]}`}>
                {STATUS_LABEL[unit.status]}
              </span>
            </td>
            <td className={styles.actions}>
              <button onClick={() => onEdit(unit)}>Edit</button>
              <button onClick={() => onDelete(unit)} className={styles.delete}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
