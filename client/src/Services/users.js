import api from "./api";

export const login = async (username, password) => {
  const response = await api.post("/users/login", {
    username: username,
    password: password,
  });
  return response.data;
};

export const createUser = async (companyId, userRequestDto) => {
  const response = await api.post(
    `/company/${companyId}/users`,
    userRequestDto
  );
  return response.data;
};

export const getAllUsers = async (companyId) => {
  const response = await api.get(`/company/${companyId}/users`, {});
  return response.data;
};
