import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '../../api/jobs';
import { useAuth } from '../../hooks/useAuth';
import { 
  Building2, 
  ExternalLink, 
  Calendar, 
  MessageSquare, 
  ArrowLeft, 
  Tag, 
  FileText, 
  Edit2, 
  Trash2, 
  Briefcase, 
  Link as LinkIcon 
} from 'lucide-react';
import { ResumeUpload } from '../../components/ResumeUpload';

const statusConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  applied: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  interview: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  offer: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState('');

  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [resumeFile, setResumeFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [descriptionSnippet, setDescriptionSnippet] = useState('');
  const [keywords, setKeywords] = useState('');
  const [editError, setEditError] = useState('');

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

  const updateJobMutation = useMutation({
    mutationFn: (updatedFields: any) => jobsApi.updateJob(id!, updatedFields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['associateJobs'] });
      setIsEditing(false);
    },
    onError: (err: any) => {
      setEditError(err.response?.data?.message || 'Failed to update job application.');
    }
  });

  const deleteJobMutation = useMutation({
    mutationFn: () => jobsApi.deleteJob(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['associateJobs'] });
      navigate('/dashboard/associate');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to delete application.');
    }
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

  const enterEditMode = () => {
    setCompany(job.company || '');
    setRole(job.role || '');
    setJobLink(job.jobLink || '');
    setResumeFile(job.resumeFile || null);
    setDescriptionSnippet(job.descriptionSnippet || '');
    setKeywords(job.keywords ? job.keywords.join(', ') : '');
    setEditError('');
    setIsEditing(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      setEditError('Please wait for the resume upload to complete.');
      return;
    }
    const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k);
    updateJobMutation.mutate({
      company,
      role,
      jobLink,
      resumeFile,
      descriptionSnippet,
      keywords: keywordsArray
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you absolutely sure you want to delete this application? This will permanently delete the application record and its resume attachment.')) {
      deleteJobMutation.mutate();
    }
  };

  const inputClass = "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block w-full text-sm border-slate-300 rounded-xl py-2.5 border shadow-sm transition-all";

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => setIsEditing(false)} className="flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-650 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to details
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">Edit Application Details</h3>
            <p className="mt-1 text-sm text-slate-500">Modify information or replace the tailored resume.</p>
          </div>

          <div className="px-6 py-6">
            {editError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-scale-in">
                <p className="text-sm text-red-700 font-medium">{editError}</p>
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-5">
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
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Attach Tailored Resume <span className="text-slate-400 font-normal">(Optional)</span></label>
                <ResumeUpload
                  value={resumeFile}
                  onChange={setResumeFile}
                  role={role}
                  company={company}
                  onUploadingChange={setIsUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short JD <span className="text-slate-400 font-normal">(Optional)</span></label>
                <textarea rows={3} value={descriptionSnippet} onChange={(e) => setDescriptionSnippet(e.target.value)} className={`${inputClass} px-4`} placeholder="Brief summary of the job description..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Keywords <span className="text-slate-400 font-normal">(Optional, comma-separated)</span></label>
                <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className={`${inputClass} px-4`} placeholder="React, Node.js, Express..." />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditing(false)} className="py-2.5 px-5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={updateJobMutation.isPending || isUploading} className="py-2.5 px-5 border border-transparent rounded-xl text-sm font-semibold text-white bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm hover:shadow-lg hover:shadow-indigo-500/25">
                  {updateJobMutation.isPending ? 'Saving...' : isUploading ? 'Uploading...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>

        {user?.role === 'associate' && (
          <div className="flex gap-2">
            <button
              onClick={enterEditMode}
              className="premium-btn-secondary py-1.5 px-3 h-9 text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5 text-zinc-500" /> Edit Application
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteJobMutation.isPending}
              className="px-3 py-1.5 h-9 text-xs font-semibold rounded-lg text-red-650 bg-red-50 hover:bg-red-100 border border-red-200/50 hover:border-red-200 transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{job.role}</h2>
              <div className="mt-3 flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                <span className="flex items-center gap-1.5 font-medium"><Building2 className="w-4 h-4" /> {job.company}</span>
                <span className="flex items-center gap-1.5 font-medium"><Calendar className="w-4 h-4" /> {new Date(job.appliedAt).toLocaleDateString()}</span>
                {job.jobLink && (
                  <a href={job.jobLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-indigo-650 hover:text-indigo-700 font-medium">
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
          
          <div className="space-y-4">
            {(job.resumeFile || job.resume) && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tailored Resume</h3>
                {job.resumeFile ? (
                  <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-4 flex items-center justify-between gap-4 max-w-md shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-900 truncate">{job.resumeFile.filename}</p>
                        <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                          {job.resumeFile.fileSize ? formatBytes(job.resumeFile.fileSize) : 'Unknown size'} • {job.resumeFile.uploadedAt ? new Date(job.resumeFile.uploadedAt).toLocaleDateString() : new Date(job.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <a
                      href={job.resumeFile.downloadUrl || job.resumeFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-zinc-650 hover:text-zinc-900 bg-white border border-zinc-200 hover:border-zinc-350 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View Resume
                    </a>
                  </div>
                ) : (
                  // Backwards compatibility fallback for older text links
                  <a href={job.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2.5 rounded-xl border border-indigo-100 transition-colors shadow-sm">
                    <ExternalLink className="w-4 h-4 mr-1.5" /> View Legacy Resume
                  </a>
                )}
              </div>
            )}
            
            {job.keywords?.length > 0 && (
              <div className="pt-2">
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
                  <button type="submit" disabled={addNoteMutation.isPending || !noteText.trim()} className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm">
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
