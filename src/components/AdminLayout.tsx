import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Users, FileText, ShoppingCart, Building, BarChart3, LogOut, Cog, DollarSign, Home, User, ChevronDown
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const menuItems = [
  { title: 'Dashboard', icon: Home, path: '/admin/dashboard' },
  { title: 'Leads', icon: Users, path: '/admin/leads' },
  { title: 'Orçamentos', icon: FileText, path: '/admin/orcamentos' },
  { title: 'Pedidos', icon: ShoppingCart, path: '/admin/pedidos' },
  { title: 'Financeiro', icon: DollarSign, path: '/admin/financeiro' },
  { title: 'Clientes', icon: Building, path: '/admin/clientes' },
  { title: 'Relatórios', icon: BarChart3, path: '/admin/relatorios' },
  { title: 'Configurações', icon: Cog, path: '/admin/configuracoes' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-primary/80 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src="https://www.websidesistemas.com.br/imagens/logo_webside.png"
              alt="Webside Sistemas"
              className="h-8 w-auto object-contain cursor-pointer"
              onClick={() => navigate('/admin/dashboard')}
            />
            <span className="hidden md:inline text-white/60 text-sm">|</span>
            <span className="hidden md:inline text-white font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && user && (
              <div className="flex items-center gap-2 text-white/80">
                <User className="h-4 w-4" />
                <span className="hidden md:inline text-sm">{user.nome}</span>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-white/5 backdrop-blur min-h-[calc(100vh-57px)]">
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-white/10 z-40 px-2 py-2">
          <div className="flex justify-around">
            {menuItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                    isActive ? 'text-accent' : 'text-white/70'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-24 md:pb-6">
          <div className="bg-white rounded-2xl p-6 min-h-[calc(100vh-120px)] shadow-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;