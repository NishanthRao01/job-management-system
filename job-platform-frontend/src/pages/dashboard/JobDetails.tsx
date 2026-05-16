import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '../../api/jobs';
import { useAuth } from '../../hooks/useAuth';
import { Building2, ExternalLink, Calendar, MessageSquare, ArrowLeft } from 'lucide-react';

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

  if (isLoading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  if (error) return <div className="p-10 text-red-500">Error loading job details.</div>;

  const job = data?.data;
  if (!job) return <div className="p-10 text-slate-500">Job not found.</div>;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteText.trim()) {
      addNoteMutation.mutate(noteText);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-6 border-b border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{job.role}</h2>
              <div className="mt-2 flex items-center space-x-4 text-sm text-slate-500">
                <span className="flex items-center"><Building2 className="w-4 h-4 mr-1" /> {job.company}</span>
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(job.appliedAt).toLocaleDateString()}</span>
                {job.jobLink && (
                  <a href={job.jobLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-indigo-500 hover:text-indigo-700">
                    <ExternalLink className="w-4 h-4 mr-1" /> View Original Posting
                  </a>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Status</span>
              {user?.role === 'client' ? (
                <select
                  value={job.status}
                  onChange={(e) => updateStatusMutation.mutate(e.target.value)}
                  disabled={updateStatusMutation.isPending}
                  className={`block pl-3 pr-8 py-2 text-sm font-medium capitalize rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border border-slate-300 cursor-pointer
                    ${job.status === 'applied' ? 'bg-blue-50 text-blue-800 border-blue-200' : ''}
                    ${job.status === 'interview' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : ''}
                    ${job.status === 'rejected' ? 'bg-red-50 text-red-800 border-red-200' : ''}
                    ${job.status === 'offer' ? 'bg-green-50 text-green-800 border-green-200' : ''}
                  `}
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              ) : (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize
                  ${job.status === 'applied' ? 'bg-blue-100 text-blue-800' : ''}
                  ${job.status === 'interview' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${job.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                  ${job.status === 'offer' ? 'bg-green-100 text-green-800' : ''}
                `}>
                  {job.status}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-6 bg-white border-b border-slate-200 space-y-6">
          {job.descriptionSnippet && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Short JD / Description</h3>
              <p className="text-slate-800 text-sm whitespace-pre-wrap">{job.descriptionSnippet}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-6">
            {job.resume && (
              <div>
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Resume</h3>
                <a href={job.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                  <ExternalLink className="w-4 h-4 mr-1" /> View Resume
                </a>
              </div>
            )}

            {job.keywords && job.keywords.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {job.keywords.map((kw: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-6 bg-slate-50">
          <h3 className="text-lg font-medium text-slate-900 flex items-center mb-4">
            <MessageSquare className="w-5 h-5 mr-2" /> Notes Timeline
          </h3>
          
          <div className="space-y-4">
            {job.notes?.length === 0 ? (
              <p className="text-slate-500 text-sm">No notes have been added yet.</p>
            ) : (
              <ul className="space-y-4">
                {job.notes?.map((note: any) => (
                  <li key={note._id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <p className="text-sm text-slate-800">{note.text}</p>
                    <p className="mt-2 text-xs text-slate-400 font-medium">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {user?.role === 'associate' && (
              <form onSubmit={handleAddNote} className="mt-6">
                <div>
                  <label htmlFor="note" className="sr-only">Add a note</label>
                  <textarea
                    id="note"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-lg border p-3"
                    placeholder="Add an update or note about this application..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    required
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={addNoteMutation.isPending || !noteText.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
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
