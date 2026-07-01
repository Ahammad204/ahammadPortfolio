import api from './axios';

export const submitContact = (data) => api.post('/contact', data);
export const getMessages = () => api.get('/contact').then((r) => r.data);
export const markAsRead = (id) => api.patch(`/contact/${id}/read`);
export const deleteMessage = (id) => api.delete(`/contact/${id}`);
