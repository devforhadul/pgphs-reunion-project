
export const Maintainance = () => {
//   const [estimatedEndTime] = useState(
//     new Date(Date.now() + 4 * 60 * 60 * 1000 + 15 * 60 * 1000),
//   );
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center px-4 py-12 md:py-24">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-2xl z-10 space-y-16">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>SYSTEM MAINTENANCE ACTIVE</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-tight">
             MAINTENANCE <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Now
            </span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
            Our registration system is currently undergoing a planned upgrade to
            improve performance and security. We'll be back shortly.
          </p>
        </div>

        {/* <div className="flex flex-col items-center space-y-12">
          <div className="space-y-6 text-center">
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-400">
              Estimated Time Remaining
            </h2>
            <CountdownTimer targetDate={estimatedEndTime} />
          </div>

          <div className="w-full">
            <NotificationForm />
          </div>
        </div> */}
      </div>

      <footer className="mt-auto pt-12 text-zinc-500 text-sm">
        &copy; {new Date().getFullYear()} Registration Portal. All rights
        reserved.
      </footer>
    </div>
  );
};
