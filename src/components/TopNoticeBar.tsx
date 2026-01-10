import { useState } from "react";
import Marquee from "react-fast-marquee"; // ইমপোর্ট করো
import { X } from "lucide-react";

const TopNoticeBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-50 bg-blue-900 text-white shadow-md">
      <div className="flex items-center justify-between h-12 px-2">
        {/* বাম পাশের ব্যাজ */}
        <div className="bg-red-600 text-[10px] md:text-xs font-bold px-2 py-1 rounded shadow z-10 whitespace-nowrap mr-2">
          NOTICE
        </div>

        {/* মাঝখানের চলমান লেখা */}
        <div className="flex-1 overflow-hidden">
          <Marquee
            pauseOnHover={true} // মাউস নিলে থামবে
            speed={80} // স্পিড কন্ট্রোল (কমলে স্লো, বাড়লে ফাস্ট)
            gradient={false} // দুই পাশে ফেইড ইফেক্ট বন্ধ করা
          >
            <span className="mx-4 text-base font-medium">
              📢 পরশুরাম সরকারি পাইলট উচ্চ বিদ্যালয় পুনর্মিলনী ২০২৬ নিবন্ধন
              শুরু! নিবন্ধনের শেষ তারিখ ২০ জানুয়ারি ২০২৬
            </span>
            <span className="mx-4 text-sm text-yellow-300">
              {/* ⚠️ জরুরি নোটিশ: সার্ভার মেইনটেইনেন্সের কারণে সাময়িকভাবে ছবি আপলোড
              বন্ধ আছে। রেজিস্ট্রেশনে সমস্যা হলে অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা
              করুন। ধন্যবাদ। */}
              ⚡ Bkash Payment Gateway is now active.
            </span>
            <span className="mx-4 text-sm">Call 01612929275 for support.</span>
          </Marquee>
        </div>

        {/* ক্লোজ বাটন */}
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 z-10 bg-blue-800 hover:bg-red-500 p-1 rounded-full transition"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopNoticeBar;
