import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import {
  CreditCard, Search, RefreshCw, XCircle, IndianRupee, Calendar, CheckCircle2, Clock, XOctagon, Copy, Check
} from 'lucide-react';

interface Payment {
  _id: string;
  user: { name: string; email: string; role: string } | null;
  plan: { name: string; price: number } | null;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  createdAt: string;
}

interface PaymentsResponse {
  success: boolean;
  metrics: {
    totalPayments: number;
    successfulPayments: number;
    totalRevenue: number;
  };
  data: Payment[];
}

const SkeletonRow = ({ cols }: { cols: number }) => (
  <tr className="border-b border-slate-100">
    {[...Array(cols)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-slate-200 rounded-lg animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
      </td>
    ))}
  </tr>
);

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch payments
  const { data: paymentsRes, isLoading, isError, refetch } = useQuery<PaymentsResponse>({
    queryKey: ['admin', 'payments'],
    queryFn: async () => {
      const { data } = await api.get('/admin/payments');
      return data;
    },
  });

  const payments = paymentsRes?.data || [];
  const metrics = paymentsRes?.metrics || { totalPayments: 0, successfulPayments: 0, totalRevenue: 0 };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      (payment.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.plan?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-indigo-600" />
            Payments Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Monitor financial transactions, plan purchases, and Razorpay transaction records.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Payments</p>
            <p className="text-3xl font-extrabold text-slate-950 mt-2">
              {isLoading ? '—' : metrics.totalPayments}
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
            #
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Successful Transactions</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-2">
              {isLoading ? '—' : metrics.successfulPayments}
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Revenue</p>
            <p className="text-3xl font-extrabold text-slate-905 mt-2 flex items-center">
              <IndianRupee className="w-6 h-6 text-slate-700" />
              {isLoading ? '—' : metrics.totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, email, plan, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'success', 'pending', 'failed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition capitalize ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-scale-in">
        {isError && (
          <div className="p-6">
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-semibold text-sm">Failed to load payments data. Please check backend connection.</p>
            </div>
          </div>
        )}

        {!isError && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount Paid</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Razorpay Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} cols={6} />)
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-base text-slate-500 font-bold">No payments found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-sm">
                            {payment.user?.name || 'Deleted User'}
                          </span>
                          <span className="text-xs text-slate-500">{payment.user?.email || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                        {payment.plan?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-sm flex items-center">
                          ₹{payment.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg w-max">
                          <span>{payment.razorpayOrderId}</span>
                          <button
                            onClick={() => handleCopy(payment.razorpayOrderId)}
                            className="text-slate-400 hover:text-indigo-600 transition"
                            title="Copy Order ID"
                          >
                            {copiedId === payment.razorpayOrderId ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                            payment.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : payment.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {payment.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {payment.status === 'pending' && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                          {payment.status === 'failed' && <XOctagon className="w-3.5 h-3.5" />}
                          {payment.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{formatDate(payment.createdAt)}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;