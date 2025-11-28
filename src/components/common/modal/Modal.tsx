
import { X } from "lucide-react";
import { FC, ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/60 z-9999 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 border border-brand-500 p-6 rounded-lg w-full max-w-xl shadow-xl"
        onClick={(e) => e.stopPropagation()} // prevent modal close when clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X size={20} />
              </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
