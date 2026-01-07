"use client";

import { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaTrash,
} from "react-icons/fa";
import { Loan, LoanStatus } from "@/types";
import LoanModal from "@/components/LoanModal";

// Mock Data
const MOCK_LOANS: Loan[] = [
  {
    id: 1,
    memberId: 1,
    memberName: "Budi Santoso",
    amount: 5000000,
    term: 12,
    interestRate: 1.5,
    startDate: "2024-01-15",
    status: "approved",
    monthlyPayment: 491666,
    totalPayment: 5900000,
    remainingAmount: 4500000,
  },
  {
    id: 2,
    memberId: 2,
    memberName: "Siti Aminah",
    amount: 2000000,
    term: 6,
    interestRate: 1.5,
    startDate: "2024-02-01",
    status: "pending",
    monthlyPayment: 363333,
    totalPayment: 2180000,
    remainingAmount: 2180000,
  },
  {
    id: 3,
    memberId: 3,
    memberName: "Rudi Hartono",
    amount: 10000000,
    term: 24,
    interestRate: 1.2,
    startDate: "2024-01-10",
    status: "paid",
    monthlyPayment: 536666,
    totalPayment: 12880000,
    remainingAmount: 0,
  },
];

export default function AdminPinjamanPage() {
  const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LoanStatus | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  // Filter Logic
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch = loan.memberName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddLoan = (
    newLoanData: Omit<Loan, "id" | "status" | "remainingAmount">
  ) => {
    const newId =
      loans.length > 0 ? Math.max(...loans.map((l) => l.id)) + 1 : 1;
    const newLoan: Loan = {
      ...newLoanData,
      id: newId,
      status: "pending",
      remainingAmount: newLoanData.totalPayment,
    };
    setLoans([newLoan, ...loans]);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (id: number, newStatus: LoanStatus) => {
    setLoans(
      loans.map((loan) =>
        loan.id === id ? { ...loan, status: newStatus } : loan
      )
    );
  };

  const handleDeleteLoan = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pinjaman ini?")) {
      setLoans(loans.filter((loan) => loan.id !== id));
    }
  };

  const openApproveModal = (loan: Loan) => {
    // In a real app, you might show details before approving
    if (confirm(`Setujui pinjaman untuk ${loan.memberName}?`)) {
      handleUpdateStatus(loan.id, "approved");
    }
  };

  const openRejectModal = (loan: Loan) => {
    if (confirm(`Tolak pinjaman untuk ${loan.memberName}?`)) {
      handleUpdateStatus(loan.id, "rejected");
    }
  };

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const getStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case "approved":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
            Disetujui
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
            Menunggu
          </span>
        );
      case "rejected":
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
            Ditolak
          </span>
        );
      case "paid":
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
            Lunas
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Pinjaman
          </h1>
          <p className="text-gray-600">
            Kelola pengajuan dan data pinjaman anggota
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedLoan(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FaPlus />
          <span>Ajukan Pinjaman</span>
        </button>
      </div>

      {/* Stats Cards (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <FaMoneyBillWave size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pinjaman Aktif</p>
              <h3 className="text-xl font-bold text-gray-800">
                {formatter.format(
                  loans
                    .filter((l) => l.status === "approved")
                    .reduce((acc, curr) => acc + curr.remainingAmount, 0)
                )}
              </h3>
            </div>
          </div>
        </div>
        {/* Add more stats if needed */}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama anggota..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as LoanStatus | "all")
          }
        >
          <option value="all">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
          <option value="paid">Lunas</option>
        </select>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Anggota
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Tenor
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Angsuran
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {loan.memberName}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {loan.memberId}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {formatter.format(loan.amount)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {loan.term} Bulan
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatter.format(loan.monthlyPayment)}/bln
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(loan.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {loan.status === "pending" && (
                          <>
                            <button
                              onClick={() => openApproveModal(loan)}
                              className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Setujui"
                            >
                              <FaCheck size={14} />
                            </button>
                            <button
                              onClick={() => openRejectModal(loan)}
                              className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Tolak"
                            >
                              <FaTimes size={14} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteLoan(loan.id)}
                          className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Hapus"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada data pinjaman yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <LoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLoan}
        initialData={selectedLoan}
      />
    </div>
  );
}
