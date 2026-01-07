"use client";

import { FaCheck, FaTimes, FaUser } from "react-icons/fa";

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm font-medium">Total Aset</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">Rp 2.5 M</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-medium">Anggota Aktif</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">1,240</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm font-medium">Pinjaman Cair</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">Rp 850 Jt</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <p className="text-gray-500 text-sm font-medium">NPL (Macet)</p>
          <h2 className="text-2xl font-bold text-red-600 mt-1">2.1%</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Verifikasi Anggota Baru
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded">
              2 Pending
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <FaUser />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Siti Aminah</h4>
                  <p className="text-xs text-gray-500">Daftar: 2 Jam lalu</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-green-600 hover:text-green-800 p-2">
                  <FaCheck />
                </button>
                <button className="text-red-600 hover:text-red-800 p-2">
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <FaUser />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Rudi Hartono</h4>
                  <p className="text-xs text-gray-500">Daftar: 5 Jam lalu</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-green-600 hover:text-green-800 p-2">
                  <FaCheck />
                </button>
                <button className="text-red-600 hover:text-red-800 p-2">
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Approval Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Pengajuan Pinjaman Masuk
            </h3>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded">
              1 Pending
            </span>
          </div>

          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">
                  Pak Bambang (Anggota #089)
                </h4>
                <p className="text-sm text-gray-500">Pinjaman Usaha Mikro</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600 font-bold">Rp</p>
                <p className="text-xl font-bold text-blue-700">10.000.000</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-gray-500">Tenor:</p>
                <p className="font-semibold text-gray-900">12 Bulan</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Simpanan Saat Ini:</p>
                <p className="font-semibold text-green-600">Rp 5.500.000</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Setujui
              </button>
              <button className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                Tolak
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
