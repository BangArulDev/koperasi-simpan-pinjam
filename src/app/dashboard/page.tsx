"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  FaDownload,
  FaPlus,
  FaWallet,
  FaMoneyBillWave,
  FaChartPie,
  FaBell,
  FaArrowUp,
  FaExclamationCircle,
} from "react-icons/fa";
import Link from "next/link";
import MutationTable from "../../components/MutationTable";
import { supabase } from "@/lib/supabase";
import { Transaction } from "@/types";

export default function DashboardPage() {
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Dashboard Stats State
  const [totalSimpanan, setTotalSimpanan] = useState(0);
  const [activeLoan, setActiveLoan] = useState<any>(null); // Simplified for now

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    } else if (user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, authLoading, router, user]);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      if (!user) return;

      // 1. Fetch Transactions
      const { data: trxData } = await supabase
        .from("transactions")
        .select("*")
        .eq("member_id", user.id)
        .order("date", { ascending: false })
        .limit(5);

      if (trxData) {
        setTransactions(
          trxData.map((t: any) => ({
            id: t.id,
            date: new Date(t.date).toLocaleDateString("id-ID"),
            description: t.description,
            type: t.type,
            amount: Number(t.amount),
            status: t.status,
          }))
        );
      }

      // 2. Fetch Savings (Simplified sum for now, effectively from transactions or a summary table if exists)
      // Ideally we query the 'savings_accounts' table but let's assume we sum from transactions for MVP or query a view.
      // Or better, query savings_accounts table directly if populated.
      const { data: savingsData } = await supabase
        .from("savings_accounts")
        .select("balance")
        .eq("member_id", user.id);

      const currentSavings =
        savingsData?.reduce((acc, curr) => acc + Number(curr.balance), 0) || 0;
      setTotalSimpanan(currentSavings);

      // 3. Fetch Active Loan
      const { data: loanData } = await supabase
        .from("loans")
        .select("*")
        .eq("member_id", user.id)
        .eq("status", "approved")
        .single();

      if (loanData) {
        setActiveLoan(loanData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoadingData(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Halo, {profile?.full_name || user.email}
            </h1>
            <p className="text-gray-600 text-sm">
              No. Anggota: {profile?.member_id || "-"} |{" "}
              {profile?.status === "active"
                ? "Anggota Aktif"
                : "Status: " + profile?.status}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Link
              href="/dashboard/laporan"
              className="bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 shadow-sm flex items-center gap-2"
            >
              <FaDownload /> Laporan
            </Link>
            <Link
              href="/dashboard/ajukan-pinjaman"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 shadow-sm flex items-center gap-2"
            >
              <FaPlus /> Ajukan Pinjaman
            </Link>
          </div>
        </div>

        {/* Dashboard Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card Saldo */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <FaWallet className="text-8xl" />
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">
              Total Simpanan Anda
            </p>
            <h2 className="text-3xl font-bold mb-4">
              {formatCurrency(totalSimpanan)}
            </h2>
            <div className="space-y-2 text-sm text-blue-100 border-t border-blue-500 pt-3">
              <div className="flex justify-between">
                <span>Simpanan Pokok</span>
                <span className="font-semibold">{formatCurrency(0)}</span>{" "}
                {/* TODO: Break down savings types */}
              </div>
              <div className="flex justify-between">
                <span>Simpanan Wajib</span>
                <span className="font-semibold">
                  {formatCurrency(totalSimpanan)}
                </span>
              </div>
            </div>
          </div>

          {/* Card Pinjaman Aktif */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Pinjaman Aktif
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  {activeLoan
                    ? formatCurrency(activeLoan.remaining_amount)
                    : "Tidak ada"}
                </h2>
                {activeLoan && (
                  <p className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1">
                    <FaExclamationCircle /> Jatuh tempo: 25{" "}
                    {new Date().toLocaleString("default", { month: "short" })}
                  </p>
                )}
              </div>
              <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                <FaMoneyBillWave className="text-xl" />
              </div>
            </div>
            {activeLoan ? (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress Pelunasan</span>
                  <span>
                    {Math.round(
                      ((activeLoan.total_payment -
                        activeLoan.remaining_amount) /
                        activeLoan.total_payment) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full"
                    style={{
                      width: `${Math.round(
                        ((activeLoan.total_payment -
                          activeLoan.remaining_amount) /
                          activeLoan.total_payment) *
                          100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Cicilan {formatCurrency(activeLoan.monthly_payment)} / bulan
                </p>
                <button className="mt-4 w-full border border-gray-300 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-50">
                  Lihat Detail
                </button>
              </div>
            ) : (
              <div className="mt-4 text-sm text-gray-500">
                Anda tidak memiliki pinjaman aktif saat ini.
              </div>
            )}
          </div>

          {/* Card SHU / Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Estimasi SHU Tahun Ini
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">Rp 0</h2>
                <p className="text-xs text-gray-400 mt-1 font-semibold flex items-center gap-1">
                  Belum tersedia
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg text-green-600">
                <FaChartPie className="text-xl" />
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 font-medium mb-2">
                Pemberitahuan:
              </p>
              <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <FaBell className="text-blue-500 mt-0.5" />
                Selamat datang di sistem baru KSP Sejahtera!
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Mutasi Terakhir</h3>
            <Link
              href="/dashboard/mutasi"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Lihat Semua
            </Link>
          </div>
          {loadingData ? (
            <div className="p-6 text-center text-gray-500">Memuat data...</div>
          ) : transactions.length > 0 ? (
            <MutationTable data={transactions} limit={5} />
          ) : (
            <div className="p-6 text-center text-gray-500">
              Belum ada transaksi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
