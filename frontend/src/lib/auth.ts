export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
  currentBand: number;
  targetBand: number;
  rowCreated?: string | null;
  lastLogin?: string | null;
}
