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
  }
};
