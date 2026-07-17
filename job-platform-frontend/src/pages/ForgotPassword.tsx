import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
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
          <h3 className="text-base font-semibold text-zinc-900">Check your email</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            If an account is associated with <span className="font-semibold text-zinc-800">{email}</span>, we have sent instructions to reset your password.
          </p>
        </div>
        <div className="pt-4 border-t border-zinc-100 mt-6">
          <Link
            to="/login"
            className="inline-flex items-center text-xs font-semibold text-[#4866C8] hover:text-[#3753a8] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Back to sign in
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
        <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">Forgot password</h3>
        <p className="mt-1.5 text-xs text-zinc-500">
          Enter your email address and we'll send you a link to reset your password.
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
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="premium-input focus:ring-1 focus:ring-[#4866C8]/10"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Mail className="w-3.5 h-3.5 mr-2" />
              Send reset link
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-zinc-100">
        <Link
          to="/login"
          className="inline-flex items-center text-xs font-semibold text-[#4866C8] hover:text-[#3753a8] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          Back to sign in
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
