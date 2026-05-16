import api from './axios';

export const messagesApi = {
  getMessages: async (contactId: string) => {
    const response = await api.get(`/messages/${contactId}`);
    return response.data;
  },
};
