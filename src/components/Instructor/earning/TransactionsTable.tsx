import { FC } from "react";

interface Transaction {
  id: string;
  course: string;
  student: string;
  amount: string;
  date: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  onRowClick?: (id: string) => void;
}

const TransactionsTable: FC<TransactionsTableProps> = ({
  transactions,
  onRowClick,
}) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      {/* 💻 TABLE VIEW for md+ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Course
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Student
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <tr
                key={t.id}
                onClick={() => onRowClick?.(t.id)}
                className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
              >
                <td className="px-4 py-3 text-sm text-gray-700">{t.id}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{t.course}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{t.student}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                  {t.amount}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 CARD VIEW for mobile */}
      <div className="block md:hidden divide-y divide-gray-100">
        {transactions.map((t) => (
          <div
            key={t.id}
            onClick={() => onRowClick?.(t.id)}
            className="p-4 flex flex-col gap-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b-brand-950 "
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">ID: {t.id}</span>
              <span className="text-sm text-gray-500">{t.date}</span>
            </div>

            <div>
              <p className="font-semibold text-gray-800">{t.course}</p>
              <p className="text-sm text-gray-600">Student: {t.student}</p>
            </div>

            <div className="mt-1">
              <span className="text-sm text-gray-700">Amount: </span>
              <span className="font-semibold text-brand-950">{t.amount}</span>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            No transactions found.
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;