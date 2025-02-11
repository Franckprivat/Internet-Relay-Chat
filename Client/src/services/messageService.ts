import api from "./api.ts";

export const getMessages = (chatId: number) => {
  return api.get(`/messages/${chatId}`);
};

export const sendMessage = (chatId: number, message: string) => {
  return api.post(`/messages/${chatId}`, { message });
};