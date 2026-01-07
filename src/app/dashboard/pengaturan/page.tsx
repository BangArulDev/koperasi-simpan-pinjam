"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { FaUserCog, FaSave, FaLock, FaUser } from "react-icons/fa";
import { supabase } from "@/lib/supabase";

export default function PengaturanPage() {
  const { user, profile, isAuthenticated, isLoading, refreshProfile } =
    useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/");
    } else if (profile) {
      setFormData({
        name: profile.full_name || "",
        email: user?.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [isAuthenticated, isLoading, router, user, profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.name,
          phone: formData.phone,
          address: formData.address,
        })
        .eq("id", user.id);

      if (error) throw error;

      if (refreshProfile) {
        await refreshProfile();
      }

      alert("Profil berhasil diperbarui!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil: " + error.message);
    } finally {
      setIsSaving(false);
    }
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
            <FaUserCog className="text-blue-600" /> Pengaturan Akun
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Kelola informasi profil dan keamanan akun Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <FaUser className="text-gray-400" />
              <h3 className="text-lg font-bold text-gray-900">
                Informasi Profil
              </h3>
            </div>
            <div className="p-6">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProfile();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="08xxxxxxxxxx"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Masukkan alamat lengkap..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 shadow-sm flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSaving ? (
                      "Menyimpan..."
                    ) : (
                      <>
                        <FaSave /> Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Security Section (UI Only for MVP/User Request scope) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <FaLock className="text-gray-400" />
              <h3 className="text-lg font-bold text-gray-900">Keamanan</h3>
            </div>
            <div className="p-6">
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm mb-4">
                Fitur ubah password saat ini dinonaktifkan sementara. Silakan
                hubungi admin jika lupa password.
              </div>
              <form className="space-y-4 opacity-50 pointer-events-none">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password Saat Ini
                    </label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      disabled
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    className="bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 cursor-not-allowed"
                    disabled
                  >
                    Ubah Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
