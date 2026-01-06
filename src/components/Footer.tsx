import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div>
            <h3 className="text-lg font-bold mb-4">KSP Sejahtera</h3>
            <p className="text-gray-400 text-sm">
              Mitra terpercaya untuk pertumbuhan ekonomi keluarga dan usaha
              Anda. Terdaftar dan diawasi.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Jam Operasional</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Senin - Jumat: 08:00 - 16:00</li>
              <li>Sabtu: 08:00 - 12:00</li>
              <li>Minggu: Libur</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-base text-gray-400">
            &copy; 2024 Koperasi Simpan Pinjam Sejahtera. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
