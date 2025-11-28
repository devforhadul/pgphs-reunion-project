import { Link } from "react-router-dom";
import { FaFacebook, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden border-t border-white/5">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          
          {/* Brand / About Section */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
               <span className="text-2xl font-bold font-serif text-white">
                 PGPHS <span className="text-amber-500">Reunion - 2026</span>
               </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm max-w-sm">
              Reconnecting alumni from all batches. Join us for an unforgettable
              evening of memories, laughter, and celebration. Let's create history together.
            </p>
            <div className="flex gap-4">
               {/* Social Icons Placeholder */}
               <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-900 transition-all duration-300">
                  <FaFacebook />
               </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold font-serif text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-amber-500"></span> 
                Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                  { name: "Home", path: "/" },
                  { name: "Register Now", path: "/register" },
                  { name: "Alumni Dashboard", path: "/dashboard" },
                  { name: "Admin Panel", path: "/admin" }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-amber-400 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold font-serif text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-amber-500"></span>
                Contact Us
            </h3>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-amber-500 shrink-0">
                    <FaEnvelope />
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Email</p>
                    <span className="text-white hover:text-amber-400 transition-colors">info@pgphsreunion.com</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-amber-500 shrink-0">
                    <FaPhone />
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Phone</p>
                    <span className="text-white">01984839526</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-amber-500 shrink-0">
                    <FaMapMarkerAlt />
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Location</p>
                    <span className="text-white">PGPHS Campus, School Auditorium</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2025 PGPHS Alumni Association. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <FaHeart className="text-red-500 animate-pulse" /> by 
            <a href="https://www.facebook.com/forhadul75/" target="_blank" rel="noreferrer" className="text-amber-500 hover:underline font-semibold">
                Forhadul Islam
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};