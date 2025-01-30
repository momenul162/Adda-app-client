import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { getCurrentUser } from './getUser';

interface User {
    _id?: string,
    username: string,
    email: string,
    isActive?: string,
    country: string,
    photo: string,
    phone: string
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading?: boolean;
    error: null;
}

const initialState: AuthState ={
    user: null,
    token: null,
    loading: false,
    error: null,
}

export const fetchCurrentUser = createAsyncThunk('user/fetchUser', async () => {
    const user = await getCurrentUser();
    return user;
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{user: User, token: string}>){
            state.user = action.payload.user,
            state.token = action.payload.token
        },
        logout(state) {
            state = initialState
            localStorage.removeItem('jwt-token');
        }
    },

    extraReducers: (builder)=> {
        builder.addCase(fetchCurrentUser.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading =false;
            state.user = action.payload;
        })
        .addCase(fetchCurrentUser.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        })
    },
})

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;