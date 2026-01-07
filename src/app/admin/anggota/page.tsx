"use client";

import { useState } from "react";
import {
  FaSearch,
  FaUserCheck,
  FaUserTimes,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

// Mock Data
interface Member {
  id: number;
  name: string;
  email: string;
  memberId: string;
  joinDate: string;
  status: string;
  phone: string;
}

const MOCK_MEMBERS: Member[] = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@example.com",
    memberId: "KSP-2022-0012",
    joinDate: "2022-01-15",
    status: "active",
    phone: "081234567890",
  },
  {
    id: 2,
    name: "Siti Aminah",
    email: "siti.aminah@example.com",
    memberId: "-",
    joinDate: "2024-01-07",
    status: "pending",
    phone: "081298765432",
  },
  {
    id: 3,
    name: "Rudi Hartono",
    email: "rudi.h@example.com",
    memberId: "-",
    joinDate: "2024-01-07",
    status: "pending",
    phone: "085678901234",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi@example.com",
    memberId: "KSP-2023-0550",
    joinDate: "2023-05-20",
    status: "active",
    phone: "081345678901",
  },
  {
    id: 5,
    name: "Ahmad Dahlan",
    email: "ahmad@example.com",
    memberId: "KSP-2021-0005",
    joinDate: "2021-03-10",
    status: "inactive",
    phone: "081987654321",
  },
];

export default function AdminAnggotaPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "pending">("all");
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ? true : member.status === "pending";
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: number) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "active", memberId: `KSP-2024-${1000 + id}` }
          : m
      )
    );
  };

  const handleDelete = (id: number) => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus anggota ini? Tindakan ini tidak dapat dibatalkan."
      )
    ) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleEditClick = (member: Member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
    });
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", phone: "" });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      // Update existing member
      setMembers((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, ...formData } : m))
      );
      alert("Data anggota berhasil diperbarui!");
    } else {
      // Create new member
      const id =
        members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;
      const newMemberObj: Member = {
        id,
        ...formData,
        memberId: `KSP-2024-${1000 + id}`,
        joinDate: new Date().toISOString().split("T")[0],
        status: "active",
      };
      setMembers([newMemberObj, ...members]);
      alert("Anggota berhasil ditambahkan!");
    }

    setIsModalOpen(false);
    setFormData({ name: "", email: "", phone: "" });
    setEditingId(null);
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
        <div className="flex gap-3">
          <button
            onClick={handleCreateClick}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 shadow-sm"
          >
            + Tambah Anggota
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">
            Total Anggota
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {members.length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">
            Anggota Aktif
          </div>
          <div className="text-2xl font-bold text-green-600">
            {members.filter((m) => m.status === "active").length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">
            Menunggu Verifikasi
          </div>
          <div className="text-2xl font-bold text-orange-500">
            {members.filter((m) => m.status === "pending").length}
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
              placeholder="Cari nama atau email..."
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
                  Tanggal Daftar
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
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.email}
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
                    {member.joinDate}
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
                          onClick={() => handleApprove(member.id)}
                          className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded hover:bg-green-100 transition"
                          title="Setujui"
                        >
                          <FaUserCheck />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)} // Reject is effectively a delete from pending
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
              ))}
            </tbody>
          </table>
          {filteredMembers.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Tidak ada data anggota ditemukan.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Anggota" : "Tambah Anggota Baru"}
              </h3>
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
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
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
                    {editingId ? "Simpan Perubahan" : "Simpan"}
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
