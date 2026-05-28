import api from './axios';

export const jobsApi = {
  getClientJobs: async (params?: any) => {
    const response = await api.get('/jobs/client', { params });
    return response.data;
  },
  getAssociateJobs: async (params?: any) => {
    const response = await api.get('/jobs/associate', { params });
    return response.data;
  },
  getSingleJob: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  createJob: async (data: any) => {
    const response = await api.post('/jobs', data);
    return response.data;
  },
  updateJobStatus: async (id: string, status: string) => {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },
  addNote: async (id: string, text: string) => {
    const response = await api.patch(`/jobs/${id}/notes`, { text });
    return response.data;
  },
  uploadResume: async (file: File, role?: string, company?: string, onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append('resume', file);
    if (role) formData.append('role', role);
    if (company) formData.append('company', company);

    const response = await api.post('/jobs/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(percent);
        }
      },
    });
    return response.data;
  },
  updateJob: async (id: string, data: any) => {
    const response = await api.patch(`/jobs/${id}`, data);
    return response.data;
  },
  deleteJob: async (id: string) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  }
};
