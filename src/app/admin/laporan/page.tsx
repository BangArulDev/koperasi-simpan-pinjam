"use client";

import { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaUsers,
  FaPiggyBank,
  FaFilePdf,
  FaFileExcel,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";
import MutationTable from "@/components/MutationTable";
import { Transaction } from "@/types";
import { supabase } from "@/lib/supabase";

export default function AdminLaporanPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i + 1
  );

  useEffect(() => {
    fetchTransactions();
    fetchTotalMembers();
  }, [selectedMonth, selectedYear]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // Calculate start and end date of the selected month
      const startDate = new Date(selectedYear, selectedMonth, 1).toISOString();
      const endDate = new Date(
        selectedYear,
        selectedMonth + 1,
        0
      ).toISOString();

      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          *,
          profiles:member_id (full_name)
        `
        )
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: false });

      if (error) throw error;

      const formattedData: Transaction[] = (data || []).map((t: any) => ({
        id: t.id,
        date: new Date(t.date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        description: t.description,
        type: t.type,
        amount: Number(t.amount),
        status: t.status,
      }));

      setTransactions(formattedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTotalMembers = async () => {
    try {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      if (!error && count !== null) {
        setTotalMembers(count);
      }
    } catch (error) {
      console.error("Error fetching members count:", error);
    }
  };

  // Calculate Dynamic Stats from fetched data
  const totalSimpanan = transactions
    .filter((t) => t.type === "simpanan")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPinjaman = transactions
    .filter((t) => t.type === "pinjaman")
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0); // Amount is negative in TRX

  // Asset calculation is simplified for now
  const totalAssets = totalSimpanan - totalPinjaman;

  const handleDownloadPDF = () => {
    alert(
      `Mengunduh Laporan PDF periode ${months[selectedMonth]} ${selectedYear}...`
    );
  };

  const handleExportExcel = () => {
    alert(
      `Mengekspor data ke Excel periode ${months[selectedMonth]} ${selectedYear}...`
    );
  };

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
          <p className="text-gray-600">
            Ringkasan kinerja dan mutasi keuangan koperasi
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="bg-white border border-gray-300 rounded-lg px-2 py-1 flex items-center gap-2 shadow-sm">
            <FaCalendarAlt className="text-gray-400 ml-2" />
            <select
              className="bg-transparent border-none text-sm font-medium text-gray-600 focus:ring-0 cursor-pointer outline-none"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <select
              className="bg-transparent border-none text-sm font-medium text-gray-600 focus:ring-0 cursor-pointer outline-none border-l pl-2"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <FaFilePdf />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <FaFileExcel />
            <span className="hidden sm:inline">Excel</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Aset (Estimasi)"
          value={formatter.format(totalAssets)}
          icon={<FaChartLine size={24} />}
          color="bg-purple-100 text-purple-600"
          trend="+-"
          trendUp={true}
        />
        <StatsCard
          title="Mutasi Simpanan"
          value={formatter.format(totalSimpanan)}
          icon={<FaPiggyBank size={24} />}
          color="bg-blue-100 text-blue-600"
          trend="Bulan ini"
          trendUp={true}
        />
        <StatsCard
          title="Mutasi Pinjaman"
          value={formatter.format(totalPinjaman)}
          icon={<FaMoneyBillWave size={24} />}
          color="bg-orange-100 text-orange-600"
          trend="Bulan ini"
          trendUp={false}
        />
        <StatsCard
          title="Anggota Aktif"
          value={totalMembers.toString()}
          icon={<FaUsers size={24} />}
          color="bg-green-100 text-green-600"
          trend="Total"
          trendUp={true}
        />
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            Mutasi Transaksi - {months[selectedMonth]} {selectedYear}
          </h2>
        </div>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            Memuat data...
          </div>
        ) : transactions.length > 0 ? (
          <MutationTable data={transactions} limit={10} />
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            Tidak ada transaksi pada periode ini.
          </div>
        )}
      </div>
    </div>
  );
}

// Inline Component for Stats Card
function StatsCard({
  title,
  value,
  icon,
  color,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-105 duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}
        >
          {trend}
        </span>
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}
