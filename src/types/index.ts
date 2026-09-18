// Domain types for the PMS. These mirror the Firestore collections and
// firestore.rules roles — keep both in sync when either changes.

export type UserRole = "owner" | "manager" | "accountant" | "maintenance";

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string; // ISO timestamp
}

export interface Property {
  id: string;
  name: string;
  address: string;
}

export type UnitType = "residential" | "commercial";
export type UnitStatus = "occupied" | "vacant" | "maintenance";

export interface Unit {
  id: string;
  propertyId: string;
  number: string;
  type: UnitType;
  status: UnitStatus;
  areaSqm?: number; // floor area in square meters
  layout?: string; // residential only, e.g. "Studio", "2 Bedroom"
  notes?: string; // anything else worth recording about this unit
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string; // set for commercial tenants
}

export type LeaseStatus = "active" | "expired" | "terminated";

export interface Lease {
  id: string;
  tenantId: string;
  unitId: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  rentAmount: number;
  status: LeaseStatus;
}

export type PaymentStatus = "paid" | "pending" | "overdue";

export interface Payment {
  id: string;
  leaseId: string;
  amount: number;
  date: string; // ISO date
  method: string;
  status: PaymentStatus;
}

export type MaintenanceStatus = "open" | "in_progress" | "done";

export interface MaintenanceRequest {
  id: string;
  unitId: string;
  tenantId: string;
  description: string;
  status: MaintenanceStatus;
  assignedTo?: string; // uid of maintenance staff
}
