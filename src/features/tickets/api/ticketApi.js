import API from "../../../services/axios";

export const createTicketApi = async (data) => {
  const response = await API.post("/tickets/create", data);

  return response.data;
};

export const getMyTicketsApi = async () => {
  const response = await API.get("/tickets/my-tickets");

  return response.data;
};

export const getAllTicketsApi = async () => {
  const response = await API.get("/tickets/all");

  return response.data;
};