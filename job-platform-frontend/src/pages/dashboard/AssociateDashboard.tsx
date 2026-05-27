import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../../api/jobs';
import { usersApi } from '../../api/users';
import { Building2, Calendar, MessageSquare, Plus, Search, ChevronLeft, ChevronRight, Briefcase, Users, TrendingUp, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { motion } from 'framer-motion';

const statusConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  applied: { bg: 'bg-zinc-50', text: 'text-zinc-650', border: 'border-zinc-200/60', dot: 'bg-zinc-450' },
  interview: { bg: 'bg-[#eff3ff]', text: 'text-[#4866C8]', border: 'border-[#4866C8]/15', dot: 'bg-[#4866C8]' },
  offer: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', dot: 'bg-red-500' },
};

const AssociateDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
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
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-zinc-150">
              <div className="skeleton h-3.5 w-24 mb-3"></div>
              <div className="skeleton h-7 w-12"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-zinc-200/80 overflow-hidden">
          <div className="p-5 border-b border-zinc-100 bg-[#fafafa]/50">
            <div className="skeleton h-5 w-40"></div>
          </div>
          <div className="divide-y divide-zinc-100">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-5">
                <div className="skeleton h-4 w-60 mb-2"></div>
                <div className="skeleton h-3.5 w-36"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50/50 text-red-650 p-5 rounded-xl border border-red-200/50 flex items-center gap-3 animate-fade-in text-xs font-semibold">
        <XCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
        <p>Failed to load jobs. Please try again.</p>
      </div>
    );
  }

  const jobs = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const statCards = [
    { label: 'Applications Managed', value: totalCount, icon: Briefcase, bg: 'bg-zinc-50/50', border: 'border-zinc-200/50', color: 'text-zinc-550' },
    { label: 'Active Assigned Clients', value: clients.length, icon: Users, bg: 'bg-[#eff3ff]/50', border: 'border-[#4866C8]/15', color: 'text-[#4866C8]' },
    { label: 'Interviews Scheduled', value: jobs.filter((j: any) => j.status === 'interview').length, icon: TrendingUp, bg: 'bg-amber-50/50', border: 'border-amber-100/50', color: 'text-amber-600' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Upper Grid & Action */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className="bg-white p-5 rounded-xl border border-zinc-200/70 hover:border-zinc-300 transition-colors duration-150 flex items-center justify-between"
              >
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-zinc-950 leading-none tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>
        <Link
          to="/dashboard/associate/jobs/new"
          className="premium-btn-primary gap-2 py-1.5 px-4 h-9 text-xs self-end lg:self-center"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </Link>
      </div>

      {/* Main Table Container */}
      <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.01)] rounded-xl border border-zinc-200/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-200 bg-[#fafafa]/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Operational Activity Workspace</h3>
            <p className="text-xs text-zinc-400 mt-1">Submit, organize, and monitor custom job listings on behalf of matched clients.</p>
          </div>
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="premium-input pl-9 py-1.5 px-3 h-9 text-xs focus:ring-1 focus:ring-[#4866C8]/10"
              />
            </div>
            {/* Dropdown Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={clientFilter}
                onChange={(e) => { setClientFilter(e.target.value); setPage(1); }}
                className="premium-input py-1.5 px-3 h-9 bg-white text-xs border border-zinc-250 cursor-pointer min-w-[130px]"
              >
                <option value="">All Clients</option>
                {clients.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="premium-input py-1.5 px-3 h-9 bg-white text-xs border border-zinc-250 cursor-pointer min-w-[120px]"
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
                className="premium-input py-1.5 px-3 h-9 bg-white text-xs border border-zinc-250 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {jobs.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-5 h-5 text-zinc-400" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-950 mb-1">No applications logged</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-5 leading-relaxed">Settle matching details and submit your first application profile on behalf of your clients.</p>
              <Link
                to="/dashboard/associate/jobs/new"
                className="premium-btn-primary py-2 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Log First Application
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100/60">
              {jobs.map((job: any) => {
                const config = statusConfig[job.status] || statusConfig.applied;
                return (
                  <li key={job._id} className="hover:bg-zinc-50/50 transition-colors duration-150">
                    <Link to={`/dashboard/associate/jobs/${job._id}`} className="p-5 block">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-sm font-semibold text-zinc-900 tracking-tight truncate">{job.role}</span>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold capitalize border ${config.bg} ${config.text} ${config.border}`}>
                              <span className={`w-1 h-1 rounded-full ${config.dot}`}></span>
                              {job.status}
                            </span>
                            <span className="text-[10px] font-semibold text-zinc-500 px-2 py-0.5 bg-zinc-50 border border-zinc-200/60 rounded">
                              Client: {job.clientId?.name || 'Unknown'}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-zinc-400 gap-3.5 flex-wrap">
                            <span className="flex items-center gap-1 font-medium text-zinc-500"><Building2 className="w-3.5 h-3.5 text-zinc-400" /> {job.company}</span>
                            <span className="flex items-center gap-1 font-medium text-zinc-400"><Calendar className="w-3.5 h-3.5 text-zinc-400" /> {new Date(job.appliedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-medium flex-shrink-0 bg-zinc-50 border border-zinc-200/60 px-2 py-1 rounded">
                          <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{job.notes?.length || 0} notes</span>
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
          <div className="px-6 py-4 border-t border-zinc-100 bg-[#fafafa]/30 flex items-center justify-between">
            <p className="text-xs text-zinc-550">
              Showing <span className="font-semibold">{(page - 1) * limit + 1}</span> to <span className="font-semibold">{Math.min(page * limit, totalCount)}</span> of <span className="font-semibold">{totalCount}</span> applications
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="premium-btn-secondary py-1.5 px-3 rounded text-xs select-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="premium-btn-secondary py-1.5 px-3 rounded text-xs select-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AssociateDashboard;
