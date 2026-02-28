// import  { useMemo } from 'react';

// const GraduationStats = ({ registrations }: { registrations: RegistrationData[] }) => {
//   const sortedStats = useMemo(() => getGraduationYearStats(registrations), [registrations]);

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//       <h3 className="text-xl font-bold mb-4 text-blue-600">Top Participating Batches</h3>
      
//       <div className="space-y-4">
//         {sortedStats.slice(0, 5).map((stat, index) => (
//           <div key={stat.year} className="flex flex-col">
//             <div className="flex justify-between items-center mb-1">
//               <span className="font-semibold text-gray-700">Batch of {stat.year}</span>
//               <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
//                 {stat.count} Members
//               </span>
//             </div>
//             {/* ভিজ্যুয়াল বার চার্ট */}
//             <div className="w-full bg-gray-200 rounded-full h-2.5">
//               <div 
//                 className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
//                 style={{ width: `${(stat.count / registrations.length) * 100}%` }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {sortedStats.length === 0 && (
//         <p className="text-gray-500 text-center py-4">No registrations yet.</p>
//       )}
//     </div>
//   );
// };

// export default GraduationStats;