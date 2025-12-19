import { DashboardLayout } from "@/components/Layout";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-[#1E6CF6]">
          <div className="animate-pulse">🚧</div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-500 max-w-md">
          This page is currently under development. Please continue prompting to
          fill in this page contents.
        </p>
      </div>
    </DashboardLayout>
  );
}
