import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth';
import { LogIn, User, Briefcase, Eye, EyeOff, Sparkles } from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: 'Client',
    email: 'demo.client@gmail.com',
    password: 'Demo@123',
    icon: User,
    description: 'Browse jobs, track applications, manage subscriptions',
    gradient: 'from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50',
    border: 'border-blue-200 hover:border-blue-400',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    role: 'Associate',
    email: 'demo.associate@gmail.com',
    password: 'Demo@123',
    icon: Briefcase,
    description: 'Apply for clients, manage applications, add notes',
    gradient: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50',
    border: 'border-violet-200 hover:border-violet-400',
    badge: 'bg-violet-100 text-violet-700',
  },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await authApi.login({ email, password });
      login(data.user, data.token);
      navigate(`/dashboard/${data.user.role}`, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string, role: string) => {
    setError('');
    setLoadingDemo(role);
    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      const data = await authApi.login({ email: demoEmail, password: demoPassword });
      login(data.user, data.token);
      navigate(`/dashboard/${data.user.role}`, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Demo login failed. Please try manual login.');
    } finally {
      setLoadingDemo(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h3>
        <p className="mt-1 text-sm text-slate-500">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 animate-scale-in">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all duration-200"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all duration-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign in
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-500">New client?</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 text-sm transition-colors">
            Create an account
          </Link>
        </div>
      </div>

      {/* ─── Demo Accounts Section ───────────────────────────── */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <div className="flex items-center justify-center gap-2 mb-5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Quick Demo Access</h4>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {DEMO_ACCOUNTS.map((account) => {
            const Icon = account.icon;
            return (
              <div
                key={account.role}
                className={`relative rounded-xl border ${account.border} p-4 transition-all duration-300 card-hover ${account.lightBg}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${account.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${account.badge}`}>
                          {account.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{account.description}</p>
                      <div className="mt-2 space-y-0.5">
                        <p className="text-xs text-slate-600">
                          <span className="font-medium text-slate-500">Email:</span>{' '}
                          <code className="font-mono text-xs bg-white/80 px-1.5 py-0.5 rounded">{account.email}</code>
                        </p>
                        <p className="text-xs text-slate-600">
                          <span className="font-medium text-slate-500">Pass:</span>{' '}
                          <code className="font-mono text-xs bg-white/80 px-1.5 py-0.5 rounded">{account.password}</code>
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDemoLogin(account.email, account.password, account.role)}
                    disabled={loadingDemo !== null}
                    className={`flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${account.gradient} hover:opacity-90 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md`}
                  >
                    {loadingDemo === account.role ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-3 h-3 mr-1" />
                        Login
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Login;
