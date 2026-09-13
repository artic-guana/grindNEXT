import api from '../lib/axios';

export const achievementApi = {
  list: () => api.get('/api/v1/achievements').then((response) => response.data),
  mine: () => api.get('/api/v1/achievements/me').then((response) => response.data),
  check: () => api.post('/api/v1/achievements/check').then((response) => response.data),
};
