import axiosClient from './axiosClient';

export const loginApi = async (credentials) => {
  const response = await axiosClient.post('/auth/login', credentials);
  return response.data;
};

export const signupApi = async (userData) => {
  const response = await axiosClient.post('/auth/signup', userData);
  return response.data;
};

export const fetchMeApi = async () => {
  const response = await axiosClient.get('/auth/me');
  return response.data;
};

export const updateProfileImageApi = async (imageData) => {
  const response = await axiosClient.put('/auth/profile-image', imageData);
  return response.data;
};

export const forgotPasswordApi = async (emailData) => {
  const response = await axiosClient.post('/auth/forgot-password', emailData);
  return response.data;
};

export const resetPasswordApi = async (resetData) => {
  const response = await axiosClient.post('/auth/reset-password', resetData);
  return response.data;
};
