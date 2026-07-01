import api from './axios';

export const getSkills = () => api.get('/skills').then((r) => r.data);
export const createSkill = (data) => api.post('/skills', data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);
export const updateSkillOrder = (id, order) => api.patch(`/skills/${id}/order`, { order });
