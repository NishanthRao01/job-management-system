import api from './axios';

export const subscriptionsApi = {
  getPlans: async () => {
    const response = await api.get('/plans');
    return response.data;
  },
  createSubscription: async (planId: string) => {
    const response = await api.post('/subscriptions', { planId });
    return response.data;
  }
};
