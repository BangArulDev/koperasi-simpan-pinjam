"use client";

import { useState } from "react";
import { FaCalculator } from "react-icons/fa";

export default function LoanCalculator() {
  const [amount, setAmount] = useState(5000000);
  const [term, setTerm] = useState(12);
  const [interestRate, setInterestRate] = useState(1.5); // Default 1.5%
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterestDisplay, setTotalInterestDisplay] = useState(0);

  // Formatter
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const calculateLoan = () => {
    if (isNaN(amount) || amount <= 0)
      return alert("Mohon masukkan jumlah valid");

    const rateDecimal = interestRate / 100;
    const totalInterest = amount * rateDecimal * term;
    const totalPayment = amount + totalInterest;
    const payment = totalPayment / term;

    setMonthlyPayment(payment);
    setTotalInterestDisplay(totalInterest);
  };

  return (
    <section id="simulasi" className="py-20 bg-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg data-[state=open]:animate-in fade-in-0 zoom-in-95 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <FaCalculator className="mr-3" /> Simulasi Angsuran Pinjaman
            </h3>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah Pinjaman (Rp)
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">Rp</span>
                    </div>
                    <input
                      type="number"
                      className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 py-3 border"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="5000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jangka Waktu (Bulan)
                  </label>
                  <select
                    className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-3 border px-3"
                    value={term}
                    onChange={(e) => setTerm(Number(e.target.value))}
                  >
                    <option value="6">6 Bulan</option>
                    <option value="12">12 Bulan</option>
                    <option value="24">24 Bulan</option>
                    <option value="36">36 Bulan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bunga (Flat/Bulan)
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 py-3 border px-3 text-gray-500"
                      value={`${interestRate}%`}
                      readOnly
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    *Bunga hanyalah estimasi
                  </p>
                </div>

                <button
                  onClick={calculateLoan}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Hitung Angsuran
                </button>
              </div>

              {/* Result Section */}
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 flex flex-col justify-center">
                <div className="text-center mb-8">
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                    ESTIMASI ANGSURAN PER BULAN
                  </p>
                  <h2 className="text-4xl font-extrabold text-blue-600">
                    {monthlyPayment > 0
                      ? formatter.format(monthlyPayment)
                      : "Rp 0"}
                  </h2>
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Pokok Pinjaman:</span>
                    <span className="font-semibold text-gray-900">
                      {formatter.format(amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total Bunga:</span>
                    <span className="font-semibold text-gray-900">
                      {formatter.format(totalInterestDisplay)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
