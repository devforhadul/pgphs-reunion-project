import { Link } from "react-router-dom";
import bkash_logo from "@/assets/bkash_logo.png";
import nagad_logo from "@/assets/nagad_logo.png";
import rocket_logo from "@/assets/rocket_logo.png";
import {
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaHistory,
  FaQuoteRight,
  FaArrowRight,
} from "react-icons/fa";
import { MdEventSeat, MdRestaurantMenu, MdMusicNote } from "react-icons/md";
import { LuHeartHandshake } from "react-icons/lu";
import { GoTrophy } from "react-icons/go";
import { GiKnifeFork } from "react-icons/gi";
import { IoCameraReverseOutline } from "react-icons/io5";
import v from "../../assets/video/pgmphs_video_720p.mp4";


export const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans selection:bg-amber-200">
      {/* Hero Section - Asymmetrical & Premium */}
      <section className="hidden relative w-full  overflow-hidden bg-slate-900 pt-24 pb-32 lg:pt-40 lg:pb-48">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-amber-100 text-sm font-medium tracking-wide uppercase">
                  PGMPHS Alumni Association
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1]">
                Back to the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 font-serif italic">
                  Golden Days
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Join us for the historic 1st Alumni Reunion of PGPHS. A night of
                nostalgia, networking, and celebrating the journey that started
                in our classrooms.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  to="/registration"
                  className="group relative px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2"
                >
                  Confirm Registration
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition-all duration-300 flex items-center justify-center"
                >
                  Alumni Dashboard
                </Link>
              </div>
            </div>

            {/* Abstract Graphic / Visual */}
            <div className="relative hidden lg:block">
              <div className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 group">
                <div className="absolute -top-10 -right-10 text-9xl text-white/5 font-serif font-black select-none">
                  2026
                </div>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-amber-500 font-bold text-sm tracking-widest uppercase">
                      The Grand Reunion
                    </p>
                    <h3 className="text-3xl text-white font-serif mt-2">
                      Class of Legends
                    </h3>
                  </div>
                  <FaGraduationCap className="text-5xl text-white/20 group-hover:text-amber-500/50 transition-colors" />
                </div>
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-amber-400">
                      <FaCalendarAlt size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Date</p>
                      <p className="font-semibold">March 22, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-amber-400">
                      <FaMapMarkerAlt size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase">
                        Location
                      </p>
                      <p className="font-semibold">PGPHS School Field</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Element */}
              <div className="absolute inset-0 bg-amber-500 rounded-2xl -rotate-3 opacity-20 scale-95 z-0"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden pt-24 pb-32 lg:pt-40 lg:pb-48">
        {/* 🎬 Video Background Layer (New Addition) */}
        <video
          autoPlay
          loop
          muted
          preload="auto"
          playsInline // For mobile compatibility
          className="absolute inset-0 w-full h-full object-cover opacity-50" // opacity for dark overlay
        >
          {/* Replace 'your-slow-motion-video.mp4' with the actual path/URL */}
          <source src={v} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Black/Dark Overlay to ensure text is readable (New Addition) */}
        <div className="absolute inset-0 bg-slate-900/20"></div>

        {/* Background Patterns (Kept the original, but placed above the video/overlay to maintain aesthetic) */}
        {/* <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] z-[1]"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] z-[1]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-[1]"></div> */}

        {/* Rest of your content remains here with z-index to ensure it is above the video */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8 text-center lg:text-left z-10">
              {/* ... (Existing content here) ... */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-amber-100 text-sm font-medium tracking-wide uppercase">
                  PGMPHS Alumni Association
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1]">
                Back to the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 font-serif italic">
                  Golden Days
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-back max-w-2xl mx-auto lg:mx-0 leading-relaxed  font-medium ">
                Join us for the historic 1st Alumni Reunion of PGPHS. A night of
                nostalgia, networking, and celebrating the journey that started
                in our classrooms.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  to="/registration"
                  className="group relative px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2"
                >
                  Confirm Registration
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                {/* <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition-all duration-300 flex items-center justify-center"
                >
                  Alumni Dashboard
                </Link> */}
              </div>
            </div>

            {/* Abstract Graphic / Visual */}
            <div className="relative hidden  z-10">
              {/* ... (Existing content here) ... */}
              <div className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 group">
                <div className="absolute -top-10 -right-10 text-9xl text-white/5 font-serif font-black select-none">
                  2026
                </div>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-amber-500 font-bold text-sm tracking-widest uppercase">
                      The Grand Reunion
                    </p>
                    <h3 className="text-3xl text-white font-serif mt-2">
                      Class of Legends
                    </h3>
                  </div>
                  <FaGraduationCap className="text-5xl text-white/20 group-hover:text-amber-500/50 transition-colors" />
                </div>
                <div className="space-y-4 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-amber-400">
                      <FaCalendarAlt size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase">Date</p>
                      <p className="font-semibold">March 22, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-amber-400">
                      <FaMapMarkerAlt size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase">
                        Location
                      </p>
                      <p className="font-semibold">PGPHS School Field</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Element */}
              <div className="absolute inset-0 bg-amber-500 rounded-2xl -rotate-3 opacity-20 scale-95 z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Highlights Banner - Overlapping */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-20">
        <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
          {[
            { icon: MdEventSeat, label: "Total Seats", value: "1000+" },
            { icon: FaHistory, label: "Batches", value: "All" },
            { icon: MdRestaurantMenu, label: "Food", value: "lunch" },
            { icon: MdMusicNote, label: "Show", value: "Live Band" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center group"
            >
              <item.icon className="text-3xl text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 text-lg">
                {item.value}
              </span>
              <span className="text-sm text-slate-500 font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* About Section - Clean Typography */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 relative">
            <div className="relative z-10">
              <h2 className="text-amber-600 font-bold tracking-widest uppercase text-sm mb-3">
                Our Story
              </h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif">
                Decades passed, <br />
                but the{" "}
                <span className="underline decoration-amber-400 underline-offset-4 decoration-4">
                  bond remains.
                </span>
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                We are absolutely delighted to extend this special invitation to
                all PGPHS alumni. This milestone event brings together
                generations of graduates to celebrate our shared heritage.
              </p>
              <div className="p-6 bg-slate-50 border-l-4 border-amber-500 rounded-r-lg">
                <FaQuoteRight className="text-amber-300 text-2xl mb-2" />
                <p className="italic text-slate-700 font-medium">
                  "No matter when you walked through those school gates -
                  whether it was yesterday or decades ago - this reunion is your
                  homecoming."
                </p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <div className="space-y-4 mt-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4 text-xl">
                  <LuHeartHandshake />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">Networking</h4>
                <p className="text-sm text-slate-500">
                  Connect with seniors and juniors from diverse professions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 mb-4 text-xl">
                  <IoCameraReverseOutline />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">Memories</h4>
                <p className="text-sm text-slate-500">
                  Photo booths and sessions to capture the moment.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4 text-xl">
                  <GiKnifeFork />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">Grand Feast</h4>
                <p className="text-sm text-slate-500">
                  Delicious dinner buffet with premium refreshments.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 text-xl">
                  <GoTrophy />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">Ceremony</h4>
                <p className="text-sm text-slate-500">
                  Awards, recognition and cultural performances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details - Bento Grid Style */}
      <section className="py-24 bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm">
              Save The Date
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 font-serif">
              Event Schedule
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
              <FaCalendarAlt className="text-5xl text-amber-400 mb-6 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">March 22, 2026</h3>
              <p className="text-slate-400">Sunday</p>
              <div className="mt-6 inline-block px-3 py-1 bg-amber-500/20 text-amber-300 rounded text-xs font-bold uppercase tracking-wider">
                Confirmed
              </div>
            </div>

            {/* Time Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl shadow-2xl transform md:-translate-y-4">
              <FaClock className="text-5xl text-white mb-6" />
              <h3 className="text-2xl font-bold mb-2">08:00 AM</h3>
              <p className="text-indigo-200">Gates Open</p>
              <div className="mt-6 border-t border-white/20 pt-4">
                <p className="text-sm font-medium">Until 10:00 PM</p>
                <p className="text-xs text-indigo-200 mt-1">
                  14 Hours of Non-stop Celebration
                </p>
              </div>
            </div>

            {/* Venue Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
              <FaMapMarkerAlt className="text-5xl text-pink-400 mb-6 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">School Field</h3>
              <p className="text-slate-400">PGPHS School Field</p>
              <div className="mt-6 inline-block px-3 py-1 bg-pink-500/20 text-pink-300 rounded text-xs font-bold uppercase tracking-wider">
                Map View
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery*/}
      <section className="py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-serif">
              Photo Gallery
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="grid gap-4">
              <div>
                <img
                  className="h-auto max-w-full rounded-md"
                  src="https://i.ibb.co.com/zTp802jC/600334314-122107060137154307-4603891103089247975-n.jpg"
                  alt=""
                />
              </div>
              <div>
                <img
                  className="h-auto max-w-full rounded-xl"
                  src="https://i.ibb.co.com/Psxv4vp5/593016617-10225465712189610-1627367924489103022-n.jpg"
                  alt=""
                />
              </div>
              <div>
                <img
                  className="h-auto max-w-full rounded-xl"
                  src="https://i.ibb.co.com/20HTZhpN/595958439-888387626855726-5142704175034234326-n.jpg"
                  alt=""
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <img
                  className="h-auto max-w-full rounded-xl"
                  src="https://i.ibb.co.com/NnWvXRYj/image.png"
                  alt=""
                />
              </div>
              <div>
                <img
                  className="h-auto max-w-full rounded-xl"
                  src="https://i.ibb.co.com/RGnBpGCj/image.png"
                  alt=""
                />
              </div>
              <div>
                <img
                  className="h-auto max-w-full rounded-xl"
                  src="https://i.ibb.co.com/XxNrYDNt/593989644-122098613247154307-3507586352072381675-n.jpg"
                  alt=""
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <img
                  className="h-auto max-w-full rounded-xl"
                  src="https://i.ibb.co.com/RMdGHny/597613291-1183983953687813-8326230877977922681-n.jpg"
                  alt=""
                />
              </div>
              <div>
                <img
                  className="h-auto max-w-full rounded-xl"
                  src="https://i.ibb.co.com/NgVyLt0q/592377469-10225465844792925-6953975270016035291-n.jpg"
                  alt=""
                />
              </div>
              <div>
                <img
                  className="h-auto max-w-full rounded-xl"
                  src="https://i.ibb.co.com/JjkN8xTW/595414799-890464320293459-5119703340127139389-n.jpg"
                  alt=""
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <img
                  className="h-auto max-w-full rounded-xl"
                  src="https://i.ibb.co.com/JRwnLPxj/590455340-10225465711429591-7057565266677373155-n.jpg"
                  alt=""
                />
              </div>
              <div>
                <img
                  className="h-auto max-w-full rounded-xl"
                  src="https://i.ibb.co.com/GjPvyvQ/600339394-122107036467154307-5553515012301177600-n.jpg"
                  alt=""
                />
              </div>
              <div>
                <img
                  className="h-auto max-w-full rounded-xl"
                  src="https://i.ibb.co.com/ycn2G7WD/602916722-122108662089154307-3876809675665251419-n.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
          {/* payment */}
          <div className="hidden flex flex-wrap justify-center gap-8 items-center  transition-all duration-500">
            <div className="group bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all w-64 grayscale hover:grayscale-0">
              <img
                src={bkash_logo}
                alt="bKash"
                className="h-16 mx-auto object-contain mb-3"
              />
              {/* <p className="text-slate-400 text-xs font-mono group-hover:text-pink-600">
                01984839526 (Merchant)
              </p> */}
            </div>
            <div className="group bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all w-64 grayscale hover:grayscale-0">
              <img
                src={nagad_logo}
                alt="Nagad"
                className="h-16 mx-auto object-contain mb-3"
              />
              {/* <p className="text-slate-400 text-xs font-mono group-hover:text-orange-600">
                01984839526 (Merchant)
              </p> */}
            </div>
            <div className="group bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all w-64 grayscale hover:grayscale-0">
              <img
                src={rocket_logo}
                alt="Rocket"
                className="h-16 mx-auto object-contain mb-3"
              />
              {/* <p className="text-slate-400 text-xs font-mono group-hover:text-purple-600">
                01984839526 (Merchant)
              </p> */}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Ticket Style */}
      <section className="py-24 bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-serif">
              Get Your Pass
            </h2>
          </div>

          {/* The Ticket */}
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
            {/* Left Side (Main) */}
            <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-100 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase rounded">
                    General
                  </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase rounded">
                    Limited Seats
                  </span>
                </div>
                <h3 className="text-4xl font-bold text-slate-900 mb-2">
                  Reunion Entry Pass
                </h3>
                <p className="text-slate-500 mb-8">
                  Full access to the event, dinner, and alumni kit.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Exclusive Alumni T-Shirt",
                    "Gala Dinner Buffet",
                    "Gift Hamper",
                    "Cultural Program Access",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center text-slate-700 font-medium"
                    >
                      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-3">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/registration"
                  className="inline-block bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors w-full md:w-auto text-center"
                >
                  Registration Now
                </Link>
              </div>
            </div>

            {/* Dotted Divider */}
            <div className="relative hidden md:flex flex-col items-center justify-center">
              <div className="w-8 h-8 bg-[#FDFBF7] rounded-full -mt-4"></div>
              <div className="h-full border-l-2 border-dashed border-slate-300 mx-4"></div>
              <div className="w-8 h-8 bg-[#FDFBF7] rounded-full -mb-4"></div>
            </div>

            {/* Right Side (Visual/QR placeholder) */}
            <div className="bg-slate-900 p-8 md:w-64 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
              {/*  <div className="w-24 h-24 bg-white p-2 rounded-lg mb-4">
                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate-400 text-center leading-tight">
                  QR Code will be generated
                </div>
              </div> */}
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                Fee
              </p>
              <p className="text-white text-2xl font-bold">1000 Tk</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Clean Finish */}
      <section className="py-24 bg-slate-900 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif">
            Ready to reconnect?
          </h2>
          <p className="text-slate-400 text-xl mb-10">
            Don't let this once-in-a-lifetime opportunity pass you by.
          </p>
          <Link
            to="/registration"
            className="inline-block bg-amber-500 text-slate-900 font-bold px-12 py-5 rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl text-lg"
          >
            Get Your Ticket Now
          </Link>
        </div>
      </section>
    </div>
  );
};
