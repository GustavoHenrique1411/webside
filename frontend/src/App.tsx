import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/components/NotificationSystem";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Leads from "./pages/admin/Leads";
import Orcamentos from "./pages/admin/Orcamentos";
import Pedidos from "./pages/admin/Pedidos";
import Financeiro from "./pages/admin/Financeiro";
import Clientes from "./pages/admin/Clientes";
import Relatorios from "./pages/admin/Relatorios";
import Configuracoes from "./pages/admin/Configuracoes";
import Perfil from "./pages/admin/Perfil";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import SobreNos from "./pages/sobre-nos";
import Privacidade from "./pages/privacidade";
import ContatosSuporte from "./pages/ContatosSuporte";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sobre-nos" element={<SobreNos />} />
              <Route path="/privacidade" element={<Privacidade />} />
              <Route path="/contatos-suporte" element={<ContatosSuporte />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/leads"
                element={
                  <ProtectedRoute>
                    <Leads />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orcamentos"
                element={
                  <ProtectedRoute>
                    <Orcamentos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/pedidos"
                element={
                  <ProtectedRoute>
                    <Pedidos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/financeiro"
                element={
                  <ProtectedRoute>
                    <Financeiro />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/clientes"
                element={
                  <ProtectedRoute>
                    <Clientes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/relatorios"
                element={
                  <ProtectedRoute>
                    <Relatorios />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/configuracoes"
                element={
                  <ProtectedRoute>
                    <Configuracoes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/perfil"
                element={
                  <ProtectedRoute>
                    <Perfil />
                  </ProtectedRoute>
                }
              />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
