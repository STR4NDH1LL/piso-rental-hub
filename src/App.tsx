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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/deposits" element={<Deposits />} />
          <Route path="/calendar" element={<Calendar />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
