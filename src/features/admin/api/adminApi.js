import API from "../../../services/axios";

export const getAllTicketsApi = async () => {
  const response = await API.get("/tickets/all");

  return response.data;
};

export const updateTicketsApi = async (id, data)=>{
    const response = await API.put(`/tickets/update/${id}`,
        data
    )
    return response.data;
}