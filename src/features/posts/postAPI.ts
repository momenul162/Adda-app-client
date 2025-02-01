import baseURL from "@/lib/baseURL";

// Fetch all posts
export const fetchPost = async () => {
  const response = await baseURL.get("/posts");
  return response.data;
};

// Fetch a single post by ID
export const fetchPostById = async (postId: string) => {
  const response = await baseURL.get(`/posts/${postId}`);
  return response.data;
};

/* Add new post api */
export const addNewPostAPI = async (newPost: {}) => {
  console.log(newPost);
  const response = await baseURL.post("/posts", newPost);
  return response.data;
};

export const toggleReactionAPI = async (postId: string, userId: string, type: string) => {
  try {
    const response = await baseURL.patch(`/posts/${postId}/react`, { userId, type });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
