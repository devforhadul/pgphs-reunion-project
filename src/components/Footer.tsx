import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              PGPHS Reunion
            </h3>
            <p className="text-gray-400 mb-4">
              Reconnecting alumni from all batches. Join us for an unforgettable
              evening of memories, laughter, and celebration.
            </p>
            <p className="text-sm text-gray-500">
              © 2024 PGPHS Alumni Association. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>info@pgphsreunion.com</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📱</span>
                <span>01984839526</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <span>PGPHS Campus, School Auditorium</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>Made with ❤️ <a href="https://www.facebook.com/forhadul75/" target="_blank">Forhadul Islam</a></p>
        </div>
      </div>
    </footer>
  );
};
