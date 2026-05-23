import api from './axios';

export const subscriptionsApi = {
  getPlans: async () => {
    const response = await api.get('/plans');
    return response.data;
  }
};
