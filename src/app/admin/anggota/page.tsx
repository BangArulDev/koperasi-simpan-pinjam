"use client";

import { useEffect, useState } from "react";
import {
  FaSearch,
  FaUserCheck,
  FaUserTimes,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types";

export default function AdminAnggotaPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "pending">("all");
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map snake_case to camelCase (Profile type uses camelCase)
      const mappedMembers: Profile[] = (data || []).map((m: any) => ({
        id: m.id,
        memberId: m.member_id,
        fullName: m.full_name,
        phone: m.phone,
        address: m.address,
        status: m.status,
      }));

      setMembers(mappedMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      member.memberId?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ? true : member.status === "pending";
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (id: string, currentMemberId: string) => {
    // Generate member ID if not exists or placeholder
    // Assuming member_id is already set by trigger or we can set it here if needed.
    // The trigger 'handle_new_user' sets a basic member_id.
    // We update status to active.

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "active" })
        .eq("id", id);

      if (error) throw error;

      alert("Anggota berhasil diverifikasi!");
      fetchMembers();
    } catch (error) {
      console.error("Error approving member:", error);
      alert("Gagal memverifikasi anggota.");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus anggota ini? Tindakan ini tidak dapat dibatalkan (Data Auth User mungkin masih tersisa)."
      )
    ) {
      try {
        const { error } = await supabase.from("profiles").delete().eq("id", id);

        if (error) throw error;

        setMembers((prev) => prev.filter((m) => m.id !== id));
        alert("Data profil anggota berhasil dihapus!");
      } catch (error) {
        console.error("Error deleting member:", error);
        alert("Gagal menghapus anggota.");
      }
    }
  };

  const handleEditClick = (member: Profile) => {
    setEditingMember(member);
    setFormData({
      fullName: member.fullName,
      phone: member.phone || "",
      address: member.address || "",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMember) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: formData.fullName,
            phone: formData.phone,
            address: formData.address,
          })
          .eq("id", editingMember.id);

        if (error) throw error;

        alert("Data anggota berhasil diperbarui!");
        fetchMembers();
        setIsModalOpen(false);
        setEditingMember(null);
      } catch (error) {
        console.error("Error updating member:", error);
        alert("Gagal memperbarui data anggota.");
      }
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manajemen Anggota
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Total {members.length} anggota terdaftar
          </p>
        </div>
        {/* 'Tambah Anggota' button removed as it requires Admin API for Auth creation */}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">
            Total Anggota
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {isLoading ? "..." : members.length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">
            Anggota Aktif
          </div>
          <div className="text-2xl font-bold text-green-600">
            {isLoading
              ? "..."
              : members.filter((m) => m.status === "active").length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">
            Menunggu Verifikasi
          </div>
          <div className="text-2xl font-bold text-orange-500">
            {isLoading
              ? "..."
              : members.filter((m) => m.status === "pending").length}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                filterStatus === "all"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                filterStatus === "pending"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Menunggu Verifikasi
            </button>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari nama atau ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Anggota
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID Anggota
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kontak
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Memuat data anggota...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Tidak ada data anggota ditemukan.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                          {member.fullName ? member.fullName.charAt(0) : "?"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.fullName}
                          </div>
                          <div
                            className="text-sm text-gray-500 truncate max-w-[150px]"
                            title={member.address}
                          >
                            {member.address || "-"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 font-mono">
                        {member.memberId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === "active"
                            ? "bg-green-100 text-green-800"
                            : member.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.status === "active"
                          ? "Aktif"
                          : member.status === "pending"
                          ? "Menunggu"
                          : "Non-Aktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {member.status === "pending" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleApprove(member.id, member.memberId)
                            }
                            className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded hover:bg-green-100 transition"
                            title="Setujui"
                          >
                            <FaUserCheck />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded hover:bg-red-100 transition"
                            title="Tolak"
                          >
                            <FaUserTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(member)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded hover:bg-blue-100 transition"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded hover:bg-red-100 transition"
                            title="Hapus"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Edit Anggota</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
