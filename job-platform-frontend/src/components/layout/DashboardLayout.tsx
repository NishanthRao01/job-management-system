import { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, LayoutDashboard, Users, CreditCard, MessageSquare, Menu, X } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: `/dashboard/${user?.role}`, icon: LayoutDashboard },
    ...(user?.role === 'client' ? [{ name: 'Subscription', path: '/dashboard/client/subscription', icon: CreditCard }] : []),
    ...(user?.role === 'client' ? [{ name: 'Messages', path: '/dashboard/client/chat', icon: MessageSquare }] : []),
    ...(user?.role === 'associate' ? [{ name: 'My Clients', path: '/dashboard/associate/clients', icon: Users }] : []),
    ...(user?.role === 'associate' ? [{ name: 'Messages', path: '/dashboard/associate/chat', icon: MessageSquare }] : []),
  ];

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-100 bg-[#fafafa]/50">
        <Link to="/" className="flex items-center group transition-opacity hover:opacity-90">
          <img 
            src="/brand/logos/handlr-logo-black.svg" 
            alt="Handlr Logo" 
            className="h-6 w-auto select-none"
          />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-5">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 group ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center mr-2.5 transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-400 group-hover:text-zinc-700'
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-zinc-100 bg-[#fafafa]">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-bold text-xs select-none">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-2.5 overflow-hidden">
              <p className="text-xs font-bold text-zinc-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-zinc-400 truncate capitalize flex items-center gap-1 mt-0.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 bg-white border-r border-zinc-100 flex-col fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-all duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-60 bg-white border-r border-zinc-100 flex flex-col z-50 lg:hidden transform transition-transform duration-200 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-60">
        <header className="h-16 bg-white border-b border-zinc-100 flex items-center px-6 sm:px-8 justify-between z-10 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-zinc-500 hover:text-zinc-800 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Mobile Header Logo */}
            <div className="lg:hidden flex items-center select-none">
              <img 
                src="/brand/logos/handlr-logo-black.svg" 
                alt="Handlr" 
                className="h-5.5 w-auto"
              />
            </div>

            <div className="hidden sm:block">
              <h2 className="text-xs sm:text-sm font-bold text-zinc-800 tracking-tight">
                {navItems.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-zinc-100 text-zinc-700 capitalize border border-zinc-200">
              {user?.role}
            </span>
            <div className="text-xs text-zinc-400 font-semibold hidden md:block">
              Welcome back, <span className="text-zinc-700 font-bold">{user?.name?.split(' ')[0]}</span> 👋
            </div>
          </div>
        </header>

        <div className="flex-grow overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
