"use client";

import { useState, useEffect } from "react";
import { FaCalculator } from "react-icons/fa";

export default function LoanCalculator() {
  const [amount, setAmount] = useState(5000000);
  const [term, setTerm] = useState(12);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Constants
  const interestRate = 0.015; // 1.5% per month Flat

  useEffect(() => {
    if (amount <= 0 || isNaN(amount)) return;

    // Logic: (Principal + (Principal * Rate * Months)) / Months
    const totalInterestVal = amount * interestRate * term;
    const totalPayment = amount + totalInterestVal;

    setMonthlyPayment(totalPayment / term);
    setTotalInterest(totalInterestVal);
  }, [amount, term]);

  // Formatter
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return (
    <section id="simulasi" className="py-20 bg-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-700 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <FaCalculator className="mr-3" /> Simulasi Angsuran Pinjaman
            </h3>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="loanAmount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Jumlah Pinjaman (Rp)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">Rp</span>
                    </div>
                    <input
                      type="number"
                      id="loanAmount"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md py-3 border"
                      placeholder="10000000"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="loanTerm"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Jangka Waktu (Bulan)
                  </label>
                  <select
                    id="loanTerm"
                    className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                    value={term}
                    onChange={(e) => setTerm(Number(e.target.value))}
                  >
                    <option value="3">3 Bulan</option>
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
                  <div className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-600">
                    1.5%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    *Bunga hanyalah estimasi
                  </p>
                </div>

                {/* Button removed because logic is reactive now */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300">
                  Hitung Angsuran
                </button>
              </div>

              {/* Result Display */}
              <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center items-center text-center border border-gray-200">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
                  Estimasi Angsuran Per Bulan
                </p>
                <h2 className="text-4xl font-extrabold text-blue-700 mb-2">
                  {formatter.format(monthlyPayment)}
                </h2>

                <div className="w-full border-t border-gray-200 my-4"></div>

                <div className="w-full flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Pokok Pinjaman:</span>
                  <span className="font-semibold text-gray-900">
                    {formatter.format(amount)}
                  </span>
                </div>
                <div className="w-full flex justify-between text-sm">
                  <span className="text-gray-500">Total Bunga:</span>
                  <span className="font-semibold text-gray-900">
                    {formatter.format(totalInterest)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
