import { Link } from "react-router-dom";

// --- Custom SVG Icons ---
const FaCheckCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path
      fill="currentColor"
      d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
    />
  </svg>
);

// const FaArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
//     <path fill="currentColor" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L370.7 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h338.7L233.3 393.3c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
//   </svg>
// );

// const FaDownload = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
//     <path fill="currentColor" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zM432 456c-13.3 0-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24s-10.7 24-24 24z"/>
//   </svg>
// );

// const FaHome = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
//     <path fill="currentColor" d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>
//   </svg>
// );

export const ConfirmationPage = () => {
  // const [showConfetti, setShowConfetti] = useState(true);

  // // Simple visual effect timer
  // useEffect(() => {
  //   const timer = setTimeout(() => setShowConfetti(false), 5000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div className="min-h-screen py-8 bg-slate-900 text-white font-sans overflow-hidden flex items-center justify-center relative">
      {/* --- Ambient Background Effects --- */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      {/* --- Confetti Effect (CSS Based) --- */}
      {/* {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {[...Array(20)].map((_, i) => (
             <div 
                key={i}
                className="absolute w-2 h-2 bg-amber-400 rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 2 + 1}s`,
                  animationDelay: `${Math.random()}s`
                }}
             ></div>
           ))}
        </div>
      )} */}

      {/* --- Main Content Card --- */}
      <div className="relative z-10 w-full max-w-2xl px-4">
        <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-amber-500/20 shadow-[0_0_60px_rgba(245,158,11,0.15)] text-center transform transition-all hover:scale-[1.01]">
          {/* Success Icon */}
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-2xl">
              <FaCheckCircle className="text-white text-5xl drop-shadow-md" />
            </div>
            {/* Decorative particles around icon */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-amber-200 rounded-full animate-bounce delay-150"></div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif">
            Thank You!
          </h1>
          <p className="text-xl text-amber-400 font-medium mb-6">
            Registration Submitted Successfully
          </p>
          {/* {showSuccessMessage && ( */}
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-800 dark:text-green-200">
              ✓ Payment completed successfully! Your registration is confirmed.
            </p>
          </div>
        {/* )} */}
          <p className="text-xl text-amber-400 font-medium mb-6">
            Your number Registration is {}
          </p>

          <p className="text-slate-300 leading-relaxed mb-10 max-w-lg mx-auto">
            আপনার রেজিস্ট্রেশন তথ্য আমাদের কাছে জমা হয়েছে। আপনার পেমেন্ট ভেরিফাই
            করার পর আপনার ড্যাশবোর্ডে স্ট্যাটাস আপডেট হয়ে যাবে।
          </p>

          {/* Summary / Next Steps Box */}
          <div className="bg-slate-900/50 rounded-xl p-6 mb-10 border border-white/5 text-left">
            <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
              What's Next?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  1
                </span>
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Verification:</strong> আমাদের
                  টিম আপনার পেমেন্ট Txn ID চেক করবে (২৪ ঘন্টার মধ্যে)।
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  2
                </span>
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Approval:</strong> পেমেন্ট
                  কনফার্ম হলে আপনি SMS এবং ইমেইল পাবেন।
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  3
                </span>
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Ticket:</strong> এরপর
                  ড্যাশবোর্ড থেকে আপনার ডিজিটাল এন্ট্রি টিকিট ডাউনলোড করতে
                  পারবেন।
                </p>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/25 group"
            >
              Go to Dashboard
              {/* <FaArrowRight className="group-hover:translate-x-1 transition-transform" /> */}
            </Link>

            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all duration-300"
            >
              {/* <FaHome  /> */}
              Back to Home
            </Link>
          </div>

          <p className="mt-8 text-xs text-slate-500">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@pgphsreunion.com"
              className="text-amber-500 hover:underline"
            >
              pgphsalumniassociation@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
