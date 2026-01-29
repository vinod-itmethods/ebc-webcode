import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useEffect } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Index from "./pages/Index";
import FAQ from "./pages/FAQ";
import Partners from "./pages/Partners";
import RequestBriefing from "./pages/RequestBriefing";
import PartnerLogin from "./pages/PartnerLogin";
import PartnerDashboard from "./pages/PartnerDashboard";
import PortalLogin from "./pages/PortalLogin";
import PortalProvider from "./pages/PortalProvider";
import PortalCustomer from "./pages/PortalCustomer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/request-briefing" element={<RequestBriefing />} />
            <Route path="/partner-login" element={<PartnerLogin />} />
            <Route path="/partner-dashboard" element={<PartnerDashboard />} />
            <Route path="/portal" element={<PortalLogin />} />
            <Route path="/portal/provider" element={<PortalProvider />} />
            <Route path="/portal/customer" element={<PortalCustomer />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
