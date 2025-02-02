import { Comment, PostComment } from "@/model/interface";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCommentApi, postCommentApi } from "./commentAPI";

interface CommentState {
  comments: Comment[];
  loading?: boolean;
  error?: null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

export const getCommentByPostId = createAsyncThunk(
  "comments/fetchComments",
  async (postId: string) => {
    const comments = await getCommentApi(postId);
    console.log(comments);
    return comments;
  }
);

export const postComment = createAsyncThunk(
  "comments/postComment",
  async (payload: PostComment) => {
    const comment = await postCommentApi(payload);
    return comment;
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      /* Get comment by post id */
      .addCase(getCommentByPostId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentByPostId.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(getCommentByPostId.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* upload comment */
      .addCase(postComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.comments.unshift(action.payload.comment);
      })
      .addCase(postComment.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commentSlice.reducer;
