import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import RegionIndex from "./pages/RegionIndex";
import Anfahrt from "./pages/Anfahrt";
import RegionArticle from "./pages/RegionArticle";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AGB from "./pages/AGB";
import InstallPrompt from "./components/InstallPrompt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/galerie" element={<Index initialGalleryView="photos" startAtGallery />} />
          <Route path="/galerie/info" element={<Index initialGalleryView="info" startAtGallery />} />
          <Route path="/gallery" element={<Index initialGalleryView="photos" startAtGallery />} />
          <Route path="/gallery/info" element={<Index initialGalleryView="info" startAtGallery />} />
          <Route path="/anfahrt" element={<Anfahrt />} />
          <Route path="/directions" element={<Anfahrt />} />
          <Route path="/region" element={<RegionIndex />} />
          <Route path="/region/:slug" element={<RegionArticle />} />
          <Route path="/admin" element={<Auth />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/agb" element={<AGB />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <InstallPrompt />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
