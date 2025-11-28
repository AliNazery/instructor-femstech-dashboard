import { FC, ReactNode } from "react";
import {  PlusCircle } from "lucide-react";

type CreateButtonProps = {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
};

const CreateButton: FC<CreateButtonProps> = ({
  onClick,
  children,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
    inline-flex items-center justify-center gap-3 px-5 py-2 rounded-lg 
    bg-brand-500 text-white font-semibold shadow-lg
    hover:bg-brand-700 hover:shadow-xl
    active:scale-95 active:brightness-90
    transition duration-300 ease-in-out
    focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400
    focus-visible:ring-offset-2
    w-full sm:w-auto text-center
    ${className}
  `}
      type="button"
    >
      <PlusCircle size={20} />
      {children}
    </button>
  );
};

export default CreateButton;
