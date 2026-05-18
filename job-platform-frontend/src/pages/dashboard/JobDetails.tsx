import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '../../api/jobs';
import { useAuth } from '../../hooks/useAuth';
import { Building2, ExternalLink, Calendar, MessageSquare, ArrowLeft, Tag } from 'lucide-react';

const statusConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  applied: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  interview: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  offer: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
};

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getSingleJob(id!),
    enabled: !!id,
  });

  const addNoteMutation = useMutation({
    mutationFn: (text: string) => jobsApi.addNote(id!, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      setNoteText('');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => jobsApi.updateJobStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
    },
  });

  if (isLoading) return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="skeleton h-4 w-16"></div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="skeleton h-8 w-64 mb-3"></div>
        <div className="skeleton h-4 w-48"></div>
      </div>
    </div>
  );
  if (error) return <div className="p-10 text-red-500 bg-red-50 rounded-2xl border border-red-200">Error loading job details.</div>;

  const job = data?.data;
  if (!job) return <div className="p-10 text-slate-500 text-center">Job not found.</div>;

  const config = statusConfig[job.status] || statusConfig.applied;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteText.trim()) addNoteMutation.mutate(noteText);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" /> Back
      </button>

      <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{job.role}</h2>
              <div className="mt-3 flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {job.company}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(job.appliedAt).toLocaleDateString()}</span>
                {job.jobLink && (
                  <a href={job.jobLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-medium">
                    <ExternalLink className="w-4 h-4" /> View Posting
                  </a>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Status</span>
              {user?.role === 'client' ? (
                <select value={job.status} onChange={(e) => updateStatusMutation.mutate(e.target.value)} disabled={updateStatusMutation.isPending}
                  className={`block pl-3 pr-8 py-2 text-sm font-semibold capitalize rounded-xl focus:outline-none border cursor-pointer ${config.bg} ${config.text} ${config.border}`}>
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              ) : (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold capitalize ${config.bg} ${config.text} border ${config.border}`}>
                  <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>{job.status}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-6 border-b border-slate-200 space-y-6">
          {job.descriptionSnippet && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">{job.descriptionSnippet}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-6">
            {job.resume && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Resume</h3>
                <a href={job.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                  <ExternalLink className="w-4 h-4 mr-1.5" /> View Resume
                </a>
              </div>
            )}
            {job.keywords?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {job.keywords.map((kw: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-6 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center mb-6">
            <MessageSquare className="w-5 h-5 mr-2 text-indigo-600" /> Notes Timeline
          </h3>
          <div className="space-y-4">
            {job.notes?.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No notes yet.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                <ul className="space-y-4">
                  {job.notes?.map((note: any) => (
                    <li key={note._id} className="relative pl-12">
                      <div className="absolute left-3.5 top-4 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white shadow"></div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-sm text-slate-800">{note.text}</p>
                        <p className="mt-2 text-xs text-slate-400 font-medium">{new Date(note.createdAt).toLocaleString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {user?.role === 'associate' && (
              <form onSubmit={handleAddNote} className="mt-6 pt-6 border-t border-slate-200">
                <textarea id="note" rows={3} className="focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block w-full text-sm border-slate-300 rounded-xl border p-4" placeholder="Add a note..." value={noteText} onChange={(e) => setNoteText(e.target.value)} required />
                <div className="mt-3 flex justify-end">
                  <button type="submit" disabled={addNoteMutation.isPending || !noteText.trim()} className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm">
                    {addNoteMutation.isPending ? 'Adding...' : 'Add Note'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
