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
    if (!clientId) { setError('Please select a client.'); return; }
    const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k);
    createJobMutation.mutate({ clientId, company, role, jobLink, resume, descriptionSnippet, keywords: keywordsArray, initialNote });
  };

  const inputClass = "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block w-full text-sm border-slate-300 rounded-xl py-2.5 border shadow-sm transition-all";

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Add New Application</h3>
          <p className="mt-1 text-sm text-slate-500">Track a new application for one of your clients.</p>
        </div>
        
        <div className="px-6 py-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-scale-in">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Client</label>
              <select required value={clientId} onChange={(e) => setClientId(e.target.value)} disabled={isLoadingClients}
                className={`${inputClass} pl-3 pr-10 bg-white`}>
                <option value="" disabled>Select a client</option>
                {clients.map((client: any) => (
                  <option key={client._id} value={client._id}>{client.name} ({client.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-4 w-4 text-slate-400" />
                </div>
                <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} className={`${inputClass} pl-10`} placeholder="e.g. Google" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role / Position</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                </div>
                <input type="text" required value={role} onChange={(e) => setRole(e.target.value)} className={`${inputClass} pl-10`} placeholder="e.g. Senior Frontend Engineer" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Link <span className="text-slate-400 font-normal">(Optional)</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-slate-400" />
                </div>
                <input type="url" value={jobLink} onChange={(e) => setJobLink(e.target.value)} className={`${inputClass} pl-10`} placeholder="https://example.com/job" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Resume Link <span className="text-slate-400 font-normal">(Optional)</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-slate-400" />
                </div>
                <input type="url" value={resume} onChange={(e) => setResume(e.target.value)} className={`${inputClass} pl-10`} placeholder="Link to the tailored resume..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short JD <span className="text-slate-400 font-normal">(Optional)</span></label>
              <textarea rows={2} value={descriptionSnippet} onChange={(e) => setDescriptionSnippet(e.target.value)} className={`${inputClass} px-4`} placeholder="Brief summary of the job description..." />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Keywords <span className="text-slate-400 font-normal">(Optional, comma-separated)</span></label>
              <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className={`${inputClass} px-4`} placeholder="React, Node.js, Express..." />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Initial Note <span className="text-slate-400 font-normal">(Optional)</span></label>
              <textarea rows={2} value={initialNote} onChange={(e) => setInitialNote(e.target.value)} className={`${inputClass} px-4`} placeholder="Add any initial thoughts..." />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => navigate(-1)} className="py-2.5 px-5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={createJobMutation.isPending} className="py-2.5 px-5 border border-transparent rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm hover:shadow-lg hover:shadow-indigo-500/25">
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
