import api from '../lib/axios';

export const profileApi = {
  getMe: () => api.get('/api/v1/profile/me').then((response) => response.data),
  updateMe: (payload) => api.patch('/api/v1/profile/me', payload).then((response) => response.data),
};
