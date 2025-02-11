import api from './api.ts';

export const login = async (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};
