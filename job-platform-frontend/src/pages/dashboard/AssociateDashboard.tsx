import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../../api/jobs';
import { usersApi } from '../../api/users';
import { Building2, Calendar, MessageSquare, Plus, Search, ChevronLeft, ChevronRight, Briefcase, Users, TrendingUp, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';

const statusConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  applied: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  interview: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  offer: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
};

const AssociateDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch assigned clients for the dropdown
  const { data: clientsData } = useQuery({
    queryKey: ['assignedClients'],
    queryFn: () => usersApi.getAssignedClients(),
  });
  const clients = clientsData?.data || [];

  const { data, isLoading, error } = useQuery({
    queryKey: ['associateJobs', debouncedSearch, statusFilter, clientFilter, sortOrder, page],
    queryFn: () => jobsApi.getAssociateJobs({
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
      clientId: clientFilter || undefined,
      sort: sortOrder,
      page,
      limit
    }),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 min-w-[180px]">
                <div className="skeleton h-4 w-24 mb-3"></div>
                <div className="skeleton h-8 w-16"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200"><div className="skeleton h-6 w-48"></div></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 border-b border-slate-100">
              <div className="skeleton h-5 w-64 mb-3"></div>
              <div className="skeleton h-4 w-40"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 flex items-center gap-3 animate-scale-in">
        <XCircle className="w-5 h-5 flex-shrink-0" />
        <p className="font-medium">Failed to load jobs. Please try again.</p>
      </div>
    );
  }

  const jobs = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const statCards = [
    { label: 'Applications Managed', value: totalCount, icon: Briefcase, gradient: 'from-indigo-500 to-indigo-600' },
    { label: 'Active Clients', value: clients.length, icon: Users, gradient: 'from-violet-500 to-purple-600' },
    { label: 'In Interview', value: jobs.filter((j: any) => j.status === 'interview').length, icon: TrendingUp, gradient: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 flex-1">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 card-hover" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="mt-1.5 text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Link
          to="/dashboard/associate/jobs/new"
          className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/25 flex-shrink-0"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Application
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">Recent Applications</h3>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
            <div className="relative w-full lg:w-auto shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="pl-9 w-full lg:w-64 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block text-sm border-slate-300 rounded-xl py-2.5 border shadow-sm transition-all"
              />
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto">
              <select
                value={clientFilter}
                onChange={(e) => { setClientFilter(e.target.value); setPage(1); }}
                className="block w-full sm:w-auto pl-3 pr-10 py-2.5 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl border shadow-sm bg-white"
              >
                <option value="">All Clients</option>
                {clients.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="block w-full sm:w-auto pl-3 pr-10 py-2.5 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl border shadow-sm bg-white"
              >
                <option value="">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                className="block w-full sm:w-auto pl-3 pr-10 py-2.5 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl border shadow-sm bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {jobs.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No applications yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">Start applying for your clients!</p>
              <Link
                to="/dashboard/associate/jobs/new"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add First Application
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {jobs.map((job: any) => {
                const config = statusConfig[job.status] || statusConfig.applied;
                return (
                  <li key={job._id} className="hover:bg-slate-50/50 transition-all duration-200">
                    <Link to={`/dashboard/associate/jobs/${job._id}`} className="p-5 sm:p-6 block">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-base font-bold text-slate-900 truncate">{job.role}</span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold capitalize ${config.bg} ${config.text} border ${config.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
                              {job.status}
                            </span>
                            <span className="text-xs font-medium text-slate-500 px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">
                              {job.clientId?.name || 'Unknown'}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-slate-500 gap-4 flex-wrap">
                            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(job.appliedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-sm text-slate-400 flex items-center gap-1.5 flex-shrink-0">
                          <MessageSquare className="w-4 h-4" />
                          <span>{job.notes?.length || 0}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/30 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold">{(page - 1) * limit + 1}</span> to <span className="font-semibold">{Math.min(page * limit, totalCount)}</span> of <span className="font-semibold">{totalCount}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssociateDashboard;
