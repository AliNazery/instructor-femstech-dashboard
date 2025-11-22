type Props = {
  progress: number;
  completedAt?: string;
};

export default function StudentProgressRow({ progress, completedAt }: Props) {
  const getColor = () => {
    if (progress < 40) return "bg-red-500";
    if (progress < 70) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="space-y-1">
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-2 transition-all ${getColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-gray-600 flex justify-between">
        <span>{progress}%</span>
        {completedAt && (
          <span className="italic text-gray-500">
            Completed {new Date(completedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
