import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "@/provider/AuthProvider";
import { Confirm } from "notiflix";

export default function Header() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext)!;
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // Detect Scroll for styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (event: MouseEvent) => {
      // যদি মেনু ওপেন থাকে এবং ক্লিকটা মেনুর বাইরে হয়
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    // মাউস ক্লিক ইভেন্ট লিসেনার এড করা
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Registration", path: "/registration", isHighlight: true },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Check Status", path: "/check-status" },
  ];

  return (
    <nav
      ref={menuRef}
      className={`sticky w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md border-slate-800 py-2 shadow-lg"
          : "bg-slate-900 border-white/5 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xl font-serif">
              P
            </div>
            <span className="text-2xl font-bold text-white tracking-tight font-serif">
              PGMPHS <span className="text-amber-500">Reunion - 2026</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden relative md:flex  items-center space-x-1">
            {navLinks.map((link) => {
              // 🔥 ১. যদি স্পেশাল বাটন হয় (Highlight Button)
              if (link.isHighlight) {
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="group relative inline-flex items-center justify-center px-6 py-2 ml-2 font-bold text-white transition-all duration-200 rounded-full focus:outline-none"
                  >
                    {/* এনিমেশন ব্যাকগ্রাউন্ড */}
                    <div className="absolute top-0 left-0 w-full h-full rounded-full bg-linear-to-r from-blue-600 via-purple-500 to-blue-600 animate-shimmer bg-size-[200%_auto] shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:scale-105 transition-transform duration-300"></div>

                    {/* টেক্সট লেয়ার */}
                    <span className="relative z-10 flex items-center gap-2 text-sm uppercase tracking-wide">
                      {link.name}
                    </span>
                  </Link>
                );
              }

              // 🟢 ২. যদি সাধারণ লিংক হয় (তোমার আগের ডিজাইন)
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-amber-400 bg-white/5 border border-white/10"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {user && (
              <button
                id="userDropdownButton1"
                data-dropdown-toggle="userDropdown1"
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="inline-flex  items-center bg-gray-100 rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white ml-5"
              >
                <svg
                  className="w-5 h-5 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-width="2"
                    d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                {user.displayName}
                <svg
                  className="w-4 h-4 text-gray-900 dark:text-white ms-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </button>
            )}

            {profileOpen && user && (
              <div
                id="userDropdown1"
                className={`${
                  profileOpen ? "" : "hidden"
                } z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 absolute mt-12 right-0 -top-2`}
              >
                <ul className="p-2 text-start text-sm font-medium text-gray-900 dark:text-white">
                  <li>
                    <Link
                      to={"/user-dash"}
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      Profile{" "}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/admin"}
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      Admin{" "}
                    </Link>
                  </li>
                </ul>

                <div className="p-2 text-sm font-medium text-gray-900 dark:text-white">
                  <button
                    onClick={() => {
                      Confirm.show(
                        "Logout Confirm",
                        "Do you agree with logout?",
                        "Yes",
                        "No",
                        () => {
                          logOut();
                        },
                        () => {},
                        {}
                      );
                    }}
                    className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    {" "}
                    Sign Out{" "}
                  </button>
                </div>
              </div>
            )}

            {!user && (
              <Link
                to="/login"
                className="ml-4 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-full transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)] hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 transition-colors"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? "bg-amber-500/10 text-amber-500"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <button
                id="userDropdownButton1"
                data-dropdown-toggle="userDropdown1"
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="inline-flex  items-center bg-gray-100 rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white md:ml-5 ml-3"
              >
                <svg
                  className="w-5 h-5 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-width="2"
                    d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                {user.displayName}
                <svg
                  className="w-4 h-4 text-gray-900 dark:text-white ms-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </button>
            )}

            {profileOpen && user && (
              <div
                id="userDropdown1"
                className={`${
                  profileOpen ? "" : "hidden"
                } z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 absolute mt-12 left-10 top-52`}
              >
                <ul className="p-2 text-start text-sm font-medium text-gray-900 dark:text-white">
                  <li>
                    <Link
                      to={"/user-dash"}
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      Profile{" "}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/admin"}
                      title=""
                      className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {" "}
                      Admin{" "}
                    </Link>
                  </li>
                </ul>

                <div className="p-2 text-sm font-medium text-gray-900 dark:text-white">
                  <button
                    onClick={() => {
                      Confirm.show(
                        "Logout Confirm",
                        "Do you agree with logout?",
                        "Yes",
                        "No",
                        () => {
                          logOut();
                        },
                        () => {},
                        {}
                      );
                    }}
                    className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    {" "}
                    Sign Out{" "}
                  </button>
                </div>
              </div>
            )}

            {!user && (
              <Link
                to="/login"
                className="ml-4 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-full transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)] hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
