import baseURL from "@/lib/baseURL";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCurrentUser = createAsyncThunk("user/fetchCurrentUser", async () => {
  const { data } = await baseURL.get(`/auth/current-user`);
  return data;
});

export const getUserById = createAsyncThunk("users/fetchUserById", async (userId: string) => {
  const { data } = await baseURL.get(`/auth/users/${userId}`);
  return data;
});

export const sendFriendRequest = createAsyncThunk(
  "auth/friendRequest",
  async (friendId: string, { rejectWithValue }) => {
    try {
      const response = await baseURL.post(`/auth/friend-request/${friendId}`);
      return { message: response.data.message, friendId }; // Ensure this format
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Friend request failed");
    }
  }
);

export const acceptRequest = createAsyncThunk(
  "auth/acceptRequest",
  async (friendId: string, { rejectWithValue }) => {
    try {
      const response = await baseURL.post(`/auth/accept-request/${friendId}`);
      return { message: response.data.message, friendId }; // Ensure this format
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to accept request");
    }
  }
);

export const login = async (data: { email: string; password: string }) => {
  const response = await baseURL.post("/auth/login", data);
  return response.data;
};
