import axiosClient from './axiosClient';

export const createSessionApi = async (sessionConfig) => {
  const response = await axiosClient.post('/sessions', sessionConfig);
  return response.data;
};

export const getSessionByIdApi = async (sessionId) => {
  const response = await axiosClient.get(`/sessions/${sessionId}`);
  return response.data;
};

export const submitAnswerApi = async (sessionId, answerData) => {
  const response = await axiosClient.patch(`/sessions/${sessionId}/answer`, answerData);
  return response.data;
};

export const completeSessionApi = async (sessionId) => {
  const response = await axiosClient.patch(`/sessions/${sessionId}/complete`);
  return response.data;
};

export const deleteSessionApi = async (sessionId) => {
  const response = await axiosClient.delete(`/sessions/${sessionId}`);
  return response.data;
};

export const getUserSessionsApi = async () => {
  const response = await axiosClient.get('/sessions');
  return response.data;
};

export const getDashboardSummaryApi = async () => {
  const response = await axiosClient.get('/dashboard/summary');
  return response.data;
};
