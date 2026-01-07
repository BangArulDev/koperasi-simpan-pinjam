import { Transaction } from "../types";

interface MutationTableProps {
  limit?: number;
  data: Transaction[];
}

export default function MutationTable({
  limit,
  data = [],
}: MutationTableProps) {
  const transactions = data;
  const shownTransactions = limit ? transactions.slice(0, limit) : transactions;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Keterangan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jenis
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jumlah
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shownTransactions.map((trx) => (
            <tr key={trx.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {trx.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {trx.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {trx.type}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                  trx.amount > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {trx.amount > 0 ? "+" : "-"} {formatCurrency(trx.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    trx.status === "berhasil"
                      ? "bg-green-100 text-green-800"
                      : trx.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {trx.status.charAt(0).toUpperCase() + trx.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
