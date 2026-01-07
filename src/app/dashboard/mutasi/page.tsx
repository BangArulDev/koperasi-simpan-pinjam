"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import MutationTable from "../../../components/MutationTable";
import { FaFileInvoiceDollar, FaFilter } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import { Transaction } from "@/types";

export default function MutasiPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    } else if (user) {
      fetchTransactions();
    }
  }, [isAuthenticated, authLoading, router, user]);

  const fetchTransactions = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("member_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;

      if (data) {
        setTransactions(
          data.map((t: any) => ({
            id: t.id,
            date: new Date(t.date).toLocaleDateString("id-ID"),
            description: t.description,
            type: t.type,
            amount: Number(t.amount),
            status: t.status,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || (!user && isLoading)) {
    // Wait for auth or initial data load logic
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaFileInvoiceDollar className="text-blue-600" /> Riwayat Mutasi
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Daftar lengkap transaksi simpanan dan pinjaman Anda.
            </p>
          </div>
          <button className="mt-4 sm:mt-0 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <FaFilter /> Filter
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Memuat data...</div>
          ) : transactions.length > 0 ? (
            <MutationTable data={transactions} />
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
