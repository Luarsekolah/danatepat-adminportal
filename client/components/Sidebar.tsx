import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Store,
  Search,
  Users,
  Settings,
  Layers,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    label: "MENU UTAMA",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      {
        name: "Program Management",
        icon: Briefcase,
        path: "/dashboard/programs",
      },
      {
        name: "Merchant Management",
        icon: Store,
        path: "/dashboard/merchants",
      },
      { name: "Audit Explorer", icon: Search, path: "/dashboard/audit" },
      { name: "User & Role Management", icon: Users, path: "/dashboard/users" },
    ],
  },
  {
    label: "SISTEM",
    items: [
      { name: "Settings & Logs", icon: Settings, path: "/dashboard/settings" },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-30">
      {/* Brand Logo */}
      <div className="p-6 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1E6CF6] rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-slate-800 tracking-tight">
            DANA TEPAT
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        {menuItems.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-8 last:mb-0">
            <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group",
                      isActive
                        ? "bg-[#1E6CF6] text-white shadow-lg shadow-blue-500/20"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "w-5 h-5 transition-transform group-hover:scale-110",
                          isActive ? "text-white" : "text-slate-400",
                        )}
                      />
                      <span className="text-sm font-semibold">{item.name}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-white/50" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Status */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-3 bg-blue-50 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
            Blockchain Verified
          </span>
        </div>
      </div>
    </aside>
  );
}
