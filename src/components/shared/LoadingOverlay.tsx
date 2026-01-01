

export const LoadingOverlay = ({ text = "Loading..." }) => {
    return (
        <div className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[1px]">

            {/* স্পিনার ডিজাইন */}
            <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>

            {/* টেক্সট */}
            <p className="text-white text-lg font-semibold tracking-wide animate-pulse">
                {text}
            </p>
        </div>
    )
}
