import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "@/model/interface";
import {
  acceptRequest,
  cancelFriendRequest,
  fetchCurrentUser,
  getUserById,
  rejectRequest,
  sendFriendRequest,
  updateUserProfile,
} from "./authAPI";

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

      /* Update user profile */
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = { ...state.currentUser, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* send fd request */
      .addCase(sendFriendRequest.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.user = action.payload.friend;
      })
      .addCase(sendFriendRequest.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* cancel friend request */
      .addCase(cancelFriendRequest.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(cancelFriendRequest.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.user = action.payload.friend;
      })
      .addCase(cancelFriendRequest.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* accept request */
      .addCase(acceptRequest.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(acceptRequest.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.user = action.payload.friend;
      })
      .addCase(acceptRequest.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* reject request */
      .addCase(rejectRequest.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(rejectRequest.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.user = action.payload.friend;
      })
      .addCase(rejectRequest.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
