import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ProfileCard } from "@/components/ProfileCard";

export default function UserDashboard() {
  return (
    <main className="min-h-screen bg-[#f1f4f0] p-6 md:p-10 flex items-start justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        <DashboardSidebar />
        <ProfileCard />
      </div>
    </main>
  )
}