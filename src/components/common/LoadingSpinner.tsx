import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  text?: string;
  fullScreen?: boolean;
};

export default function LoadingSpinner({
  text = "Loading...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const containerClass = fullScreen
    ? "flex flex-col items-center justify-center h-full w-full py-20"
    : "flex flex-col items-center justify-center py-6";

  return (
    <div className={containerClass}>
      <Loader2 className="h-8 w-8 animate-spin text-brand-950 mb-3" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}
