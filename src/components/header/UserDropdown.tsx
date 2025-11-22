import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from "react-router";
import { SignOutIcon } from "../../icons/svgIcon";
import { useInstructorLogoutMutation } from "../../app/api/instructor/instructorApi";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { resetInstructor } from "../../app/features/instructorSlice";
import { RootState } from "../../app/api/store";
import avatar from "../../../public/images/user/avatar.jpg"

export default function UserDropdown() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  
  const [logout] = useInstructorLogoutMutation();
  const { instructor } = useSelector((state: RootState) => state.instructor);


  
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      Cookies.remove("instructor_token");
   dispatch(resetInstructor());
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  const avatarScr = instructor?.avatar_url || avatar;

  
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img src={avatarScr} alt="Instructor" />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {instructor?.first_name}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {instructor?.first_name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
           {instructor?.email}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800"></ul>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <SignOutIcon />
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
