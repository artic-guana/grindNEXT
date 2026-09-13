import api from '../lib/axios';

export const appAuthApi = {
  me: () => api.get('/api/v1/auth/me').then((response) => response.data),
};
