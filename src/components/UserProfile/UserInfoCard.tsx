import { useModal } from "../../hooks/useModal";
import { useSelector } from "react-redux";
import { RootState } from "../../app/api/store";
import EditInstructorModal from "./EditInstructorModal";
import { Edit, MoreVertical, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UpdatePasswordModal from "./UpdatePasswordModal";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const {
    isOpen: isPasswordOpen,
    openModal: openPasswordModal,
    closeModal: closePasswordModal,
  } = useModal();

  const { instructor } = useSelector((state: RootState) => state.instructor);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      {/* 3-dot dropdown menu always top-right */}
      <div className="absolute top-2 right-2" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <MoreVertical size={18} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50">
            <button
              onClick={() => {
                setMenuOpen(false);
                openModal();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Edit size={14} /> Edit
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                openPasswordModal();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Lock size={14} /> Change Password
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {instructor?.first_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {instructor?.last_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {instructor?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {instructor?.phone}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {instructor?.bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      <EditInstructorModal isOpen={isOpen} onClose={closeModal} />
      <UpdatePasswordModal
        isOpen={isPasswordOpen}
        onClose={closePasswordModal}
      />
    </div>
  );
}
