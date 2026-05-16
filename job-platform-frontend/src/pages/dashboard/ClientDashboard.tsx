import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../../api/jobs';
import { Building2, Calendar, MessageSquare, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';

const ClientDashboard = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['clientJobs', debouncedSearch, statusFilter, sortOrder, page],
    queryFn: () => jobsApi.getClientJobs({ 
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
      sort: sortOrder,
      page,
      limit
    }),
  });



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Failed to load jobs. Please try again.
      </div>
    );
  }

  const jobs = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <dt className="text-sm font-medium text-slate-500 truncate">Total Applications</dt>
          <dd className="mt-2 text-3xl font-semibold text-slate-900">{jobs.length}</dd>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <h3 className="text-lg font-medium leading-6 text-slate-900">Job Applications pipeline</h3>
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
                className="pl-9 w-full lg:w-64 focus:ring-indigo-500 focus:border-indigo-500 block text-sm border-slate-300 rounded-lg py-2 border shadow-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg border shadow-sm bg-white"
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
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg border shadow-sm bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
        <div className="divide-y divide-slate-200">
          {jobs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No jobs found. Subscribe to a plan and your assigned associate will start applying for you!
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {jobs.map((job: any) => (
                <li key={job._id} className="hover:bg-slate-50 transition-colors">
                  <Link to={`/dashboard/client/jobs/${job._id}`} className="p-6 block">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-semibold text-indigo-600">{job.role}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${job.status === 'applied' ? 'bg-blue-100 text-blue-800' : ''}
                            ${job.status === 'interview' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${job.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                            ${job.status === 'offer' ? 'bg-green-100 text-green-800' : ''}
                          `}>
                            {job.status}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-slate-500 space-x-4">
                          <span className="flex items-center"><Building2 className="w-4 h-4 mr-1"/> {job.company}</span>
                          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {new Date(job.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500 flex items-center space-x-2">
                         <MessageSquare className="w-4 h-4"/>
                         <span>{job.notes?.length || 0} notes</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
            <p className="text-sm text-slate-700">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center px-3 py-1 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center px-3 py-1 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ClientDashboard;
