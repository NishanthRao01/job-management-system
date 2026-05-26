import { Outlet, Link, useLocation } from 'react-router-dom';
import { Info } from 'lucide-react';

const AuthLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="w-full px-6 py-4 max-w-7xl mx-auto flex items-center justify-between border-b border-zinc-200/40">
        <Link to="/" className="flex items-center group transition-opacity hover:opacity-90">
          <img 
            src="/brand/logos/handlr-logo-black.svg" 
            alt="Handlr Logo" 
            className="h-6 w-auto select-none"
          />
        </Link>
        <Link
          to="/how-it-works"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:shadow-sm active:scale-[0.985]"
        >
          <Info className="w-3.5 h-3.5" />
          How It Works
        </Link>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950">
              {isLogin ? 'Welcome back to Handlr' : isRegister ? 'Create your Handlr account' : 'Handlr Platform'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              {isLogin
                ? 'Manage applications, clients, and career workflows'
                : isRegister
                  ? 'Get started today to streamline your application pipeline'
                  : 'We Handle. You Grow.'}
            </p>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
          <div className="bg-white py-8 px-6 border border-zinc-200/50 sm:rounded-xl shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-200 text-center text-xs text-zinc-400">
        &copy; {new Date().getFullYear()} Handlr. We Handle. You Grow. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
