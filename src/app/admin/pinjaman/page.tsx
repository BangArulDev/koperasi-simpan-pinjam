"use client";

import { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaTrash,
} from "react-icons/fa";
import { Loan, LoanStatus, Profile } from "@/types";
import LoanModal from "@/components/LoanModal";
import { supabase } from "@/lib/supabase";

export default function AdminPinjamanPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LoanStatus | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data from Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Loans
      const { data: loansData, error: loansError } = await supabase
        .from("loans")
        .select(
          `
          *,
          profiles:member_id (
            full_name
          )
        `
        )
        .order("created_at", { ascending: false });

      if (loansError) throw loansError;

      const formattedLoans: Loan[] = (loansData || []).map((l: any) => ({
        id: l.id,
        memberId: l.member_id,
        memberName: l.profiles?.full_name || "Unknown",
        amount: Number(l.amount),
        term: l.term,
        interestRate: Number(l.interest_rate),
        startDate: l.start_date,
        status: l.status,
        monthlyPayment: Number(l.monthly_payment),
        totalPayment: Number(l.total_payment),
        remainingAmount: Number(l.remaining_amount),
      }));
      setLoans(formattedLoans);

      // Fetch Profiles (for modal)
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, member_id, full_name, phone, address, status")
        .eq("status", "active");

      if (profilesError) throw profilesError;

      const formattedProfiles: Profile[] = (profilesData || []).map(
        (p: any) => ({
          id: p.id,
          memberId: p.member_id,
          fullName: p.full_name,
          phone: p.phone,
          address: p.address,
          status: p.status,
        })
      );
      setMembers(formattedProfiles);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal mengambil data dari database.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Logic
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch = loan.memberName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddLoan = async (
    newLoanData: Omit<Loan, "id" | "status" | "remainingAmount">
  ) => {
    try {
      const { data, error } = await supabase
        .from("loans")
        .insert([
          {
            member_id: newLoanData.memberId,
            amount: newLoanData.amount,
            term: newLoanData.term,
            interest_rate: newLoanData.interestRate,
            start_date: newLoanData.startDate,
            status: "pending",
            monthly_payment: newLoanData.monthlyPayment,
            total_payment: newLoanData.totalPayment,
            remaining_amount: newLoanData.totalPayment,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      alert("Pengajuan pinjaman berhasil disimpan!");
      fetchData(); // Refresh list
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding loan:", error);
      alert("Gagal menambah pinjaman.");
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: LoanStatus) => {
    try {
      const { error } = await supabase
        .from("loans")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // Optimistic update
      setLoans(
        loans.map((loan) =>
          loan.id === id ? { ...loan, status: newStatus } : loan
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal memperbarui status pinjaman.");
    }
  };

  const handleDeleteLoan = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pinjaman ini?")) {
      try {
        const { error } = await supabase.from("loans").delete().eq("id", id);

        if (error) throw error;

        setLoans(loans.filter((loan) => loan.id !== id));
      } catch (error) {
        console.error("Error deleting loan:", error);
        alert("Gagal menghapus pinjaman.");
      }
    }
  };

  const openApproveModal = (loan: Loan) => {
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
      {/* Loan Modal */}
      <LoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLoan}
        initialData={selectedLoan}
        members={members}
      />
    </div>
  );
}
