import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPost, fetchPostById, toggleReactionAPI } from "./postAPI";

interface Post {
  _id: string;
  userId: {
    _id?: string;
    username: string;
    country: string;
    photo: string;
  };
  image?: string;
  video?: string;
  body?: string;
  visibility: string;
  date: Date;
  likes?: [];
  dislikes?: [];
}

interface PostState {
  posts: Post[];
  selectedPost?: Post | null;
  reacted: Post | null;
  loading?: boolean;
  error: null;
}

const initialState: PostState = {
  posts: [],
  selectedPost: null,
  reacted: null,
  loading: false,
  error: null,
};

export const getPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const posts = await fetchPost();
  return posts;
});

// Fetch a single post by ID
export const getPostById = createAsyncThunk("posts/fetchPostById", async (postId: string) => {
  const post = await fetchPostById(postId);
  return post;
});

export const toggleReaction = createAsyncThunk(
  "reactions/  reactSlice",
  async ({ postId, userId, type }: { postId: string; userId: string; type: string }) => {
    const response = await toggleReactionAPI(postId, userId, type);
    return response;
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Handling fetchPosts
      .addCase(getPosts.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handling fetchPostById
      .addCase(getPostById.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = action.payload;
      })
      .addCase(getPostById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* handle user reaction */
      .addCase(toggleReaction.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(toggleReaction.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPost = action.payload;

        // Find the post in the state and update it
        const index = state.posts.findIndex((post) => post._id === updatedPost._id);
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
        // Update the reacted post
        if (state.selectedPost?._id === updatedPost._id) {
          state.selectedPost = updatedPost;
        }

        state.reacted = updatedPost;
      })
      .addCase(toggleReaction.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
