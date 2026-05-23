import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import {
  BarChart3, Search, RefreshCw, XCircle, Briefcase, UserCheck, AlertTriangle,
} from 'lucide-react';

interface Associate {
  _id: string;
  name: string;
  email: string;
}

interface Client {
  _id: string;
  name: string;
  email: string;
  assignedAssociate: Associate | null;
}

interface Subscription {
  _id: string;
  clientId: { _id: string; name: string; email: string } | null;
  planId: { name: string; price: number; jobLimitPerDay: number } | null;
  status: 'active' | 'expired';
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface SubscriptionsResponse {
  success: boolean;
  count: number;
  data: Subscription[];
}

interface ClientsResponse {
  success: boolean;
  count: number;
  data: Client[];
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

const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'expiring_soon'>('all');

  // Fetch subscriptions and clients
  const { data: subsRes, isLoading: loadingSubs, isError: errorSubs, refetch: refetchSubs } = useQuery<SubscriptionsResponse>({
    queryKey: ['admin', 'subscriptions'],
    queryFn: async () => {
      const { data } = await api.get('/admin/subscriptions');
      return data;
    },
  });

  const { data: clientsRes, isLoading: loadingClients, isError: errorClients, refetch: refetchClients } = useQuery<ClientsResponse>({
    queryKey: ['admin', 'clients'],
    queryFn: async () => {
      const { data } = await api.get('/admin/clients');
      return data;
    },
  });

  const handleRefresh = () => {
    refetchSubs();
    refetchClients();
  };

  const subscriptions = subsRes?.data || [];
  const clients = clientsRes?.data || [];

  // Create a map for clients to look up their assigned associates
  const clientsMap = new Map<string, Client>();
  clients.forEach((c) => {
    clientsMap.set(c._id, c);
  });

  // Helper to check if a date is within 7 days
  const isExpiringSoon = (endDateStr: string) => {
    try {
      const end = new Date(endDateStr);
      const now = new Date();
      const diffTime = end.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    } catch {
      return false;
    }
  };

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const clientName = sub.clientId?.name || '';
    const clientEmail = sub.clientId?.email || '';
    const planName = sub.planId?.name || '';

    const matchesSearch =
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planName.toLowerCase().includes(searchTerm.toLowerCase());

    const isSoon = sub.status === 'active' && isExpiringSoon(sub.endDate);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && sub.status === 'active') ||
      (statusFilter === 'expired' && sub.status === 'expired') ||
      (statusFilter === 'expiring_soon' && isSoon);

    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalCount = subscriptions.length;
  const activeCount = subscriptions.filter((s) => s.status === 'active').length;
  const expiredCount = subscriptions.filter((s) => s.status === 'expired').length;
  const expiringSoonCount = subscriptions.filter((s) => s.status === 'active' && isExpiringSoon(s.endDate)).length;
  const mrr = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + (s.planId?.price || 0), 0);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const isDataLoading = loadingSubs || loadingClients;
  const hasError = errorSubs || errorClients;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-600" />
            Subscriptions Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Track customer subscription periods, plan benefits, expirations, and MRR.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <p className="text-sm font-semibold text-slate-500">Total Plans</p>
          <p className="text-2xl font-extrabold text-slate-950 mt-2">{isDataLoading ? '—' : totalCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <p className="text-sm font-semibold text-slate-500">Active Plans</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">{isDataLoading ? '—' : activeCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <p className="text-sm font-semibold text-slate-500">Expired Plans</p>
          <p className="text-2xl font-extrabold text-slate-400 mt-2">{isDataLoading ? '—' : expiredCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <p className="text-sm font-semibold text-slate-500">Expiring &lt;7 Days</p>
          <p className="text-2xl font-extrabold text-amber-500 mt-2">{isDataLoading ? '—' : expiringSoonCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <p className="text-sm font-semibold text-slate-500">Monthly Run Rate</p>
          <p className="text-2xl font-extrabold text-indigo-650 mt-2">
            ₹{isDataLoading ? '—' : mrr.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, email, or plan name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'expired', 'expiring_soon'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition capitalize ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-scale-in">
        {hasError && (
          <div className="p-6">
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-semibold text-sm">Failed to load subscriptions. Please check backend connection.</p>
            </div>
          </div>
        )}

        {!hasError && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Limit</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Associate</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subscription Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isDataLoading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} cols={7} />)
                ) : filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-base text-slate-500 font-bold">No subscriptions found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((sub) => {
                    const clientData = sub.clientId ? clientsMap.get(sub.clientId._id) : null;
                    const soon = sub.status === 'active' && isExpiringSoon(sub.endDate);

                    return (
                      <tr key={sub._id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 text-sm">
                              {sub.clientId?.name || 'Deleted Client'}
                            </span>
                            <span className="text-xs text-slate-500">{sub.clientId?.email || '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          <div className="flex flex-col">
                            <span className="font-semibold">{sub.planId?.name || '—'}</span>
                            <span className="text-xs text-slate-500">₹{(sub.planId?.price || 0).toLocaleString('en-IN')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-800">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 mr-1" />
                            {sub.planId?.jobLimitPerDay ?? '—'} / day
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {clientData?.assignedAssociate ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200">
                              <UserCheck className="w-3.5 h-3.5" />
                              {clientData.assignedAssociate.name}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 font-semibold italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {soon ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-255 rounded-lg text-xs font-bold">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                              Expiring Soon
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                                sub.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                              {sub.status === 'active' ? 'Active' : 'Expired'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {formatDate(sub.startDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {formatDate(sub.endDate)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
