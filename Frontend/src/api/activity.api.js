import api from '../lib/axios';

export const activityApi = {
  list: (limit = 20) =>
    api.get('/api/v1/activity', { params: { limit } }).then((response) => response.data),
};
