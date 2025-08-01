import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import RoleSelection from "./pages/RoleSelection";
import Dashboard from "./pages/Dashboard";
import Rent from "./pages/Rent";
import Documents from "./pages/Documents";
import Maintenance from "./pages/Maintenance";
import Chat from "./pages/Chat";
import Payments from "./pages/Payments";
import Properties from "./pages/Properties";
import Tenants from "./pages/Tenants";
import Messaging from "./pages/Messaging";
import Calendar from "./pages/Calendar";
import Deposits from "./pages/Deposits";
import Verification from "./pages/Verification";
import TenantJoin from "./pages/TenantJoin";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* All other routes redirect to landing page for waitlist mode */}
          <Route path="*" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
