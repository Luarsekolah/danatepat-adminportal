import "./global.css";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/Dashboard";
import Login from "./pages/Login";
import Programs from "./pages/programs";
import ProgramDetail from "./pages/programs/detail";
import Merchants from "./pages/Merchants";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import Settings from "./pages/SettingLog";
import Audit from "./pages/Audit";
import { ProtectedRoute } from "./components/layout/protected-route";
import { PublicRoute } from "./components/layout/public-route";
import ProgramMerchant from "./pages/programs/merchant";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner richColors />
      <BrowserRouter>
        <Routes>
          <Route path="dashboard" element={<ProtectedRoute />}>
            <Route index element={<Index />} />
            <Route path="programs" element={<Programs />} />
            <Route path="programs/:programId" element={<ProgramDetail />} />
            <Route
              path="programs/merchant/:programId"
              element={<ProgramMerchant />}
            />
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
