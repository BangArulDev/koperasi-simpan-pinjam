export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "simpanan" | "pinjaman" | "penarikan" | "pembayaran";
  amount: number;
  status: "berhasil" | "pending" | "gagal";
}

export type LoanStatus = "pending" | "approved" | "rejected" | "paid";

export interface Loan {
  id: number;
  memberId: string; // UUID from profiles
  memberName: string;
  amount: number;
  term: number; // months
  interestRate: number; // percentage
  startDate: string;
  status: LoanStatus;
  monthlyPayment: number;
  totalPayment: number;
  remainingAmount: number;
}

export interface Profile {
  id: string; // UUID
  memberId: string; // Custom ID like KSP-2024-001
  fullName: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
}
