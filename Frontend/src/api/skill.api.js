import api from '../lib/axios';

export const skillApi = {
  list: () => api.get('/api/v1/skills').then((response) => response.data),
  create: (payload) => api.post('/api/v1/skills', payload).then((response) => response.data),
  update: (id, payload) => api.patch(`/api/v1/skills/${id}`, payload).then((response) => response.data),
  addXp: (id, amount) => api.patch(`/api/v1/skills/${id}/xp`, { amount }).then((response) => response.data),
  remove: (id) => api.delete(`/api/v1/skills/${id}`).then((response) => response.data),
};
