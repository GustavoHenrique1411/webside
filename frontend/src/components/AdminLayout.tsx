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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-primary/80 backdrop-blur">
        <div className="flex items-center justify-between px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <img
              src="/logo_webside.png"
              alt="Webside Sistemas"
              className="h-6 sm:h-8 w-auto object-contain cursor-pointer flex-shrink-0"
              onClick={() => navigate('/admin/dashboard')}
            />
            <span className="hidden md:inline text-white/60 text-sm flex-shrink-0">|</span>
            <span className="hidden sm:inline text-white font-medium text-sm md:text-base truncate">{title}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {isAuthenticated && user && (
              <div className="hidden sm:flex items-center gap-2 text-white/80">
                <User className="h-4 w-4" />
                <span className="hidden lg:inline text-sm truncate max-w-[150px]">{user.nome}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white/80 hover:text-white hover:bg-white/10 px-2 sm:px-4"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-white/5 backdrop-blur min-h-[calc(100vh-57px)]">
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
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-white/10 z-40 safe-area-inset-bottom">
          <div className="grid grid-cols-4 gap-1 px-1 py-2">
            {menuItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center justify-center gap-0.5 p-1.5 rounded-lg transition-colors ${
                    isActive ? 'text-accent bg-white/10' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs truncate w-full text-center">{item.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 p-3 sm:p-4 md:p-6 pb-20 lg:pb-6">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 min-h-[calc(100vh-120px)] shadow-lg w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;