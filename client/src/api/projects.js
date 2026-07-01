import api from './axios';

export const getProjects = (params) => api.get('/projects', { params }).then((r) => r.data);
export const getProjectBySlug = (slug) => api.get(`/projects/${slug}`).then((r) => r.data);
export const createProject = (formData) => api.post('/projects', formData);
export const updateProject = (id, formData) => api.put(`/projects/${id}`, formData);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const updateProjectOrder = (id, order) => api.patch(`/projects/${id}/order`, { order });
