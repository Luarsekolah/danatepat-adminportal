import { Bell, Search, User, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <Input 
          placeholder="Cari program, merchant, transaksi..." 
          className="pl-12 h-11 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl transition-all"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            2
          </span>
        </button>

        <div className="h-8 w-px bg-slate-200" />

        {/* User Profile */}
        <button className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-all group">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <div className="text-left hidden md:block">
            <p className="text-sm font-bold text-slate-900 leading-none">Admin Utama</p>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Administrator</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
        </button>
      </div>
    </header>
  );
}
