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
  memberId: number;
  memberName: string;
  amount: number;
  term: number; // months
  interestRate: number; // percentage (flat per month or year? usually flat in KSP context based on LoanCalculator)
  startDate: string;
  status: LoanStatus;
  monthlyPayment: number;
  totalPayment: number;
  remainingAmount: number;
}
