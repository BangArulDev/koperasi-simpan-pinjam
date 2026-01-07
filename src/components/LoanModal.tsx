"use client";

import { useState, useEffect, useMemo } from "react";
import { Loan, Profile } from "@/types";
import { FaTimes, FaCalculator, FaSave } from "react-icons/fa";

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (loanData: Omit<Loan, "id" | "status" | "remainingAmount">) => void;
  initialData?: Loan | null;
  members: Profile[]; // Pass real members
}

export default function LoanModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  members,
}: LoanModalProps) {
  const [memberId, setMemberId] = useState<string>("");
  const [amount, setAmount] = useState<number>(5000000);
  const [term, setTerm] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(1.5); // 1.5% flat/month
  const [startDate, setStartDate] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setMemberId(initialData.memberId);
        setAmount(initialData.amount);
        setTerm(initialData.term);
        setInterestRate(initialData.interestRate);
        setStartDate(initialData.startDate);
      } else {
        // Reset defaults for new loan
        setMemberId("");
        setAmount(5000000);
        setTerm(12);
        setInterestRate(1.5);
        setStartDate(new Date().toISOString().split("T")[0]);
      }
    }
  }, [isOpen, initialData]);

  // Derived state (no useEffect needed)
  const { monthlyPayment, totalPayment } = useMemo(() => {
    const rateDecimal = interestRate / 100;
    const totalInterest = amount * rateDecimal * term;
    const total = amount + totalInterest;
    const monthly = total / term;
    return { monthlyPayment: monthly, totalPayment: total };
  }, [amount, term, interestRate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (memberId === "") {
      alert("Silakan pilih anggota");
      return;
    }

    const selectedMember = members.find((m) => m.id === memberId);
    if (!selectedMember) {
      alert("Data anggota tidak ditemukan");
      return;
    }

    onSubmit({
      memberId: memberId,
      memberName: selectedMember.fullName,
      amount,
      term,
      interestRate,
      startDate,
      monthlyPayment,
      totalPayment,
    });
    onClose();
  };

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Center alignment spacer */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal Panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full relative z-10">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {initialData ? "Edit Data Pinjaman" : "Ajukan Pinjaman Baru"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                type="button"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Member Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anggota
                </label>
                <select
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  disabled={!!initialData}
                >
                  <option value="">Pilih Anggota</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} - {m.memberId}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Pinjaman (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="100000"
                  step="50000"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>

              {/* Term & Interest */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jangka Waktu (Bulan)
                  </label>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={term}
                    onChange={(e) => setTerm(Number(e.target.value))}
                  >
                    <option value={6}>6 Bulan</option>
                    <option value={12}>12 Bulan</option>
                    <option value={24}>24 Bulan</option>
                    <option value={36}>36 Bulan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bunga (% Flat/Bln)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    readOnly
                    className="block w-full rounded-md border-gray-300 bg-gray-50 text-gray-500 p-2 border"
                    value={interestRate}
                  />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* Simulation Result */}
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center">
                  <FaCalculator className="mr-2" />
                  Simulasi Angsuran
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Angsuran per Bulan:</span>
                    <span className="font-bold text-blue-700">
                      {formatter.format(monthlyPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Pengembalian:</span>
                    <span className="font-bold text-gray-800">
                      {formatter.format(totalPayment)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                >
                  <FaSave className="mr-2 mt-0.5" />
                  Simpan Pinjaman
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={onClose}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
