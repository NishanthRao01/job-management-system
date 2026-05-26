import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.register({ name, email, password });
      navigate('/login', { state: { message: 'Registration successful. Please login.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
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
        <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">Create your account</h3>
        <p className="mt-1.5 text-xs text-zinc-500">Sign up as a client to streamline and outsource your application workflow.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200/50 rounded-lg p-3 text-xs text-red-700 font-medium animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="premium-input focus:ring-1 focus:ring-[#4866C8]/10"
            placeholder="John Doe"
          />
        </div>

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
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Password</label>
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
              <UserPlus className="w-3.5 h-3.5 mr-2" />
              Create Account
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-zinc-100">
        <p className="text-xs text-zinc-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#4866C8] hover:text-[#3753a8] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
