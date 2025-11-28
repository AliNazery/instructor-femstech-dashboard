import  { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline";
};

export function Button({
  children,
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 text-sm font-medium rounded-lg transition focus:outline-none";
  const variants = {
    default: "text-brand-500 border border-brand-500 hover:bg-brand-700 hover:text-white",
    outline: "border border-brand-500 text-brand-500 hover:bg-brand-700",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
