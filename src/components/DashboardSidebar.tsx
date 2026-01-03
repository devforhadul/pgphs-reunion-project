// import { cn } from "@/lib/utils"

// interface SidebarItemProps {
//   label: string
//   isActive?: boolean
//   isLogout?: boolean
// }

// function SidebarItem({ label, isActive, isLogout }: SidebarItemProps) {
//   return (
//     <div
//       className={cn(
//         "px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium",
//         isActive && "bg-[#2196F3] text-white shadow-sm",
//         !isActive && !isLogout && "text-slate-600 hover:bg-slate-50",
//         isLogout && "text-red-500 hover:bg-red-50 mt-1",
//       )}
//     >
//       {label}
//     </div>
//   )
// }

export function DashboardSidebar() {
  const items = [
    { label: "Home", isActive: true },
    { label: "ID Card" },
    { label: "Photo Card" },
    { label: "Payment Information" },
    { label: "Invitation" },
  ]

  return (
    <div className="w-64 bg-white border border-[#e5e7eb] rounded-lg p-3 flex flex-col h-fit">
      <h2 className="text-[#3b82f6] text-3xl font-medium px-4 pt-2 pb-4 text-center">Dashboard</h2>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <div
            key={item.label}
            className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium ${
              item.isActive ? "bg-[#3b82f6] text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="px-4 py-2 text-red-500 cursor-pointer text-sm font-medium hover:bg-red-50 rounded-lg">
          Log Out
        </div>
      </div>
    </div>
  )
}
