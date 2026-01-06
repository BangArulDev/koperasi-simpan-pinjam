import Link from "next/link";
import { FaChartLine, FaUsers } from "react-icons/fa";

export default function Hero() {
  return (
    <section
      id="beranda"
      className="relative bg-blue-700 pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
    >
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Office"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Solusi Keuangan</span>
            <span className="block text-blue-200">Untuk Masa Depan</span>
          </h1>
          <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            Bersama KSP Sejahtera, wujudkan impian finansial Anda dengan sistem
            yang transparan, aman, dan menguntungkan bagi semua anggota.
          </p>
          <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
            <div className="rounded-md shadow">
              <Link
                href="#daftar"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Gabung Anggota
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                href="#layanan"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 md:py-4 md:text-lg md:px-10"
              >
                Pelajari Produk
              </Link>
            </div>
          </div>
        </div>
        {/* Floating Cards Info */}
        <div className="hidden lg:block lg:w-1/2 relative mt-10 lg:mt-0">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm ml-auto transform rotate-3 hover:rotate-0 transition duration-500">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <FaChartLine className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bunga Kompetitif</p>
                <h3 className="font-bold text-gray-900">Mulai 1.2% / Bulan</h3>
              </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-3/4"></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm ml-auto mt-6 -translate-x-12 transform -rotate-2 hover:rotate-0 transition duration-500">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <FaUsers className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Anggota</p>
                <h3 className="font-bold text-gray-900">2,500+ Aktif</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
