import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import Index from "./pages/Index";
import TaiwanData from "./pages/TaiwanData";
import GlobalData from "./pages/GlobalData";
import CrowdfundingTracker from "./pages/CrowdfundingTracker";
import News from "./pages/News";
import Cases from "./pages/Cases";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Changelog from "./pages/Changelog";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function QueryRedirector() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const to = params.get('path');
    if (to && to.startsWith('/')) {
      navigate(to, { replace: true });
    }
  }, [location.search, navigate]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <QueryRedirector />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/taiwan-data" element={<TaiwanData />} />
            <Route path="/global-data" element={<GlobalData />} />
            <Route path="/crowdfunding-tracker" element={<CrowdfundingTracker />} />
            <Route path="/news" element={<News />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/about" element={<About />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
