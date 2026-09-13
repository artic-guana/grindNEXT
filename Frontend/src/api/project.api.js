import api from '../lib/axios';

export const projectApi = {
  list: () => api.get('/api/v1/projects').then((response) => response.data),
  get: (id) => api.get(`/api/v1/projects/${id}`).then((response) => response.data),
  create: (payload) => api.post('/api/v1/projects', payload).then((response) => response.data),
  update: (id, payload) => api.patch(`/api/v1/projects/${id}`, payload).then((response) => response.data),
  syncProgress: (id) => api.patch(`/api/v1/projects/${id}/progress`).then((response) => response.data),
  complete: (id) => api.patch(`/api/v1/projects/${id}/complete`).then((response) => response.data),
  remove: (id) => api.delete(`/api/v1/projects/${id}`).then((response) => response.data),
};
