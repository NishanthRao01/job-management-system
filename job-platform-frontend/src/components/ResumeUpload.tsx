import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { jobsApi } from '../api/jobs';

interface ResumeUploadProps {
  value: any; // resumeFile schema or null
  onChange: (value: any) => void;
  role?: string;
  company?: string;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  value,
  onChange,
  role = '',
  company = '',
  disabled = false,
  onUploadingChange
}) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    // Local validations
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'docx', 'doc'];
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedExtensions.includes(ext || '') || !allowedMimeTypes.includes(file.type)) {
      setError('Invalid file type. Only PDF and DOCX files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    setError(null);
    setProgress(0);
    onUploadingChange?.(true);

    try {
      const response = await jobsApi.uploadResume(
        file, 
        role.trim(), 
        company.trim(), 
        (percent) => {
          setProgress(percent);
        }
      );
      
      if (response.success && response.data) {
        onChange(response.data);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Network upload failure. Please try again.';
      setError(errMsg);
    } finally {
      setProgress(null);
      onUploadingChange?.(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && progress === null) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && progress === null && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    onChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
        className="hidden"
        disabled={disabled || progress !== null}
      />

      {/* State 1: Uploading Progress */}
      {progress !== null && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center gap-4 animate-pulse">
          <Loader2 className="w-5 h-5 text-indigo-650 animate-spin flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1 text-xs font-semibold text-zinc-900">
              <span className="truncate">Uploading tailored resume...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* State 2: Uploaded File Info */}
      {progress === null && value && (
        <div className="bg-zinc-50/50 border border-zinc-200/80 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-zinc-900 truncate">{value.filename}</p>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-400 font-medium">
                <span>{value.fileSize ? formatBytes(value.fileSize) : 'Unknown size'}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-emerald-600">
                  <CheckCircle2 className="w-3 h-3" /> Ready to save
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {value.url && (
              <a
                href={value.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 px-2 py-1.5 rounded-md transition-colors"
              >
                View
              </a>
            )}
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="p-1.5 rounded-md text-zinc-400 hover:text-red-650 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all disabled:opacity-40"
              title="Remove File"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* State 3: Empty upload area */}
      {progress === null && !value && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border border-dashed rounded-xl p-5 text-center transition-all ${
            isDragging 
              ? 'border-indigo-600 bg-indigo-50/20' 
              : 'border-zinc-250 bg-white hover:border-zinc-400 hover:bg-zinc-50/20'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={disabled}
                className="text-xs font-semibold text-indigo-650 hover:text-indigo-700 underline focus:outline-none disabled:no-underline"
              >
                Click to attach resume
              </button>
              <p className="text-[10px] text-zinc-400 mt-1 font-medium">PDF or DOCX format (max 5MB)</p>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-red-650 bg-red-50/50 border border-red-100 p-2.5 rounded-lg animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          <p className="flex-1">{error}</p>
        </div>
      )}
    </div>
  );
};
