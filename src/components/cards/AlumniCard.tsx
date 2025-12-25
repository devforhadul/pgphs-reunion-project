import type { RegistrationData } from "@/types";
import type { RefObject } from "react";
import QRCode from "react-qr-code";

interface ReunionUSer {
  user: RegistrationData;
  cardRef: RefObject<HTMLDivElement | null>;
}

const AlumniCard = ({ user, cardRef }: ReunionUSer) => {
  return (
    <>
      <div
        ref={cardRef}
        className="relative w-full max-w-[420px] bg-[#FFFDF5] rounded-md overflow-hidden  shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] isolate"
      >
        {/* Background Blobs/Gradients */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#D8B4E2]/40 rounded-full blur-[80px]" />
        <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-[#FFF8DC]/60 rounded-full blur-[60px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#E0F7FA]/50 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] left-[-50px] w-[150px] h-[150px] bg-[#FFF3E0]/40 rounded-full blur-[50px]" />

        {/* Decorative Circles */}
        <div className="absolute top-[28%] left-[10%] w-10 h-2.5 bg-[#D8B4E2] rounded-full -rotate-45 opacity-60" />
        <div className="absolute top-[32%] right-[10%] w-[15px] h-[15px] border-2 border-[#D8B4E2] rounded-full opacity-60" />
        <div className="absolute bottom-[28%] right-[8%] w-[30px] h-2 bg-[#D8B4E2] rounded-full -rotate-45 opacity-60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-8 pb-12 pt-8">
          {/* Logo Section */}
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm mb-6 flex items-center gap-2 border border-green-100/50">
            <div className="flex flex-col items-end leading-none border-r border-green-200 pr-2">
              <span className="text-green-600 font-extrabold text-xl tracking-tighter">
                Reunion 2026
              </span>
              {/* <span className="text-[6px] text-green-700 uppercase tracking-widest">
                  Est. 7th April, 1945
                </span> */}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-green-600 font-bold text-sm tracking-wide">
                Parshuram
              </span>
              <span className="text-green-500 text-[8px] uppercase tracking-wider font-semibold">
                Gov. Pilot High
              </span>
              <span className="text-green-600 font-bold text-[10px] tracking-wide uppercase">
                School
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 text-center leading-tight mb-8 font-display">
            Meet Our <br />
            <span className="relative inline-block">
              Alumni
              {/* Underline/Decoration if needed, keeping it clean for now */}
            </span>
          </h1>

          {/* Image Container with Glow Effect */}
          <div className="relative mb-10 group">
            {/* Outer glow ring */}
            <div className="absolute inset-0 bg-linear-to-tr from-purple-200/50 to-blue-200/50 rounded-full blur-xl scale-110 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Inner white border wrapper */}
            <div className="relative w-56 h-56 rounded-full p-2 bg-white/40 backdrop-blur-sm shadow-xl ring-1 ring-white/60">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative ">
                <img
                  src={user.photo}
                  alt={user.fullName}
                  className="w-full h-full object-fill"
                />
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div
            className="w-full text-left space-y-1 border-l-4 border-[#E6CDE] pl-3"
          >
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              {user.fullName}
            </h2>

            <div className="space-y-1 pt-1">
              <p className="text-lg font-semibold text-gray-800">
                Reg. No: {user.reg_id}
              </p>

              <p className="text-base text-gray-700 font-medium leading-relaxed">
                SSC Batch: {user.graduationYear}
              </p>

              <div className="flex items-start">
                <div className=" space-y-1 flex-2 self-start">
                  <p className="text-sm font-semibold text-gray-600 tracking-wide uppercase">
                    Address: {user.address}
                  </p>
                </div>
                <div
                  /* className=" bg-white p-2 rounded-xl mx-auto md:mx-0 w-16 h-16 flex items-center justify-center shadow-inner" */
                  className="flex flex-1 justify-end"
                >
                  <QRCode
                    value={"forhad"}
                    size={60}
                    level="L"
                    fgColor="#000000"
                    bgColor="#FFFFFF"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer URL */}
        <div className="absolute bottom-4 right-6">
          <div>
            <a
              href="https://pgmphs-reunion.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-green-600 transition-colors font-medium tracking-wide"
            >
              www.pgmphs-reunion.com
            </a>
          </div>
        </div>
      </div>

      <div className=" hidden flex justify-center items-center   p-4">
        {/* Main Card Container */}
        {/* Styling: max-w-xs (কমপ্যাক্ট), bg-white, rounded-xl, shadow-2xl */}
        <div className="w-full max-w-xs bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header Section: Feni Polytechnic Alumni */}
          {/* Styling: Dark Blue Header (bg-blue-800), text-white, flex for logo/text alignment */}
          <div className="bg-blue-800 text-white flex items-center p-3">
            {/* Logo Placeholder (চিত্রের লোগোর জন্য) */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 border-2 border-blue-900">
              {/* এখানে আপনি লোগো img ট্যাগ ব্যবহার করতে পারেন */}
              <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xl font-serif">
                P
              </div>
            </div>

            <h1 className="text-lg font-semibold tracking-wide">
              PGMPHS Reunion 2026
            </h1>
          </div>

          {/* Card Body: Photo and Name */}
          <div className="py-6 px-4">
            {/* Photo Container */}
            {/* Styling: w-32/h-40 (লম্বা ছবি), mx-auto, border/shadow */}
            <div className="w-32 h-40 mx-auto my-4 border border-gray-300 shadow-md rounded-md overflow-hidden">
              <img
                src={user?.photo}
                alt={user?.fullName}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>

            {/* Name */}
            <p className="text-xl font-bold uppercase text-center text-blue-800 mb-5 tracking-wider">
              {user?.fullName}
            </p>
          </div>

          {/* Details Grid: REG NO, DEPT, SESSION */}
          {/* Styling: bg-blue-50, Grid layout for Label/Value alignment */}
          <div className="bg-blue-50 p-4 space-y-3">
            {/* Registration Number */}
            <div className="grid grid-cols-2">
              <span className="font-bold text-gray-700">REG NO</span>
              <span className="text-right text-gray-900 font-medium tracking-wider">
                {user?.reg_id}
              </span>
            </div>

            {/* Department */}
            <div className="grid grid-cols-2">
              <span className="font-bold text-gray-700">SSC Batch</span>
              <span className="text-right text-gray-900 font-medium">
                {user?.graduationYear}
              </span>
            </div>

            {/* Session */}
            <div className="grid grid-cols-2">
              <span className="font-bold text-gray-700">Address</span>
              <span className="text-right text-gray-900 font-medium">
                {user?.address}
              </span>
            </div>
          </div>

          {/* Footer/Status Bar: Valid for Reunion */}
          {/* Styling: Green Status (bg-green-100), text-green-700, rounded-b-xl */}
          <div className="bg-green-100 text-green-700 font-semibold text-center py-3 rounded-b-xl">
            <span className="flex items-center justify-center">
              {/* Checkmark Icon (Tailwind Heroicons) */}
              <span className="text-sm">
                এন্ট্রি টিকিট সংগ্রহের জন্য এই কার্ডটি আবশ্যক
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniCard;
