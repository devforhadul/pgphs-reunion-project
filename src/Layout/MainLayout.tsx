import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
// import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

export default function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const currentVersion = _APP_VERSION_;
    const savedVersion = localStorage.getItem("app_v");

    if (savedVersion !== currentVersion) {
      localStorage.setItem("app_v", currentVersion);
      window.location.reload();
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <main /* className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8" */
        >
          <Outlet />
        </main>
        <Footer />
      </div>
      {/* <SpeedInsights /> */}
    </>
  );
}
