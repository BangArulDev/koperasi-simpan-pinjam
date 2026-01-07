"use client";

import { useState } from "react";
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

// Mock Data for specific report view (if needed different from MutationTable default)
// Mock Data for specific report view (if needed different from MutationTable default)
const REPORT_TRANSACTIONS: Transaction[] = [
  {
    id: "TRX-101",
    date: "07 Jan 2026",
    description: "Setoran Simpanan Wajib - Budi Santoso",
    type: "simpanan",
    amount: 50000,
    status: "berhasil",
  },
  {
    id: "TRX-102",
    date: "06 Jan 2026",
    description: "Pembayaran Pinjaman - Siti Aminah",
    type: "pembayaran",
    amount: 363333,
    status: "berhasil",
  },
  {
    id: "TRX-103",
    date: "05 Jan 2026",
    description: "Pencairan Pinjaman - Rudi Hartono",
    type: "pinjaman",
    amount: -10000000,
    status: "berhasil",
  },
  {
    id: "TRX-104",
    date: "04 Jan 2026",
    description: "Bagi Hasil SHU 2025",
    type: "simpanan",
    amount: 1500000,
    status: "berhasil",
  },
  {
    id: "TRX-105",
    date: "02 Jan 2026",
    description: "Biaya Administrasi Bulanan",
    type: "penarikan",
    amount: -250000,
    status: "berhasil",
  },
  {
    id: "TRX-106",
    date: "15 Feb 2026",
    description: "Setoran Simpanan Wajib - Ani",
    type: "simpanan",
    amount: 50000,
    status: "berhasil",
  },
  {
    id: "TRX-107",
    date: "10 Feb 2026",
    description: "Pinjaman Mikro - Joko",
    type: "pinjaman",
    amount: -2000000,
    status: "pending",
  },
];

export default function AdminLaporanPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  // Helper to parse "DD Mon YYYY"
  const parseDate = (dateStr: string) => {
    const parts = dateStr.split(" ");
    const day = parseInt(parts[0]);
    const monthStr = parts[1];
    const year = parseInt(parts[2]);

    // Simple mapping for Indonesian months to index
    const monthMap: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      Mei: 4,
      Jun: 5,
      Jul: 6,
      Agt: 7,
      Sep: 8,
      Okt: 9,
      Nov: 10,
      Des: 11,
    };

    return new Date(year, monthMap[monthStr], day);
  };

  // Filter Transactions
  const filteredTransactions = REPORT_TRANSACTIONS.filter((trx) => {
    const trxDate = parseDate(trx.date);
    return (
      trxDate.getMonth() === selectedMonth &&
      trxDate.getFullYear() === selectedYear
    );
  });

  // Calculate Dynamic Stats
  const totalSimpanan = filteredTransactions
    .filter((t) => t.type === "simpanan")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPinjaman = filteredTransactions
    .filter((t) => t.type === "pinjaman")
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0); // Amount is negative in TRX

  const totalMembersActive = 120 + filteredTransactions.length; // Mock variation
  const totalAssets = 150000000 + totalSimpanan - totalPinjaman; // Mock calculation

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
          trend="+12%"
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
          value={totalMembersActive.toString()}
          icon={<FaUsers size={24} />}
          color="bg-green-100 text-green-600"
          trend="+-"
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
        {filteredTransactions.length > 0 ? (
          <MutationTable data={filteredTransactions} limit={10} />
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
