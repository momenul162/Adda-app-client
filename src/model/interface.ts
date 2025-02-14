export interface Post {
  _id: string;
  userId?: {
    _id: string;
    username: string;
    country: string;
    photo?: string;
  };
  body?: string;
  image?: string;
  video?: string;
  date: Date;
  likes: any;
  dislikes: any;
  visibility: string;
}

export interface RegisterFormValues {
  username: string;
  email: string;
  phone: string;
  password: string;
  photo?: FileList | null;
  country: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface createPostValue {
  visibility: string;
  body?: string;
  image?: FileList | null;
  video?: FileList | null;
}

export interface FriendType {
  _id: string;
  username: string;
  photo: string;
  email: string;
}
export interface User {
  _id?: string;
  username: string;
  email: string;
  isActive?: string;
  country: string;
  photo: string;
  phone: string;
  bio?: string;
  occupation: string;
  dateOfBirth: string;
  currentCity: string;
  friends: FriendType[];
  friendRequests: FriendType[];
  sentRequests: FriendType[];
}

export interface Comment {
  _id: string;
  userId: {
    _id: string;
    username: string;
    photo: string;
  };
  postId: string;
  body: string;
  date: Date;
}

export interface PostComment {
  userId: string;
  postId: string;
  body: string;
}
