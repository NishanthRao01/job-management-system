import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth';
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(token ? '' : 'Invalid or missing password reset token.');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Password reset token is missing.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword({ token, password });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to reset password. The link may have expired.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-4 py-4"
      >
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-zinc-900">Password Reset Complete</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Your password has been successfully updated. You can now log in with your new credentials.
          </p>
        </div>
        <div className="pt-4 border-t border-zinc-100 mt-6">
          <Link
            to="/login"
            className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">Create new password</h3>
        <p className="mt-1.5 text-xs text-zinc-500">
          Enter a secure password containing at least 8 characters.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200/50 rounded-lg p-3 text-xs text-red-700 font-medium flex items-start gap-2.5 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={!token}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="premium-input pr-10 focus:ring-1 focus:ring-[#4866C8]/10 disabled:opacity-50"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={!token}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              disabled={!token}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="premium-input pr-10 focus:ring-1 focus:ring-[#4866C8]/10 disabled:opacity-50"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={!token}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors disabled:opacity-50"
            >
              {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !token}
          className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <KeyRound className="w-3.5 h-3.5 mr-2" />
              Reset password
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ResetPassword;
