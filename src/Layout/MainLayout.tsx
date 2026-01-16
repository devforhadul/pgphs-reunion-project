import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

export default function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const currentVersion = "1.3.0";
    const savedVersion = localStorage.getItem("app_version");

    if (savedVersion !== currentVersion) {
      // যদি ভার্সন না মিলে, তবে ক্যাশ ক্লিয়ার করে পেজ রিলোড দিবে
      localStorage.setItem("app_version", currentVersion);

      // ব্রাউজারের হার্ড রিফ্রেশ (এটি ক্যাশ ক্লিয়ার করতে বাধ্য করে)
      window.location.reload();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main /* className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8" */>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
