"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHandHoldingUsd, FaBars } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-blue-700 text-2xl font-bold flex items-center gap-2">
              <FaHandHoldingUsd /> KSP Sejahtera
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#beranda"
              className="text-gray-600 hover:text-blue-700 font-medium transition"
            >
              Beranda
            </Link>
            <Link
              href="#layanan"
              className="text-gray-600 hover:text-blue-700 font-medium transition"
            >
              Layanan
            </Link>
            <Link
              href="#simulasi"
              className="text-gray-600 hover:text-blue-700 font-medium transition"
            >
              Simulasi
            </Link>
            <Link
              href="#kontak"
              className="text-gray-600 hover:text-blue-700 font-medium transition"
            >
              Kontak
            </Link>
            <Link
              href="#daftar"
              className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition shadow"
            >
              Daftar Anggota
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-700 focus:outline-none"
            >
              <FaBars className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <Link
          href="#beranda"
          className="block py-2 px-4 text-sm hover:bg-gray-100"
          onClick={() => setIsOpen(false)}
        >
          Beranda
        </Link>
        <Link
          href="#layanan"
          className="block py-2 px-4 text-sm hover:bg-gray-100"
          onClick={() => setIsOpen(false)}
        >
          Layanan
        </Link>
        <Link
          href="#simulasi"
          className="block py-2 px-4 text-sm hover:bg-gray-100"
          onClick={() => setIsOpen(false)}
        >
          Simulasi Kredit
        </Link>
        <Link
          href="#kontak"
          className="block py-2 px-4 text-sm hover:bg-gray-100"
          onClick={() => setIsOpen(false)}
        >
          Kontak
        </Link>
        <Link
          href="#daftar"
          className="block py-2 px-4 text-sm text-blue-700 font-bold hover:bg-gray-100"
          onClick={() => setIsOpen(false)}
        >
          Daftar Sekarang
        </Link>
      </div>
    </nav>
  );
}
