import { FC, JSX } from "react";

interface RevenueSummaryCardProps {
  title: string;
  value: string;
  change: string;
  icon: JSX.Element;
}

const RevenueSummaryCard: FC<RevenueSummaryCardProps> = ({
  title,
  value,
  change,
  icon,
}) => {
  const isPositive = parseFloat(change) > 0;

  return (
    <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-brand-950">
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-full ${
            isPositive
              ? "bg-brand-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-500 text-sm mt-1">{value}</p>
        </div>
      </div>
      <span
        className={`text-sm font-medium ${
          isPositive ? "text-brand-950" : "text-red-500"
        }`}
      >
        {change}
      </span>
    </div>
  );
};

export default RevenueSummaryCard;
