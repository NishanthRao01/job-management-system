import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import {
  Users, UserCheck, RefreshCw, XCircle, Search, ChevronDown, AlertCircle,
} from 'lucide-react';

interface Associate {
  _id: string;
  name: string;
  email: string;
  isAvailable: boolean;
  clientsCount: number;
}

interface Client {
  _id: string;
  name: string;
  email: string;
  assignedAssociate: { _id: string; name: string; email: string } | null;
  createdAt: string;
}

interface Subscription {
  _id: string;
  clientId: { _id: string; name: string; email: string };
  planId: { name: string; price: number };
  status: 'active' | 'expired';
  endDate: string;
}

interface ClientsResponse {
  success: boolean;
  count: number;
  data: Client[];
}

interface SubscriptionsResponse {
  success: boolean;
  count: number;
  data: Subscription[];
}

interface AssociatesResponse {
  success: boolean;
  count: number;
  data: Associate[];
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

const Clients = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<'all' | 'active' | 'expired' | 'no_sub'>('all');
  const [reassigningClientId, setReassigningClientId] = useState<string | null>(null);

  // Fetch clients, subscriptions, and associates
  const { data: clientsRes, isLoading: loadingClients, isError: errorClients, refetch: refetchClients } = useQuery<ClientsResponse>({
    queryKey: ['admin', 'clients'],
    queryFn: async () => {
      const { data } = await api.get('/admin/clients');
      return data;
    },
  });

  const { data: subsRes, isLoading: loadingSubs, isError: errorSubs, refetch: refetchSubs } = useQuery<SubscriptionsResponse>({
    queryKey: ['admin', 'subscriptions'],
    queryFn: async () => {
      const { data } = await api.get('/admin/subscriptions');
      return data;
    },
  });

  const { data: associatesRes, isLoading: loadingAssociates, isError: errorAssociates, refetch: refetchAssociates } = useQuery<AssociatesResponse>({
    queryKey: ['admin', 'associates'],
    queryFn: async () => {
      const { data } = await api.get('/admin/associates');
      return data;
    },
  });

  // Reassign associate mutation
  const reassignMutation = useMutation({
    mutationFn: async ({ clientId, newAssociateId }: { clientId: string; newAssociateId: string }) => {
      const { data } = await api.patch(`/admin/clients/${clientId}/reassign`, { newAssociateId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'associates'] });
      setReassigningClientId(null);
    },
  });

  const handleRefresh = () => {
    refetchClients();
    refetchSubs();
    refetchAssociates();
  };

  const clients = clientsRes?.data || [];
  const subscriptions = subsRes?.data || [];
  const associates = associatesRes?.data || [];

  // Map clients to their active/latest subscription
  const clientSubscriptionsMap = new Map<string, Subscription>();
  subscriptions.forEach((sub) => {
    const clientId = sub.clientId?._id;
    if (clientId) {
      // Since subscriptions are sorted by createdAt: -1 in backend, the first one encountered is the latest
      if (!clientSubscriptionsMap.has(clientId)) {
        clientSubscriptionsMap.set(clientId, sub);
      }
    }
  });

  // Filter clients
  const filteredClients = clients.filter((client) => {
    const sub = clientSubscriptionsMap.get(client._id);

    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.assignedAssociate?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAssignment =
      assignmentFilter === 'all' ||
      (assignmentFilter === 'assigned' && client.assignedAssociate) ||
      (assignmentFilter === 'unassigned' && !client.assignedAssociate);

    const matchesSub =
      subscriptionFilter === 'all' ||
      (subscriptionFilter === 'active' && sub?.status === 'active') ||
      (subscriptionFilter === 'expired' && sub?.status === 'expired') ||
      (subscriptionFilter === 'no_sub' && !sub);

    return matchesSearch && matchesAssignment && matchesSub;
  });

  // Metrics
  const totalCount = clients.length;
  const assignedCount = clients.filter(c => c.assignedAssociate).length;
  const unassignedCount = totalCount - assignedCount;
  const activeSubsCount = Array.from(clientSubscriptionsMap.values()).filter(s => s.status === 'active').length;

  const availableAssociates = associates.filter(a => a.isAvailable);

  const handleReassign = (clientId: string, newAssociateId: string) => {
    reassignMutation.mutate({ clientId, newAssociateId });
  };

  const isDataLoading = loadingClients || loadingSubs || loadingAssociates;
  const hasError = errorClients || errorSubs || errorAssociates;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Clients Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View clients, check their subscription details, and reassign support associates.
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <p className="text-sm font-semibold text-slate-500">Total Clients</p>
          <p className="text-3xl font-extrabold text-slate-950 mt-2">{isDataLoading ? '—' : totalCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <p className="text-sm font-semibold text-slate-500">Assigned Clients</p>
          <p className="text-3xl font-extrabold text-indigo-600 mt-2">{isDataLoading ? '—' : assignedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <p className="text-sm font-semibold text-slate-500">Unassigned Clients</p>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">{isDataLoading ? '—' : unassignedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <p className="text-sm font-semibold text-slate-500">Active Subscriptions</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{isDataLoading ? '—' : activeSubsCount}</p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, email, or assigned associate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assignment Status</span>
            <div className="flex gap-1.5">
              {(['all', 'assigned', 'unassigned'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAssignmentFilter(filter)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition capitalize ${
                    assignmentFilter === filter
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subscription Status</span>
            <div className="flex gap-1.5">
              {(['all', 'active', 'expired', 'no_sub'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSubscriptionFilter(filter)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition capitalize ${
                    subscriptionFilter === filter
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {filter === 'no_sub' ? 'No Subscription' : filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-scale-in">
        {hasError && (
          <div className="p-6">
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-semibold text-sm">Failed to load clients data. Please check backend connection.</p>
            </div>
          </div>
        )}

        {!hasError && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subscription Plan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subscription Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Associate</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isDataLoading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} cols={6} />)
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-base text-slate-500 font-bold">No clients found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => {
                    const sub = clientSubscriptionsMap.get(client._id);
                    return (
                      <tr key={client._id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center font-bold text-sm text-violet-700">
                              {client.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-900 text-sm">{client.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{client.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                          {sub ? sub.planId?.name : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {sub ? (
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
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-200">
                              <AlertCircle className="w-3.5 h-3.5" />
                              No Plan
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {client.assignedAssociate ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200">
                              <UserCheck className="w-3.5 h-3.5" />
                              {client.assignedAssociate.name}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200 animate-pulse-glow">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {reassigningClientId === client._id ? (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <div className="relative">
                                <select
                                  defaultValue=""
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleReassign(client._id, e.target.value);
                                    }
                                  }}
                                  disabled={reassignMutation.isPending}
                                  className="appearance-none pl-3 pr-8 py-1.5 text-xs font-bold border border-indigo-300 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                                >
                                  <option value="" disabled>
                                    Assign Associate
                                  </option>
                                  {availableAssociates
                                    .filter((assoc) => assoc._id !== client.assignedAssociate?._id)
                                    .map((assoc) => (
                                      <option key={assoc._id} value={assoc._id}>
                                        {assoc.name} ({assoc.clientsCount} workload)
                                      </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                              </div>
                              <button
                                onClick={() => setReassigningClientId(null)}
                                className="text-xs text-slate-400 hover:text-slate-600 font-bold transition"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReassigningClientId(client._id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-700 transition"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              {client.assignedAssociate ? 'Reassign' : 'Assign'}
                            </button>
                          )}
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

export default Clients;