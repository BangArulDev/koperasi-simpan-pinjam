"use client";
import { FormEvent } from "react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";

export default function Contact() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Terima kasih! Admin kami akan segera menghubungi Anda.");
  };

  return (
    <section id="kontak" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Bergabung Menjadi Anggota
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Dapatkan akses ke layanan keuangan yang mudah dan transparan.
              Syarat mudah hanya dengan KTP dan setoran awal.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                    <FaMapMarkerAlt />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Kantor Pusat
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Jl. Koperasi No. 123, Jakarta Selatan
                    <br />
                    DKI Jakarta, 12000
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                    <FaPhone />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Hubungi Kami
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    (021) 555-0123 <br />
                    support@kspsejahtera.id
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Form */}
          <div className="mt-10 lg:mt-0 bg-white shadow-xl rounded-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pesan / Pertanyaan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Kirim Pesan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
