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
