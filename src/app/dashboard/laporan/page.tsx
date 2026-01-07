"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import {
  FaFileDownload,
  FaCalendarAlt,
  FaFilePdf,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

export default function LaporanPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [period, setPeriod] = useState("2024-09");
  const [type, setType] = useState("all");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDownloading(true);
    setDownloadSuccess(false);

    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 3000);
    }, 1500);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaFileDownload className="text-blue-600" /> Unduh Laporan
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Unduh laporan mutasi dan aktivitas rekening Anda dalam format PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form Card */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Buat Laporan Baru
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleDownload} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Periode Laporan
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaCalendarAlt />
                    </span>
                    <input
                      type="month"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Laporan
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setType("all")}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
                        type === "all"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Semua Mutasi
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("savings")}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
                        type === "savings"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Simpanan
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("loans")}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
                        type === "loans"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Pinjaman
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isDownloading}
                    className={`w-full py-3 rounded-xl font-bold text-lg shadow-sm flex justify-center items-center gap-2 transition ${
                      isDownloading
                        ? "bg-blue-400 text-white cursor-not-allowed"
                        : "bg-blue-700 text-white hover:bg-blue-800"
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <FaSpinner className="animate-spin" /> Memproses...
                      </>
                    ) : (
                      <>
                        <FaFilePdf /> Unduh Laporan (PDF)
                      </>
                    )}
                  </button>
                </div>

                {downloadSuccess && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 text-sm">
                    <FaCheckCircle />
                    Laporan berhasil diunduh. Silakan cek folder download Anda.
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Recent Reports / Info Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h4 className="font-bold text-blue-900 mb-2">
                Informasi Laporan
              </h4>
              <p className="text-sm text-blue-800 mb-4">
                Laporan keuangan dapat digunakan untuk:
              </p>
              <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
                <li>Syarat pengajuan pinjaman</li>
                <li>Bukti keuangan pribadi</li>
                <li>Pencatatan kas tahunan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
