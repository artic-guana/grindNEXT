import api from '../lib/axios';

export const gamificationApi = {
  overview: () => api.get('/api/v1/gamification/overview').then((response) => response.data),
  dailyActivity: () =>
    api.post('/api/v1/gamification/daily-activity').then((response) => response.data),
};
