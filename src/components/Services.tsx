import {
  FaPiggyBank,
  FaMoneyBillWave,
  FaGraduationCap,
  FaCheck,
} from "react-icons/fa";

export default function Services() {
  return (
    <section id="layanan" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
            Layanan Kami
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Produk Simpanan & Pinjaman
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Pilihan produk fleksibel yang dirancang untuk memenuhi kebutuhan
            finansial jangka pendek maupun jangka panjang Anda.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Service 1 */}
          <div className="bg-gray-50 rounded-xl p-8 hover:shadow-xl transition duration-300 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 mb-6">
              <FaPiggyBank className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Simpanan Sukarela
            </h3>
            <p className="text-gray-600 mb-4">
              Simpanan yang dapat disetor dan diambil kapan saja dengan jasa
              simpanan yang menarik.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" /> Bebas biaya admin
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" /> Bunga harian
              </li>
            </ul>
          </div>

          {/* Service 2 */}
          <div className="bg-gray-50 rounded-xl p-8 hover:shadow-xl transition duration-300 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-700 mb-6">
              <FaMoneyBillWave className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Pinjaman Usaha
            </h3>
            <p className="text-gray-600 mb-4">
              Modal kerja untuk pengembangan UMKM anggota dengan syarat mudah
              dan proses cepat.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" /> Plafon hingga 50
                Juta
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" /> Tenor s.d 36 Bulan
              </li>
            </ul>
          </div>

          {/* Service 3 */}
          <div className="bg-gray-50 rounded-xl p-8 hover:shadow-xl transition duration-300 border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 mb-6">
              <FaGraduationCap className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Simpanan Pendidikan
            </h3>
            <p className="text-gray-600 mb-4">
              Persiapkan masa depan buah hati Anda dengan tabungan berjangka
              khusus pendidikan.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" /> Bunga diatas
                rata-rata
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" /> Auto-debet bulanan
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
