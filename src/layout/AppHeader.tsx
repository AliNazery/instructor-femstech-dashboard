import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Layers,
  Users,
  Megaphone,
  Star,
  DollarSign,
} from "lucide-react";

import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";

import mainlogo from "../../public/images/logo/log.png";

const navItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={16} />,
    path: "/instructor/home",
  },
  {
    name: "My Courses",
    icon: <BookOpen size={16} />,
    submenu: [
      { name: "All Courses", path: "/instructor/courses/my-courses" },
      { name: "Published", path: "/instructor/courses/published" },
      { name: "Drafts", path: "/instructor/courses/drafts" },
    ],
  },
  {
    name: "Content Manager",
    icon: <Layers size={16} />,
    path: "/instructor/course/content/categories",
  },
  {
    name: "Students",
    icon: <Users size={16} />,
    path: "/instructor/enrollments",
  },
  {
    name: "Announcements",
    icon: <Megaphone size={16} />,
    path: "/instructor/announcements",
  },
  {
    name: "Reviews",
    icon: <Star size={16} />,
    path: "/instructor/reviews/courses",
  },
  {
    name: "Earnings",
    icon: <DollarSign size={16} />,
    path: "/instructor/earnings",
  },
 
];

export default function AppHeader() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // store refs for click-outside detection
  const dropdownRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // helper to close dropdowns and mobile menu
  const closeAll = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  // Escape key closes everything
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Click outside closes dropdown
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (!openDropdown) return;
      const ref = dropdownRefs.current[openDropdown];
      if (ref && !ref.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [openDropdown]);

  // lock body scroll in mobile
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = mobileMenuOpen ? "hidden" : original || "";
    return () => {
      document.body.style.overflow = original || "";
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLinkClick = () => {
    // Only close mobile menu; keep desktop dropdown open
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 sticky top-0 z-40 border-b dark:border-gray-800 shadow-sm">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Logo */}
        <Link to="/" onClick={handleLinkClick} className="flex items-center gap-2">
          <img src={mainlogo} alt="Logo" className="dark:hidden w-24 md:w-32" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              ref={(el) => { dropdownRefs.current[item.name] = el; }}
            >
              {!item.submenu ? (
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-1 text-sm font-medium transition ${
                    isActive(item.path)
                      ? "text-brand-700"
                      : "text-gray-700 dark:text-gray-300"
                  } hover:text-brand-700`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === item.name}
                    onClick={() =>
                      setOpenDropdown((prev) => (prev === item.name ? null : item.name))
                    }
                    className={`flex items-center gap-1 text-sm font-medium transition ${
                      isActive(item.path ?? "")
                        ? "text-brand-700"
                        : "text-gray-700 dark:text-gray-300"
                    } hover:text-brand-700`}
                  >
                    {item.icon}
                    {item.name}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        openDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Desktop dropdown - SMOOTH TRANSITION */}
                  <div
                    className={`absolute top-full left-0 mt-2 w-52 z-50 transition-all duration-300 ease-out 
                    ${
                      openDropdown === item.name
                        ? "opacity-100 max-h-96 pointer-events-auto" // Open state
                        : "opacity-0 max-h-0 pointer-events-none" // Closed state
                    } overflow-hidden`}
                  >
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg py-2">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          onClick={() => {
                            handleLinkClick();
                            setOpenDropdown(null); // Close desktop dropdown on link click
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Right side (Visible on all screens) */}
        <div className="flex items-center gap-3">
          <NotificationDropdown />
          <UserDropdown />

          {/* Mobile Toggle (Visible only on small screens) */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU (Visible only when open and on small screens) */}
      {mobileMenuOpen && (
        <>
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-md py-4 px-4">
            {navItems.map((item) => (
              <div key={item.name} className="mb-1">
                {!item.submenu ? (
                  <Link
                    to={item.path}
                    onClick={closeAll} // Close mobile menu and any open dropdown
                    className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown((prev) => (prev === item.name ? null : item.name))
                      }
                      className="flex items-center justify-between w-full px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-expanded={openDropdown === item.name}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        {item.name}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          openDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Mobile submenu - SMOOTH TRANSITION */}
                    <div
                      className={`ml-6 mt-1 transition-all duration-300 ease-out overflow-hidden
                        ${
                          openDropdown === item.name
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }
                      `}
                    >
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          onClick={closeAll} // Close mobile menu and any open dropdown
                          className="block px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Mobile backdrop (Visible only on small screens when menu is open) */}
          <div
            className="fixed lg:inset-0 z-30 bg-black/20 lg:hidden" // Added lg:hidden for explicit clarity, although mobileMenuOpen check already covers this.
            onClick={closeAll}
          />
        </>
      )}

      {/* Desktop backdrop (Visible only on large screens when a desktop dropdown is open) */}
      {openDropdown && !mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/0 hidden lg:block" // Added hidden lg:block to ensure it only shows up on desktop when needed
          onClick={() => setOpenDropdown(null)}
          aria-hidden
        />
      )}
    </header>
  );
}
