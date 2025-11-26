import { Link } from "react-router-dom";
import bkash_logo from "@/assets/bkash_logo.png";
import nagad_logo from "@/assets/nagad_logo.png";
import rocket_logo from "@/assets/rocket_logo.png";

export const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-24 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <span className="text-sm font-semibold">
              🎉 PGPHS 1st Alumni Reunion
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
            PGPHS Reunion 2025
          </h1>
          <p className="text-2xl md:text-3xl mb-6 font-semibold text-white/95">
            Reconnect, Reminisce, and Celebrate Together
          </p>
          <p className="text-lg md:text-xl mb-10 max-w-4xl mx-auto text-white/90 leading-relaxed">
            Step back into the halls of PGPHS and relive the golden days! This
            is more than just a reunion - it's a celebration of the friendships
            that shaped us, the memories that define us, and the bonds that
            connect us across time. Join hundreds of alumni as we come together
            for an evening filled with laughter, stories, delicious food, and
            the joy of reconnecting with those who shared our journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="group relative inline-block bg-white text-indigo-600 font-bold px-10 py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/20 text-lg overflow-hidden"
            >
              <span className="relative z-10">Register Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/dashboard"
              className="inline-block bg-white/10 backdrop-blur-sm text-white font-semibold px-10 py-4 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300 text-lg"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                About Our Event
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              About the{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Reunion
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A heartfelt celebration of friendship, cherished memories, and the
              unbreakable bonds that have stood the test of time. This is where
              past meets present, and new stories begin.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  We are absolutely delighted to extend this special invitation
                  to all PGPHS alumni for our{" "}
                  <strong className="text-indigo-600 dark:text-indigo-400">
                    historic 1st Alumni Reunion
                  </strong>
                  . This milestone event brings together generations of
                  graduates to celebrate our shared heritage, reconnect with
                  cherished friends, and honor the incredible journey we've all
                  taken since our school days.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-pink-100 dark:border-pink-800/50">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  No matter when you walked through those school gates - whether
                  it was yesterday or decades ago - this reunion is your
                  homecoming. Experience an evening brimming with nostalgia,
                  heartfelt conversations, and the warmth of rekindled
                  friendships. Share your success stories, catch up on life's
                  adventures, and create beautiful new memories together.
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/50">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  This is your chance to step back in time, share laughter over
                  old yearbooks, and discover how our paths have intertwined.
                  Don't let this once-in-a-lifetime opportunity pass you by -
                  register today and be part of this extraordinary celebration
                  of our PGPHS family!
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-3">✨</span>
                  Event Highlights
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <span className="text-2xl mr-4">🤝</span>
                    <span className="text-white font-medium">
                      Networking with alumni from all batches
                    </span>
                  </li>
                  <li className="flex items-start bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <span className="text-2xl mr-4">🍽️</span>
                    <span className="text-white font-medium">
                      Delicious dinner and refreshments
                    </span>
                  </li>
                  <li className="flex items-start bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <span className="text-2xl mr-4">🎵</span>
                    <span className="text-white font-medium">
                      Entertainment and live music
                    </span>
                  </li>
                  <li className="flex items-start bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <span className="text-2xl mr-4">📸</span>
                    <span className="text-white font-medium">
                      Photo sessions and memory sharing
                    </span>
                  </li>
                  <li className="flex items-start bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <span className="text-2xl mr-4">🏆</span>
                    <span className="text-white font-medium">
                      Awards and recognition ceremony
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm font-semibold">Event Information</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Event{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Details
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  📅
                </div>
                <h3 className="text-2xl font-bold mb-3">Date</h3>
                <p className="text-xl text-white/90 font-semibold">
                  January 2, 2026
                </p>
                <p className="text-sm text-white/70 mt-2">Wednesday</p>
              </div>
            </div>
            <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  🕐
                </div>
                <h3 className="text-2xl font-bold mb-3">Time</h3>
                <p className="text-xl text-white/90 font-semibold">
                  6:00 PM - 11:00 PM
                </p>
                <p className="text-sm text-white/70 mt-2">5 Hours of Fun</p>
              </div>
            </div>
            <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  📍
                </div>
                <h3 className="text-2xl font-bold mb-3">Venue</h3>
                <p className="text-xl text-white/90 font-semibold">
                  School Auditorium
                </p>
                <p className="text-sm text-white/70 mt-2">PGPHS Campus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Fee Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full">
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                Pricing
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Registration{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Fee
              </span>
            </h2>
          </div>
          <div className="max-w-lg mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-3xl shadow-2xl p-10 text-center text-white transform hover:scale-105 transition-transform duration-300">
              <div className="mb-6">
                <span className="text-4xl">🎫</span>
              </div>
              <p className="text-2xl font-semibold mb-2 opacity-90">
                Registration Fee
              </p>
              <p className="text-7xl font-extrabold mb-6 bg-white/20 backdrop-blur-sm rounded-2xl py-4 px-6 inline-block">
                1000 Tk
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-8 border border-white/30">
                <p className="text-lg font-medium">
                  ✨ Includes dinner, t-shirt, refreshments, and all event
                  activities
                </p>
              </div>
              <Link
                to="/register"
                className="inline-block bg-white text-amber-600 font-bold px-10 py-4 rounded-xl hover:bg-amber-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
              >
                Register Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full">
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Payment Options
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Payment{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Methods
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose your preferred payment method
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-center text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 transform group-hover:rotate-12 transition-transform duration-300">
                  <img className="h-52 mx-auto" src={bkash_logo} alt="" />
                </div>
                <h3 className="text-2xl font-bold mb-3">bKash</h3>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <p className="text-sm mb-2 opacity-90">Merchant Number</p>
                  <p className="text-2xl font-bold">01984839526</p>
                </div>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-center text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 transform group-hover:rotate-12 transition-transform duration-300">
                  <img className="h-52 mx-auto" src={nagad_logo} alt="" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Nagad</h3>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <p className="text-sm mb-2 opacity-90">Merchant Number</p>
                  <p className="text-2xl font-bold">01984839526</p>
                </div>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-8 text-center text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 transform group-hover:rotate-12 transition-transform duration-300">
                   <img className="h-52 mx-auto" src={rocket_logo} alt="" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Rocket</h3>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <p className="text-sm mb-2 opacity-90">Merchant Number</p>
                  <p className="text-2xl font-bold">01984839526</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* <div className="mb-6">
            <span className="text-6xl">PGPHS Reunion</span>
          </div> */}
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
            Ready to Join Us?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed">
            Don't miss out on this amazing opportunity to reconnect with your
            school community! Register now and be part of this unforgettable
            celebration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group relative inline-block bg-white text-indigo-600 font-bold px-10 py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/20 text-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Register Now
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/dashboard"
              className="inline-block bg-white/10 backdrop-blur-sm text-white font-semibold px-10 py-4 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300 text-lg"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
