import api from '../lib/axios.js';


export const taskApi = {
  async list(params = {}) {
    const response = await api.get(
      '/api/v1/tasks',
      {
        params,
      }
    );

    return response.data;
  },


  async create(payload) {
    const response = await api.post(
      '/api/v1/tasks',
      payload
    );

    return response.data;
  },


  async update(id, payload) {
    const response = await api.patch(
      `/api/v1/tasks/${id}`,
      payload
    );

    return response.data;
  },


  async complete(id) {
    const response = await api.patch(
      `/api/v1/tasks/${id}/complete`
    );

    return response.data;
  },


  async remove(id) {
    const response = await api.delete(
      `/api/v1/tasks/${id}`
    );

    return response.data;
  },
};