import API from "../../../services/axios";

export const loginApi = async (data) => {
  const response = await API.post("/auth/login", data);

  return response.data;
};

export const registerApi = async (data) => {
  const response = await API.post("/auth/register", data);

  return response.data;
};