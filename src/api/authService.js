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

  const getDeposits = async (page = 1, limit = 10) => {
  const response = await http.get("/admin/deposit/get-all-deposits", {
    params: { page, limit },
  });
  return response;
};

const getDepositById = async (id) => {
  const response = await http.get(`/admin/deposit/${id}`);
  return response;
};

  export default {
    login,
    logout,
    getDeposits,
    getDepositById,
  };
