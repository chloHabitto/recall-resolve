import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from 'framer-motion';
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { LibraryPage } from "./pages/LibraryPage";
import { EntryDetailPage } from "./pages/EntryDetailPage";
import { AccountPage } from "./pages/AccountPage";
import { BottomNav } from "./components/BottomNav";
import { LogExperience } from "./components/LogExperience";
import { useEntries } from "./hooks/useEntries";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const [showLogModal, setShowLogModal] = useState(false);
  const { addEntry } = useEntries();

  const handleSaveEntry = (entry: Parameters<typeof addEntry>[0]) => {
    addEntry(entry);
    setShowLogModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage onLogClick={() => setShowLogModal(true)} />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<LibraryPage onLogClick={() => setShowLogModal(true)} />} />
        <Route path="/entry/:id" element={<EntryDetailPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <BottomNav onLogClick={() => setShowLogModal(true)} />
      
      <AnimatePresence>
        {showLogModal && (
          <LogExperience
            onSave={handleSaveEntry}
            onClose={() => setShowLogModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
