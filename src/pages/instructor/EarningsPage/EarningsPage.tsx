import { FC, useState, ChangeEvent } from "react";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import RevenueSummaryCard from "../../../components/newDesignComponents/earning/RevenueSummaryCard";
import TransactionsTable from "../../../components/newDesignComponents/earning/TransactionsTable";
import TransactionDetailsDrawer from "../../../components/newDesignComponents/earning/TransactionDetailsDrawer";
import {
  useGetTotalRevenueQuery,
  useGetTransactionsQuery,
} from "../../../app/api/instructor/instructorApi";
import EmptyState from "../../../components/common/EmptyState";


const EarningsPage: FC = () => {
  const [filter, setFilter] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: revenueData, isLoading: isRevenueLoading } =
    useGetTotalRevenueQuery();

  const { data: transactionsData, isLoading: isTransactionsLoading } =
    useGetTransactionsQuery({ page: 1, per_page: 10 });

  const totalRevenue = revenueData?.data?.total_revenue ?? "0.00";
  const currentMonthRevenue =
    revenueData?.data?.current_month_revenue ?? "0.00";
  const growthRate = revenueData?.data?.growth_rate ?? 0;

  const transactions = transactionsData?.data ?? [];
  const filteredTransactions = transactions.filter(
    (t) =>
      t.course?.title.toLowerCase().includes(filter.toLowerCase()) ||
      `${t.student?.first_name} ${t.student?.last_name}`
        .toLowerCase()
        .includes(filter.toLowerCase())
  );

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFilter(e.target.value);

  const selectedTransaction =
    transactions.find((t) => String(t.id) === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Earnings & Payments</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RevenueSummaryCard
          title="Total Revenue"
          value={`$${totalRevenue}`}
          change={isRevenueLoading ? "..." : "+5%"}
          icon={<DollarSign size={24} />}
        />
        <RevenueSummaryCard
          title="Current Month"
          value={`$${currentMonthRevenue}`}
          change={isRevenueLoading ? "..." : "+10%"}
          icon={<Calendar size={24} />}
        />
        <RevenueSummaryCard
          title="Growth"
          value={`${growthRate}%`}
          change={
            isRevenueLoading
              ? "..."
              : `${growthRate > 0 ? "+" : ""}${growthRate}%`
          }
          icon={<TrendingUp size={24} />}
          isPercent
        />
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
          {/* Title */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 truncate w-full sm:w-auto">
            Recent Transactions
          </h2>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by course or student..."
            value={filter}
            onChange={handleFilterChange}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors duration-150"
          />
        </div>
   

        {isTransactionsLoading ? (
          <p className="text-center text-gray-500">Loading transactions...</p>
        ) : (
          <TransactionsTable
            transactions={filteredTransactions.map((item) => ({
              id: String(item.id),
              course: item.course.title,
              student: `${item.student.first_name} ${item.student.last_name}`,
              amount: `$${item.amount}`,
              date: new Date(item.paid_at).toLocaleDateString(),
            }))}
            onRowClick={(id) => setSelectedId(id)}
          />
        )}
         {transactions.length === 0 && (
      <EmptyState
        title="No Transactions Found"
        description="Your platform has no transactions yet. Once students start purchasing courses, they will appear here."
      />
    )}

      </div>

      {/* Drawer */}
      {selectedTransaction && (
        <TransactionDetailsDrawer
          transaction={selectedTransaction}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};

export default EarningsPage;
