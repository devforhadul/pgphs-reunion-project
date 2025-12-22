import React from 'react';

interface ReunionBadgeProps {
  name: string;
  memberId: string;
  imageUrl: string; // URL for the person's photo
  logoUrl?: string; // URL for the FPI logo (optional)
  date?: string;
  location?: string;
}

const ReunionCard: React.FC<ReunionBadgeProps> = ({
  name="Forhad",
  memberId,
  imageUrl = "https://i.ibb.co.com/Qv7rJXvP/forhad-formal.jpg",
  logoUrl,
  date = "26th December-2025",
  location = "FPI Campus"
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Main Card Container */}
      <div className="relative w-[500px] h-[500px] bg-white rounded-full shadow-xl overflow-hidden flex flex-col items-center justify-center">
        
        {/* --- SVG Layer for Frame & Curved Text --- */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <defs>
              {/* Path for the orange ring text */}
              <path id="textCurve" d="M 60,380 A 190,190 0 1,0 440,380" transform="rotate(130, 250, 250)" />
              {/* Path for the bunting string */}
              <path id="buntingString" d="M 40,120 Q 250,220 460,50" />
            </defs>

            {/* The Orange Ring (Open Circle) */}
            {/* Using stroke-dasharray to create the gap on the right */}
            <circle 
              cx="250" 
              cy="250" 
              r="215" 
              fill="none" 
              stroke="#ff7f50" 
              strokeWidth="45"
              strokeDasharray="1000, 350" 
              strokeLinecap="butt"
              transform="rotate(20, 250, 250)"
            />

            {/* Curved Text: Grand Reunion... */}
            <text className="font-bold text-[38px] tracking-wide fill-blue-800" dy="10">
              <textPath href="#textCurve" startOffset="50%" textAnchor="middle">
                Grand Reunion Celebration 2025
              </textPath>
            </text>

            {/* Bunting (Flags) - Drawn manually for positioning */}
            <g transform="translate(0, -20)">
               {/* String */}
               <path d="M 50,110 Q 250,180 430,40" fill="none" stroke="#5d4037" strokeWidth="3" />
               
               {/* Flag 1: Teal */}
               <path d="M 70,125 L 110,135 L 75,180 Z" fill="#4ade80" />
               
               {/* Flag 2: Pink/Red */}
               <path d="M 140,150 L 190,155 L 165,210 Z" fill="#f43f5e" />
               
               {/* Flag 3: Green/Lime */}
               <path d="M 230,158 L 280,158 L 255,215 Z" fill="#84cc16" />
               
               {/* Flag 4: Orange */}
               <path d="M 320,150 L 370,135 L 350,200 Z" fill="#fb923c" />
               
               {/* Flag 5: Purple */}
               <path d="M 400,110 L 440,80 L 440,140 Z" fill="#9333ea" />
            </g>
          </svg>
        </div>

        {/* --- Content Layer --- */}
        <div className="z-20 flex flex-col items-center pt-10 text-center">
          
          {/* User Image */}
          <div className="mb-4 bg-gray-200 w-40 h-48 overflow-hidden shadow-md border-2 border-white">
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <h2 className="text-2xl font-extrabold text-blue-900 mb-1">
            {name}
          </h2>

          {/* Details */}
          <div className="text-blue-900 font-semibold text-sm leading-tight">
            <p>Member ID: {memberId}</p>
            <p>FPI Alumni Association</p>
          </div>

          {/* Date & Location */}
          <div className="mt-2">
            <p className="text-red-600 font-bold text-lg">{date}</p>
            <p className="text-blue-900 font-bold text-sm">{location}</p>
          </div>

        </div>

        {/* --- Logo Layer (Bottom Right) --- */}
        <div className="absolute bottom-[90px] right-[45px] z-30 bg-white rounded-full p-1 shadow-sm">
             {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-full object-contain" />
             ) : (
                // Fallback placeholder if no logo provided
                <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center text-white text-[8px] text-center border-2 border-white">
                    FPI LOGO
                </div>
             )}
        </div>

      </div>
    </div>
  );
};

export default ReunionCard;