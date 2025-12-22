import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main /* className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8" */>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
