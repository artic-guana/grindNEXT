import api from '../lib/axios';

export const pageApi = {
  list: () => api.get('/api/v1/pages').then((response) => response.data),
  get: (id) => api.get(`/api/v1/pages/${id}`).then((response) => response.data),
  create: (payload) => api.post('/api/v1/pages', payload).then((response) => response.data),
  update: (id, payload) => api.patch(`/api/v1/pages/${id}`, payload).then((response) => response.data),
  remove: (id) => api.delete(`/api/v1/pages/${id}`).then((response) => response.data),
};
