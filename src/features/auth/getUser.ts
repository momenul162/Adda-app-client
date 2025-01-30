import baseURL from "@/lib/baseURL";

export const getCurrentUser = async () => {
    const response = await baseURL.get(`/auth/current-user`);
    return response.data;
  };
  
  export const login = async (data: { email: string; password: string }) => {
    const response = await baseURL.post('/auth/login', data);
    return response.data;
  };
  