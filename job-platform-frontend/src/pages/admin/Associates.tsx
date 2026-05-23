import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import {
  UserCheck, ToggleLeft, ToggleRight, XCircle, Search, RefreshCw, Users,
} from 'lucide-react';

interface Associate {
  _id: string;
  name: string;
  email: string;
  clientsCount: number;
  isAvailable: boolean;
  createdAt: string;
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

const Associates = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Fetch associates
  const { data: associatesRes, isLoading, isError, refetch } = useQuery<AssociatesResponse>({
    queryKey: ['admin', 'associates'],
    queryFn: async () => {
      const { data } = await api.get('/admin/associates');
      return data;
    },
  });

  // Toggle availability mutation
  const toggleAvailabilityMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.patch(`/admin/associates/${userId}/toggle-availability`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'associates'] });
      // Invalidate clients since client details depend on availability
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
    },
    onSettled: () => {
      setTogglingId(null);
    },
  });

  const associates = associatesRes?.data || [];

  // Filter logic
  const filteredAssociates = associates.filter((assoc) => {
    const matchesSearch =
      assoc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assoc.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailability =
      availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && assoc.isAvailable) ||
      (availabilityFilter === 'unavailable' && !assoc.isAvailable);

    return matchesSearch && matchesAvailability;
  });

  // Metrics
  const totalCount = associates.length;
  const availableCount = associates.filter(a => a.isAvailable).length;
  const unavailableCount = totalCount - availableCount;
  const totalWorkload = associates.reduce((sum, a) => sum + a.clientsCount, 0);

  const handleToggle = (id: string) => {
    setTogglingId(id);
    toggleAvailabilityMutation.mutate(id);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-indigo-600" />
            Associates Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Monitor and manage workforce availability, workload, and details.
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <p className="text-sm font-semibold text-slate-500">Total Associates</p>
          <p className="text-3xl font-extrabold text-slate-950 mt-2">{isLoading ? '—' : totalCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <p className="text-sm font-semibold text-slate-500">Available Associates</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{isLoading ? '—' : availableCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <p className="text-sm font-semibold text-slate-500">Unavailable Associates</p>
          <p className="text-3xl font-extrabold text-red-500 mt-2">{isLoading ? '—' : unavailableCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <p className="text-sm font-semibold text-slate-500">Total Client Workload</p>
          <p className="text-3xl font-extrabold text-indigo-600 mt-2">{isLoading ? '—' : totalWorkload}</p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'available', 'unavailable'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setAvailabilityFilter(filter)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition capitalize ${
                availabilityFilter === filter
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isError && (
          <div className="p-6">
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-3">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-semibold text-sm">Failed to load associates. Please check backend connection.</p>
            </div>
          </div>
        )}

        {!isError && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Associate</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Clients Workload</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Availability Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} cols={5} />)
                ) : filteredAssociates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-base text-slate-500 font-bold">No associates found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredAssociates.map((assoc) => (
                    <tr key={assoc._id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-sm text-indigo-700">
                            {assoc.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-900 text-sm">{assoc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{assoc.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-800">
                          {assoc.clientsCount} clients
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                            assoc.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${assoc.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {assoc.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggle(assoc._id)}
                          disabled={togglingId === assoc._id}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                            assoc.isAvailable
                              ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                              : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100 text-indigo-700'
                          } disabled:opacity-50`}
                        >
                          {assoc.isAvailable ? (
                            <>
                              <ToggleRight className="w-4 h-4 text-emerald-600" />
                              Make Unavailable
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4 text-slate-400" />
                              Make Available
                            </>
                          )}
                        </button>
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

export default Associates;