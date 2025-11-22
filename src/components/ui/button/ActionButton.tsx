import { FC, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "edit" | "delete" | "open";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant;
  label: string;
}

const variantStyles: Record<Variant, string> = {
  edit: "border border-brand-950 hover:bg-brand-300 text-brand-black dark:text-gray-300 dark:hover:text-brand-black",
  delete: "border border-red-300 text-red-400 hover:bg-red-100",
  open: "border border-brand-950 text-brand-950 hover:bg-brand-100 dark:text-brand-400 dark:hover:text-brand-800",
};

const ActionButton: FC<ActionButtonProps> = ({
  variant,
  label,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "text-sm font-medium px-3 py-1.5 rounded-full shadow-sm transition duration-200",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </button>
  );
};

export default ActionButton;
