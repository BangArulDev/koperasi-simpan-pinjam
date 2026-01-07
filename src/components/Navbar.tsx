"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHandHoldingUsd, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsOpen(false); // Close mobile menu if open
  };

  return (
    <>
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-blue-700 text-2xl font-bold flex items-center gap-2 cursor-pointer"
              >
                <FaHandHoldingUsd /> KSP Sejahtera
              </Link>
            </div>

            {/* Desktop Menu */}
            <div
              className="hidden md:flex items-center space-x-8"
              id="nav-desktop"
            >
              {user ? (
                // Logged In Menu
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-blue-700 font-medium transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-blue-700 font-medium transition"
                  >
                    Mutasi
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-blue-700 font-medium transition"
                  >
                    Pengaturan
                  </Link>
                  <button
                    onClick={logout}
                    className="text-red-600 hover:text-red-800 font-medium transition flex items-center gap-1"
                  >
                    Keluar <FaSignOutAlt className="ml-1" />
                  </button>
                </>
              ) : (
                // Public Menu
                <>
                  <Link
                    href="/#beranda"
                    className="text-gray-600 hover:text-blue-700 font-medium transition"
                  >
                    Beranda
                  </Link>
                  <Link
                    href="/#layanan"
                    className="text-gray-600 hover:text-blue-700 font-medium transition"
                  >
                    Layanan
                  </Link>
                  <Link
                    href="/#simulasi"
                    className="text-gray-600 hover:text-blue-700 font-medium transition"
                  >
                    Simulasi
                  </Link>
                  <Link
                    href="/#kontak"
                    className="text-gray-600 hover:text-blue-700 font-medium transition"
                  >
                    Kontak
                  </Link>
                  <button
                    onClick={() => openAuthModal("login")}
                    className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition shadow"
                  >
                    Masuk / Daftar
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
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
            isOpen
              ? "max-h-80 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div id="nav-mobile-items">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 px-4 text-sm hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="block py-2 px-4 text-sm hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Mutasi
                </Link>
                <Link
                  href="#"
                  className="block py-2 px-4 text-sm hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Pengaturan
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-2 px-4 text-sm text-red-600 hover:bg-gray-100 font-bold"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/#beranda"
                  className="block py-2 px-4 text-sm hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Beranda
                </Link>
                <Link
                  href="/#layanan"
                  className="block py-2 px-4 text-sm hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Layanan
                </Link>
                <Link
                  href="/#simulasi"
                  className="block py-2 px-4 text-sm hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Simulasi
                </Link>
                <Link
                  href="/#kontak"
                  className="block py-2 px-4 text-sm hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Kontak
                </Link>
                <button
                  onClick={() => openAuthModal("login")}
                  className="block w-full text-left py-2 px-4 text-sm text-blue-700 font-bold hover:bg-gray-100"
                >
                  Masuk / Daftar
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
