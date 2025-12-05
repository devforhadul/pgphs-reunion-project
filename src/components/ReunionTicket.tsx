import type { RegistrationData } from "@/types";

interface ReunionUSer {
  user: RegistrationData;
}

const AlumniIDCard = ({ user }: ReunionUSer) => {
  return (
    // Outer Container (স্ক্রিনকে মাঝখানে আনতে)
    <div className="flex justify-center items-center   p-4">
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
            <span className="text-sm">এন্ট্রি টিকিট সংগ্রহের জন্য এই কার্ডটি আবশ্যক</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlumniIDCard;
