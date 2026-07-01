import api from './axios';

export const getExperience = () => api.get('/experience').then((r) => r.data);
export const createExperience = (data) => api.post('/experience', data);
export const updateExperience = (id, data) => api.put(`/experience/${id}`, data);
export const deleteExperience = (id) => api.delete(`/experience/${id}`);
export const updateExperienceOrder = (id, order) => api.patch(`/experience/${id}/order`, { order });
