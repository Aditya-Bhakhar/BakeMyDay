import { api } from "@/api/api";

export const loginUser = async (data) => {
  try {
    const response = await api.post("/user/login", data);
    return response.data;
  } catch (error) {
    console.error("ERROR :: in loginUser service :: ", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/user/logout");
    return response.data;
  } catch (error) {
    console.error("ERROR :: in loginUser service :: ", error);
    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    const response = await api.post("/user/register", data);
    return response.data;
  } catch (error) {
    console.error("ERROR :: in loginUser service :: ", error);
    throw error;
  }
};
