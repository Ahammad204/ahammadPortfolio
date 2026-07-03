import api from './axios';

export const getProfile = () => api.get('/profile').then((r) => r.data);
export const updateProfile = (data) => api.put('/profile', data);
export const uploadAvatar = (file) => {
  const fd = new FormData();
  fd.append('avatar', file);
  return api.post('/profile/avatar', fd);
};
export const updateResume = (resumeUrl) => {
  return api.put('/profile/resume', { resumeUrl });
};
