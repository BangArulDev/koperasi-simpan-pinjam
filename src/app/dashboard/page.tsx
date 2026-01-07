"use client";

import { useEffect } from "react";
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

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Halo, {user.name}
            </h1>
            <p className="text-gray-600 text-sm">
              No. Anggota: KSP-2024-0012 | Aktif sejak 2022
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button className="bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 shadow-sm flex items-center gap-2">
              <FaDownload /> Laporan
            </button>
            <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 shadow-sm flex items-center gap-2">
              <FaPlus /> Ajukan Pinjaman
            </button>
          </div>
        </div>

        {/* Dashboard Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card Saldo */}
          <div className="bg-linier-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <FaWallet className="text-8xl" />
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">
              Total Simpanan Anda
            </p>
            <h2 className="text-3xl font-bold mb-4">Rp 12.500.000</h2>
            <div className="space-y-2 text-sm text-blue-100 border-t border-blue-500 pt-3">
              <div className="flex justify-between">
                <span>Simpanan Pokok</span>
                <span className="font-semibold">Rp 500.000</span>
              </div>
              <div className="flex justify-between">
                <span>Simpanan Wajib</span>
                <span className="font-semibold">Rp 2.000.000</span>
              </div>
              <div className="flex justify-between">
                <span>Simpanan Sukarela</span>
                <span className="font-semibold">Rp 10.000.000</span>
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
                  Rp 4.200.000
                </h2>
                <p className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1">
                  <FaExclamationCircle /> Jatuh tempo: 25 Okt 2024
                </p>
              </div>
              <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                <FaMoneyBillWave className="text-xl" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress Pelunasan</span>
                <span>58%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-orange-500 h-2.5 rounded-full"
                  style={{ width: "58%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Angsuran ke-7 dari 12 bulan
              </p>
              <button className="mt-4 w-full border border-gray-300 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-50">
                Lihat Detail
              </button>
            </div>
          </div>

          {/* Card SHU / Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Estimasi SHU Tahun Ini
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Rp 850.000
                </h2>
                <p className="text-xs text-green-600 mt-1 font-semibold flex items-center gap-1">
                  <FaArrowUp /> Naik 5% dari tahun lalu
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
                Rapat Anggota Tahunan (RAT) akan dilaksanakan pada tanggal 15
                Januari 2025.
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Mutasi Terakhir</h3>
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Lihat Semua
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keterangan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    25 Sep 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Setoran Simpanan Wajib
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Simpanan
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">
                    + Rp 50.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Berhasil
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    20 Sep 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Pembayaran Angsuran #6
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Pinjaman
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">
                    - Rp 625.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Berhasil
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    10 Sep 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Penarikan Simpanan Sukarela
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Penarikan
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">
                    - Rp 200.000
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Berhasil
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
