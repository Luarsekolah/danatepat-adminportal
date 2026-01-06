import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
