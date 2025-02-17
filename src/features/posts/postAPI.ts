import baseURL from "@/lib/baseURL";
import { createPostValue, postValueInterface } from "@/model/interface";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all posts
export const fetchPost = async () => {
  const response = await baseURL.get("/posts");
  return response.data;
};

// Fetch all posts
export const deletePostAPI = async (postId: string) => {
  const response = await baseURL.delete(`/posts/${postId}`);
  return response.data;
};

// Fetch a single post by ID
export const fetchPostById = async (postId: string) => {
  const response = await baseURL.get(`/posts/${postId}`);
  return response.data;
};

/* Add new post api */
export const addNewPostAPI = async (newPost: postValueInterface) => {
  const response = await baseURL.post("/posts", newPost);
  return response.data;
};

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (
    { postId, updatedData }: { postId: string; updatedData: createPostValue },
    { rejectWithValue }
  ) => {
    try {
      const response = await baseURL.patch(`/posts/${postId}`, updatedData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Post update request failed");
    }
  }
);

export const toggleReactionAPI = async (postId: string, userId: string, type: string) => {
  try {
    const response = await baseURL.patch(`/posts/${postId}/react`, { userId, type });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
