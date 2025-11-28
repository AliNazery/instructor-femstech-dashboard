export function TabButton({
  label,
  active,
  onClick,
}: Readonly<{
  label: string;
  active: boolean;
  onClick: () => void;
}>) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
        active
          ? "bg-brand-500 text-white shadow-sm"
          : "text-gray-700 hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}
