import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
    label?: string;
    className?: string;
}
const BackButton: React.FC<BackButtonProps> = ({ label = "Go Back", className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`
        flex items-center justify-center sm:justify-start gap-2 
        bg-brand-500 text-white rounded-lg transition-colors 
        hover:bg-brand-500 
        text-xs sm:text-sm md:text-base 
        px-3 sm:px-4 py-2 w-full sm:w-auto 
        ${className}
      `}
    >
      <ArrowLeft size={16} className="shrink-0" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
};

export default BackButton;
