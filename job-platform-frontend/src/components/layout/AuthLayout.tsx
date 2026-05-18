import { Outlet, Link, useLocation } from 'react-router-dom';
import { Briefcase, Info } from 'lucide-react';

const AuthLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col">
      {/* Top Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <Briefcase className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Hire<span className="text-indigo-600">Sync</span>
          </span>
        </Link>
        <Link
          to="/how-it-works"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
        >
          <Info className="w-4 h-4" />
          How It Works
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center py-8 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLogin ? 'Welcome Back' : isRegister ? 'Get Started' : 'HireSync'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {isLogin
                ? 'Manage applications, clients, and workflow'
                : isRegister
                  ? 'Create your account to start tracking jobs'
                  : 'Job Application Management Platform'}
            </p>
          </div>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-5 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200/60">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} HireSync. Built with MERN Stack.
      </div>
    </div>
  );
};

export default AuthLayout;
