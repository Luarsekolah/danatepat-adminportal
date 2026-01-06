import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/Dashboard";
import Login from "./pages/Login";
import Programs from "./pages/Programs";
import Merchants from "./pages/Merchants";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import Settings from "./pages/SettingLog";
import Audit from "./pages/Audit";
import { ProtectedRoute } from "./components/layout/protected-route";
import { PublicRoute } from "./components/layout/public-route";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="dashboard" element={<ProtectedRoute />}>
            <Route index element={<Index />} />
            <Route path="programs" element={<Programs />} />
            <Route path="merchants" element={<Merchants />} />
            <Route path="audit" element={<Audit />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/" element={<PublicRoute />}>
            <Route index element={<Login />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
