"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaUser } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import { Profile, Loan } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalAsset: 0,
    activeMembers: 0,
    disbursedLoans: 0,
    pendingLoansCount: 0,
  });
  const [recentMembers, setRecentMembers] = useState<Profile[]>([]);
  const [pendingLoans, setPendingLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // 1. Stats: Active Members
      const { count: activeMembersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      // 2. Stats: Disbursed Loans (Sum amount where status = approved)
      // Note: Supabase doesn't support sum() directly in simple query without RPC or client-side calc.
      // For MVP, client-side calc is fine for small datasets.
      // Ideally use an RPC function for aggregations.
      const { data: approvedLoans } = await supabase
        .from("loans")
        .select("amount")
        .eq("status", "approved");

      const totalDisbursed =
        approvedLoans?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

      // 3. Stats: Total Asset (Approximation: Total Savings Balances)
      const { data: savings } = await supabase
        .from("savings_accounts")
        .select("balance");

      const totalSavings =
        savings?.reduce((acc, curr) => acc + Number(curr.balance), 0) || 0;

      // 4. Stats: Pending Loans Count
      const { count: pendingLoansCount } = await supabase
        .from("loans")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      setStats({
        totalAsset: totalSavings, // Using Savings as proxy for Assets/Liquidity
        activeMembers: activeMembersCount || 0,
        disbursedLoans: totalDisbursed,
        pendingLoansCount: pendingLoansCount || 0,
      });

      // 5. Recent Active Members (Limit 3)
      const { data: membersData } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);

      if (membersData) {
        // Map to Profile type if needed, or use as is (field names match mostly)
        const mappedMembers = membersData.map((m: any) => ({
          id: m.id,
          memberId: m.member_id,
          fullName: m.full_name,
          phone: m.phone,
          address: m.address,
          status: m.status,
        }));
        setRecentMembers(mappedMembers);
      }

      // 6. Pending Loans (Limit 1 for widget, or a few)
      const { data: loansData } = await supabase
        .from("loans")
        .select(
          `
            *,
            profiles:member_id (full_name, member_id)
        `
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(3);

      if (loansData) {
        setPendingLoans(loansData);
      }
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveLoan = async (loanId: number) => {
    // Basic approval logic - update status
    const { error } = await supabase
      .from("loans")
      .update({ status: "approved" })
      .eq("id", loanId);

    if (!error) {
      alert("Pinjaman berhasil disetujui");
      fetchDashboardData();
    } else {
      alert("Gagal menyetujui pinjaman");
    }
  };

  const handleRejectLoan = async (loanId: number) => {
    const { error } = await supabase
      .from("loans")
      .update({ status: "rejected" })
      .eq("id", loanId);

    if (!error) {
      alert("Pinjaman ditolak");
      fetchDashboardData();
    } else {
      alert("Gagal menolak pinjaman");
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm font-medium">
            Total Simpanan (Aset)
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            {formatCurrency(stats.totalAsset)}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-medium">Anggota Aktif</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {stats.activeMembers}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm font-medium">Pinjaman Cair</p>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            {formatCurrency(stats.disbursedLoans)}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <p className="text-gray-500 text-sm font-medium">Pending Approval</p>
          <h2 className="text-2xl font-bold text-red-600 mt-1">
            {stats.pendingLoansCount}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Members Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Anggota Terbaru</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded">
              Verified
            </span>
          </div>

          <div className="space-y-4">
            {recentMembers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Belum ada anggota baru.
              </p>
            ) : (
              recentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <FaUser />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {member.fullName}
                      </h4>
                      <p className="text-xs text-gray-500">
                        ID: {member.memberId}
                      </p>
                    </div>
                  </div>
                  {/* Temporarily removed action buttons until we have verification logic */}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Loan Approval Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Pengajuan Pinjaman Masuk
            </h3>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded">
              {stats.pendingLoansCount} Pending
            </span>
          </div>

          {pendingLoans.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Tidak ada pengajuan pinjaman menunggu.
            </p>
          ) : (
            pendingLoans.map((loan) => (
              <div
                key={loan.id}
                className="border border-gray-200 rounded-lg p-5 mb-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {loan.profiles?.full_name}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        ({loan.profiles?.member_id})
                      </span>
                    </h4>
                    <p className="text-sm text-gray-500">Pinjaman Regular</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-600 font-bold">Total</p>
                    <p className="text-xl font-bold text-blue-700">
                      {formatCurrency(loan.amount)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="text-gray-500">Tenor:</p>
                    <p className="font-semibold text-gray-900">
                      {loan.term} Bulan
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApproveLoan(loan.id)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => handleRejectLoan(loan.id)}
                    className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
