import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "@/provider/AuthProvider";
import { Confirm } from "notiflix";

export default function Header() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext)!;



  // Detect Scroll for styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Registration", path: "/registration" }, // Fixed path based on Footer/Home
    { name: "Dashboard", path: "/dashboard" },
    { name: "Check Status", path: "/check-status" },
    // { name: "Admin", path: "/admin" },
  ];

  return (
    <nav
      className={`sticky w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md border-slate-800 py-2 shadow-lg"
          : "bg-slate-900 border-white/5 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
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
            ))}

            {/* CTA Button in Header */}
            <Link
              to="/registration"
              className="ml-4 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-full transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)] hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            >
              Registration Now
            </Link>
            {user ? (
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
                className="ml-4 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-full transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)] hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                Log out
              </button>
            ) : (
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
            <Link
              to="/login"
              className="ml-4 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-full transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)] hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
