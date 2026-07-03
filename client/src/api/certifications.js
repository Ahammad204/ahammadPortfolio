import api from './axios';

export const getCertifications = (params) => api.get('/certifications', { params }).then((r) => r.data);
export const createCertification = (formData) => api.post('/certifications', formData);
export const updateCertification = (id, formData) => api.put(`/certifications/${id}`, formData);
export const deleteCertification = (id) => api.delete(`/certifications/${id}`);
export const updateCertificationOrder = (id, order) => api.patch(`/certifications/${id}/order`, { order });
