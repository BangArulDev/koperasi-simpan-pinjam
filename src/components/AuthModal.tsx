"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  initialMode: "login" | "register";
  onClose: () => void;
}

export default function AuthModal({
  isOpen,
  initialMode,
  onClose,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const { login, register, profile } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setShow(true), 10);
      document.body.classList.add("modal-active");
      document.body.style.overflow = "hidden";
    } else {
      setShow(false);
      document.body.classList.remove("modal-active");
      document.body.style.overflow = "auto";
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  /* State for inputs */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register specific fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await login(email, password);
      if (error) throw error;

      // Check role directly from Supabase to ensure immediate correct redirection
      // Note: We can't rely on 'profile' from context immediately as it might not have updated yet
      // So we fetch it here manually or rely on a helper.
      // Ideally AuthContext should return the profile on login, but for now we fetch it.

      // Get current user to fetch profile
      // Note: login() uses supabase.auth.signInWithPassword which updates the session.
      // We can get the user id from the session.
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/dashboard");
      }

      onClose();
    } catch (error: any) {
      alert("Login gagal: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await register(
        email,
        password,
        fullName,
        phone,
        address
      );
      if (error) throw error;

      alert(
        "Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi (jika diaktifkan) atau langsung login."
      );
      setMode("login");
    } catch (error: any) {
      alert("Pendaftaran gagal: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-0 transition-opacity duration-300 ease-in-out ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div
        className={`relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all duration-300 ease-in-out sm:my-8 sm:w-full sm:max-w-md w-full ${
          show ? "scale-100" : "scale-95"
        }`}
      >
        <div className="relative py-8 px-5 md:px-10">
          <div className="absolute top-0 right-0 mt-4 mr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl focus:outline-none"
            >
              &times;
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                mode === "login"
                  ? "text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setMode("login")}
            >
              Masuk
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                mode === "register"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setMode("register")}
            >
              Daftar
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "login"
                ? "Selamat Datang Kembali"
                : "Bergabung Sekarang"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === "login"
                ? "Masuk untuk mengakses layanan simpan pinjam."
                : "Daftar untuk menjadi anggota KSP Sejahtera."}
            </p>
          </div>

          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="nama@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </button>
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">
                  Belum punya akun?{" "}
                </span>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-sm text-blue-700 font-bold hover:underline focus:outline-none"
                >
                  Daftar disini
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nama Lengkap (Sesuai KTP)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alamat Lengkap
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? "Mendaftar..." : "Daftar Anggota"}
              </button>
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">
                  Sudah jadi anggota?{" "}
                </span>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-sm text-blue-700 font-bold hover:underline focus:outline-none"
                >
                  Login disini
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
