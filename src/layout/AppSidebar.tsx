import React, { useState, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCircle,
  BookOpen,
  LogIn,
  Layers,
  Users,
  Megaphone,
  Star,
  DollarSign,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

type NavSubItem = {
  name: string;
  path: string;
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: NavSubItem[];
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/instructor/home",
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "My Courses",
    path: "/instructor/courses",
    icon: <BookOpen size={18} />,
    subItems: [
      { name: "All Courses", path: "/instructor/courses/my-courses" },
      { name: "Published", path: "/instructor/courses/published" },
      { name: "Drafts", path: "/instructor/courses/drafts" },
    ],
  },
  {
    name: "Course Content Manager",
    path: "/instructor/course/content/categories",
    icon: <Layers size={18} />,
  },
  {
    name: "Students & Enrollments",
    path: "/instructor/enrollments",
    icon: <Users size={18} />,
  },
  {
    name: "Announcements",
    path: "/instructor/announcements",
    icon: <Megaphone size={18} />,
  },
  {
    name: "Reviews & Ratings",
    path: "/instructor/reviews/courses",
    icon: <Star size={18} />,
  },
  {
    name: "Earnings & Payments",
    path: "/instructor/earnings",
    icon: <DollarSign size={18} />,
  },
  {
    name: "Profile & Settings",
    path: "/instructor/profile",
    icon: <UserCircle size={18} />,
  },
];

const otherItems: NavItem[] = [
  { name: "Sign Out", path: "/", icon: <LogIn size={18} /> },
];

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const {
    isExpanded,
    isHovered,
    setIsHovered,
    isMobileOpen,
    toggleMobileSidebar,
  } = useSidebar();

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const submenuRefs = useRef<Record<number, HTMLUListElement | null>>({});

  // Match admin route detection logic
  const isActive = useCallback(
    (path: string) => {
      const current = location.pathname;
      if (path === "/instructor/course/content/categories") {
        return current.startsWith("/instructor/course/content/");
      }
      return current === path || current.startsWith(path + "/");
    },
    [location.pathname]
  );

  const toggleSubmenu = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  const getSidebarWidth = () => {
    if (isExpanded || isMobileOpen) return "w-[290px]";
    if (isHovered) return "w-[290px]";
    return "w-[90px]";
  };

  const getLogo = () => {
    if (isExpanded || isHovered || isMobileOpen) {
      return (
        <img
          src="/images/logo/A.H white.png"
          alt="Logo"
          width={150}
          height={40}
        />
      );
    }
    return (
      <img src="/images/logo/A.H white.png" alt="Logo" width={32} height={32} />
    );
  };

  const handleNavClick = () => {
    if (isMobileOpen) toggleMobileSidebar();
  };

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-brand-950 text-white border-r border-gray-200 flex flex-col px-5 transition-all duration-300 z-50 ${getSidebarWidth()} ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* LOGO */}
        <div
          className={`py-8 flex ${
            !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
        >
          <Link to="/instructor/home" onClick={handleNavClick}>
            {getLogo()}
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto no-scrollbar">
          <ul className="flex flex-col gap-4">
            {navItems.map((item, index) => {
              const hasSubmenu = item.subItems && item.subItems.length > 0;
              const submenuOpen = openIndex === index;

              return (
                <li key={item.name}>
                  {hasSubmenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(index)}
                        className={`flex items-center w-full px-4 py-2 rounded-md text-sm justify-between transition-colors ${
                          isActive(item.path!)
                            ? "bg-white text-brand-950 font-semibold mb-2"
                            : "hover:bg-white hover:text-brand-950"
                        } ${
                          !isExpanded && !isHovered
                            ? "lg:justify-center"
                            : "lg:justify-between"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon}
                          {(isExpanded || isHovered || isMobileOpen) &&
                            item.name}
                        </span>
                        {(isExpanded || isHovered || isMobileOpen) && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              submenuOpen ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {/* Submenu */}
                      <ul
                        ref={(el) => {
                          submenuRefs.current[index] = el;
                        }}
                        className="overflow-hidden ml-6 transition-all duration-300 flex flex-col gap-y-2"
                        style={{
                          height: submenuOpen
                            ? `${
                                submenuRefs.current[index]?.scrollHeight || 0
                              }px`
                            : "0px",
                        }}
                      >
                        {item.subItems?.map((sub) => (
                          <li key={sub.name}>
                            <Link
                              to={sub.path}
                              onClick={handleNavClick}
                              className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                                isActive(sub.path)
                                  ? "bg-white text-brand-950 font-semibold"
                                  : "hover:bg-white hover:text-brand-950"
                              }`}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      to={item.path!}
                      onClick={handleNavClick}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
                        isActive(item.path!)
                          ? "bg-white text-brand-950 font-semibold"
                          : "hover:bg-white hover:text-brand-950"
                      } ${
                        !isExpanded && !isHovered
                          ? "lg:justify-center"
                          : "lg:justify-start"
                      }`}
                    >
                      {item.icon}
                      {(isExpanded || isHovered || isMobileOpen) && item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* OTHER ITEMS */}
          <div className="mt-6">
            <ul className="flex flex-col gap-4">
              {otherItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path!}
                    onClick={handleNavClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:bg-white hover:text-brand-950 transition-colors"
                  >
                    {item.icon}
                    {(isExpanded || isHovered || isMobileOpen) && item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[40] lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
};

export default AppSidebar;
