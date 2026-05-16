import api from './axios';

export const usersApi = {
  getAssignedClients: async () => {
    const response = await api.get('/users/clients');
    return response.data;
  }
};
