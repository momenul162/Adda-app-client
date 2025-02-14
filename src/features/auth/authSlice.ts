import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "@/model/interface";
import { acceptRequest, fetchCurrentUser, getUserById, sendFriendRequest } from "./authAPI";

interface AuthState {
  user: User | null;
  currentUser: User | null;
  token: string | null;
  loading?: boolean;
  error: null;
}

const initialState: AuthState = {
  user: null,
  currentUser: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      (state.currentUser = action.payload.user), (state.token = action.payload.token);
    },
    logout(state: AuthState) {
      state.currentUser = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("jwt-token");
    },
  },

  extraReducers: (builder) => {
    builder
      /* Get current user */
      .addCase(fetchCurrentUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Get user By id */
      .addCase(getUserById.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Friend request */
      .addCase(sendFriendRequest.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (state.currentUser) {
          state.currentUser.sentRequests.push(action.payload.friendId);
        }
      })
      .addCase(sendFriendRequest.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Friend request */
      .addCase(acceptRequest.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(acceptRequest.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (state.currentUser) {
          state.currentUser.friendRequests = state.currentUser.friendRequests.filter(
            (id) => id !== action.payload.friendId
          );
          state.currentUser.friends.push(action.payload.friendId);
        }
      })
      .addCase(acceptRequest.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
