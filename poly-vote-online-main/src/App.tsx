
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import VotePage from "./pages/VotePage";
import ResultsPage from "./pages/ResultsPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/elections" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <VotePage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vote" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <VotePage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vote/:electionId" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <VotePage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/results" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ResultsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/results/:electionId" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ResultsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
