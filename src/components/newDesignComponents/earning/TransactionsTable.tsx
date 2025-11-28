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
    <div className="bg-white dark:bg-neutral-800 shadow-md rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
      {/* 💻 TABLE VIEW for md+ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-sm text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              {["ID", "Course", "Student", "Amount", "Date"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left font-semibold uppercase tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
            {transactions.map((t) => (
              <tr
                key={t.id}
                onClick={() => onRowClick?.(t.id)}
                className="hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors duration-150"
              >
                <td className="px-4 py-3">{t.id}</td>
                <td className="px-4 py-3">{t.course}</td>
                <td className="px-4 py-3">{t.student}</td>
                <td className="px-4 py-3 font-semibold">{t.amount}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {t.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 CARD VIEW for mobile */}
      <div className="block md:hidden divide-y divide-gray-100 dark:divide-neutral-700">
        {transactions.length > 0 ? (
          transactions.map((t) => (
            <div
              key={t.id}
              onClick={() => onRowClick?.(t.id)}
              className="p-4 flex flex-col gap-2 hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors duration-150 border-b last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  ID: {t.id}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-300 truncate">
                  {t.date}
                </span>
              </div>

              <div className="truncate">
                <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {t.course}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  Student: {t.student}
                </p>
              </div>

              <div className="mt-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Amount:{" "}
                </span>
                <span className="font-semibold text-brand-500 dark:text-green-400">
                  {t.amount}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">
            No transactions found.
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
