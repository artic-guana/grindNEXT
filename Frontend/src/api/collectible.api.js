import api from '../lib/axios';

export const collectibleApi = {
  list: (params = {}) => api.get('/api/v1/collectibles', { params }).then((response) => response.data),
  mine: () => api.get('/api/v1/collectibles/me').then((response) => response.data),
  buy: (id) => api.post(`/api/v1/collectibles/${id}/buy`).then((response) => response.data),
  equip: (ownedId) =>
    api.patch(`/api/v1/collectibles/owned/${ownedId}/equip`).then((response) => response.data),
};
