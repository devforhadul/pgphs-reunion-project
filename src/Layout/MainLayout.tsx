import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import OfferModal from "@/components/modal/OfferModal ";
// import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";

export default function MainLayout() {
  const { pathname } = useLocation();
  const [showOffer, setShowOffer] = useState<boolean>(false);

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

  useEffect(() => {
    const offerShown = localStorage.getItem("offerShown");

    if (!offerShown) {
      const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
        setShowOffer(true);
        localStorage.setItem("offerShown", "true");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <main /* className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8" */
        >
          {showOffer && (
            <OfferModal
              onClose={() => setShowOffer(false)}
              imageUrl="https://res.cloudinary.com/dtbyhp01i/image/upload/v1768594939/reunion_2026_pgmphs_epjraf.png"
            />
          )}
          <Outlet />
        </main>
        <Footer />
      </div>
      {/* <SpeedInsights /> */}
    </>
  );
}
