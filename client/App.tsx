import * as React from "react";
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Dashboard";
import Login from "./pages/Login";
import Programs from "./pages/Programs";
import Merchants from "./pages/Merchants";
import Users from "./pages/Users";
import PlaceholderPage from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import Settings from "./pages/SettingLog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Index />} />
          <Route path="/" element={<Login />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/merchants" element={<Merchants />} />
          <Route
            path="/audit"
            element={<PlaceholderPage title="Audit Explorer" />}
          />
          <Route path="/users" element={<Users />} />
          <Route
            path="/settings"
            element={<Settings />}
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
