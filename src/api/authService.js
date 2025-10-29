import http from "./http-common";

const login = async (email, password) => {
  const response = await http.post("/admin/login", { email, password });
  const token = response?.data?.data?.token;
  if (token) {
    localStorage.setItem("access_token", token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("access_token");
};

export default {
  login,
  logout,
};
