"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import {
  FaMoneyBillWave,
  FaCalculator,
  FaInfoCircle,
  FaPaperPlane,
} from "react-icons/fa";

export default function AjukanPinjamanPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [amount, setAmount] = useState<number>(0);
  const [tenor, setTenor] = useState<number>(12);
  const [purpose, setPurpose] = useState("");

  // Constants
  const INTEREST_RATE_PER_MONTH = 0.015; // 1.5%

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Calculations
  const principalPerMonth = amount / tenor;
  const interestPerMonth = amount * INTEREST_RATE_PER_MONTH;
  const totalPerMonth = principalPerMonth + interestPerMonth;
  const totalPayment = totalPerMonth * tenor;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaMoneyBillWave className="text-blue-600" /> Ajukan Pinjaman
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Isi formulir di bawah ini untuk mengajukan pinjaman baru.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Pinjaman (Rp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={amount || ""}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="Contoh: 5000000"
                      className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Maksimal pinjaman: Rp 25.000.000
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jangka Waktu (Tenor)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {[3, 6, 12, 18, 24].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTenor(t)}
                        className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
                          tenor === t
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {t} Bulan
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keperluan Pinjaman
                  </label>
                  <textarea
                    rows={4}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Jelaskan penggunaan dana pinjaman..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-800 transition shadow-lg flex justify-center items-center gap-2"
                  >
                    <FaPaperPlane /> Kirim Pengajuan
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Simulation Section */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4 text-blue-800">
                <FaCalculator className="text-xl" />
                <h3 className="text-lg font-bold">Simulasi Angsuran</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Angsuran Pokok</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(principalPerMonth)} / bln
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">
                    Jasa / Bunga (1.5%)
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(interestPerMonth)} / bln
                  </p>
                </div>

                <div className="border-t border-blue-200 pt-4 mt-4">
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    Total Angsuran per Bulan
                  </p>
                  <p className="text-3xl font-bold text-blue-700">
                    {formatCurrency(totalPerMonth)}
                  </p>
                </div>

                <div className="text-xs text-blue-600 flex items-start gap-2 mt-2 bg-blue-100 p-3 rounded-lg">
                  <FaInfoCircle className="text-lg mt-0.5 shrink-0" />
                  <p>
                    Estimasi ini belum termasuk biaya administrasi 1% yang akan
                    dipotong saat pencairan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
