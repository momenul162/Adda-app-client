import baseURL from "@/lib/baseURL";
import { PostComment } from "@/model/interface";

export const postCommentApi = async (data: PostComment) => {
  const response = await baseURL.post(`/comments`, data);
  return response.data;
};

export const getCommentApi = async (postId: string) => {
  const response = await baseURL.get(`/comments/${postId}`);
  return response.data;
};
