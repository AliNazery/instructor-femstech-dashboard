import { Pin } from "lucide-react";
import { FC, useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

type Props = {
  pinned: boolean;
  onToggle: () => void;
  priority?: "normal" | "high"; // optional extension
};

const PinToggle: FC<Props> = ({ pinned, onToggle, priority = "normal" }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onToggle();
    setTimeout(() => setIsClicked(false), 200); // reset animation
  };

  const getColorClasses = () => {
    if (pinned) return "text-brand-950 ring-1 hover:text-brand-700";
    return "text-gray-400 bg-gray-100 hover:text-gray-600";
  };

  const getPriorityClasses = () => {
    if (priority === "high") return "ring-2 ring-red-400";
    return "";
  };

  return (
    <Tippy
      content={pinned ? "Pinned: stays at the top" : "Click to pin"}
      placement="top"
    >
      <button
        onClick={handleClick}
        aria-label={pinned ? "Unpin announcement" : "Pin announcement"}
        title={pinned ? "Unpin" : "Pin"}
        className={`p-2 rounded-full flex items-center justify-center shadow-sm
          transition-all duration-200 transform 
          ${isClicked ? "scale-110" : ""} 
          ${getColorClasses()} ${getPriorityClasses()} 
          focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-300`}
      >
        <Pin
          size={22}
          className={`transition-transform duration-200 ${
            pinned ? "rotate-0" : "rotate-45"
          }`}
        />
      </button>
    </Tippy>
  );
};

export default PinToggle;
