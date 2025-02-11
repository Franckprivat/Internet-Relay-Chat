import api from "./api.ts";


export const login = (email: string, password: string) => {
  return api.post("/user/login", { email, password });
};


export const getProfile = () => {
  return api.get("/auth/profile");
};


export const registerUser = (userData: {
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  password: string;
}) => {
  return api.post("/user/signup", userData);
};
