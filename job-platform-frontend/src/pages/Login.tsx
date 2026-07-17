import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth';
import { LogIn, User, Briefcase, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const DEMO_ACCOUNTS = [
  {
    role: 'Client',
    email: 'demo.client@gmail.com',
    password: 'Demo@123',
    icon: User,
    description: 'Track job applications and manage career pipeline.',
    badge: 'bg-zinc-100 text-zinc-800 border-zinc-200',
  },
  {
    role: 'Associate',
    email: 'demo.associate@gmail.com',
    password: 'Demo@123',
    icon: Briefcase,
    description: 'Manage applications and updates on behalf of assigned clients.',
    badge: 'bg-[#eff3ff] text-[#4866C8] border-[#4866C8]/20',
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">Sign in to Handlr</h3>
        <p className="mt-1.5 text-xs text-zinc-500">Welcome back. Enter your credentials to access your workspace.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200/50 rounded-lg p-3 text-xs text-red-700 font-medium animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="premium-input focus:ring-1 focus:ring-[#4866C8]/10"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-zinc-600">Password</label>
            <Link to="/forgot-password" className="text-xs font-semibold text-[#4866C8] hover:text-[#3753a8] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="premium-input pr-10 focus:ring-1 focus:ring-[#4866C8]/10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-3.5 h-3.5 mr-2" />
              Sign in
            </>
          )}
        </button>
      </form>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-zinc-100"></div>
        <span className="flex-shrink mx-3 text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">New to Handlr?</span>
        <div className="flex-grow border-t border-zinc-100"></div>
      </div>

      <div className="text-center">
        <Link to="/register" className="text-xs font-semibold text-[#4866C8] hover:text-[#3753a8] transition-colors">
          Create client account
        </Link>
      </div>

      {/* ─── Premium Demo Accounts Section ────────────────────── */}
      <div className="pt-6 border-t border-zinc-100 space-y-4">
        <div className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Instant Demo Access</h4>
        </div>

        <div className="space-y-2.5">
          {DEMO_ACCOUNTS.map((account) => {
            const Icon = account.icon;
            return (
              <div
                key={account.role}
                className="rounded-lg border border-zinc-200/80 p-3.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-zinc-300 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-7 h-7 rounded bg-zinc-50 border border-zinc-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${account.badge}`}>
                        {account.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate leading-relaxed">{account.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDemoLogin(account.email, account.password, account.role)}
                  disabled={loadingDemo !== null}
                  className="flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded text-[10px] font-semibold bg-zinc-950 text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {loadingDemo === account.role ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
