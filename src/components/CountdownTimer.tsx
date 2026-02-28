
// import React, { useState, useEffect } from 'react';

// interface CountdownTimerProps {
//   targetDate: Date;
// }

// export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
//   const [timeLeft, setTimeLeft] = useState({
//     hours: 0,
//     minutes: 0,
//     seconds: 0
//   });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date().getTime();
//       const distance = targetDate.getTime() - now;

//       if (distance < 0) {
//         clearInterval(timer);
//         return;
//       }

//       setTimeLeft({
//         hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
//         minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
//         seconds: Math.floor((distance % (1000 * 60)) / 1000)
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [targetDate]);

//   const TimeUnit = ({ value, label }: { value: number; label: string }) => (
//     <div className="flex flex-col items-center">
//       <div className="glass px-6 py-4 rounded-2xl w-24 h-24 flex items-center justify-center text-4xl font-bold border-white/5">
//         {value.toString().padStart(2, '0')}
//       </div>
//       <span className="mt-2 text-xs font-medium text-zinc-500 uppercase tracking-widest">{label}</span>
//     </div>
//   );

//   return (
//     <div className="flex space-x-4 md:space-x-6">
//       <TimeUnit value={timeLeft.hours} label="Hours" />
//       <TimeUnit value={timeLeft.minutes} label="Mins" />
//       <TimeUnit value={timeLeft.seconds} label="Secs" />
//     </div>
//   );
// };
