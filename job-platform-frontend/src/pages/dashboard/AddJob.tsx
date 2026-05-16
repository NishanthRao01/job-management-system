import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '../../api/jobs';
import { usersApi } from '../../api/users';
import { Briefcase, Building2, Link as LinkIcon } from 'lucide-react';

const AddJob = () => {
  const [clientId, setClientId] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [resume, setResume] = useState('');
  const [descriptionSnippet, setDescriptionSnippet] = useState('');
  const [keywords, setKeywords] = useState('');
  const [initialNote, setInitialNote] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch assigned clients for the dropdown
  const { data: clientsData, isLoading: isLoadingClients } = useQuery({
    queryKey: ['assignedClients'],
    queryFn: () => usersApi.getAssignedClients(),
  });

  const clients = clientsData?.data || [];

  const createJobMutation = useMutation({
    mutationFn: (newJob: any) => jobsApi.createJob(newJob),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['associateJobs'] });
      navigate('/dashboard/associate');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create job application.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError('Please select a client.');
      return;
    }
    
    const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k);
    
    createJobMutation.mutate({ 
      clientId, 
      company, 
      role, 
      jobLink, 
      resume, 
      descriptionSnippet, 
      keywords: keywordsArray, 
      initialNote 
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-medium leading-6 text-slate-900">Add New Job Application</h3>
          <p className="mt-1 text-sm text-slate-500">Track a new application for one of your clients.</p>
        </div>
        
        <div className="px-6 py-6">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Client</label>
              <div className="mt-1">
                <select
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  disabled={isLoadingClients}
                  className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border shadow-sm"
                >
                  <option value="" disabled>Select a client</option>
                  {clients.map((client: any) => (
                    <option key={client._id} value={client._id}>
                      {client.name} ({client.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Company</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2 border"
                  placeholder="e.g. Google"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Role / Position</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2 border"
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Job Link (Optional)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  value={jobLink}
                  onChange={(e) => setJobLink(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2 border"
                  placeholder="https://example.com/job"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Resume Link (Optional)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2 border"
                  placeholder="Link to the tailored resume..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Short JD / Description (Optional)</label>
              <div className="mt-1">
                <textarea
                  rows={2}
                  value={descriptionSnippet}
                  onChange={(e) => setDescriptionSnippet(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-lg py-2 px-3 border shadow-sm"
                  placeholder="Brief summary of the job description..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Keywords (Optional, comma-separated)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-lg py-2 px-3 border"
                  placeholder="React, Node.js, Express..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Initial Note (Optional)</label>
              <div className="mt-1">
                <textarea
                  rows={2}
                  value={initialNote}
                  onChange={(e) => setInitialNote(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-lg py-2 px-3 border shadow-sm"
                  placeholder="Add any initial thoughts or context for the client..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createJobMutation.isPending}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {createJobMutation.isPending ? 'Saving...' : 'Add Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJob;
