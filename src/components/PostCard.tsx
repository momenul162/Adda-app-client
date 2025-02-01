import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toggleReaction } from "@/features/posts/postSlice";
import { AppDispatch, RootState } from "@/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface PostCardProps {
  post: {
    _id: string;
    userId?: {
      _id: string;
      username: string;
      email: string;
      country: string;
      photo: string;
    };
    body?: string;
    image?: string;
    video?: string;
    date?: Date;
    likes?: any;
    dislikes?: any;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [type, setType] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleReaction = (type: string) => {
    if (!user?._id) {
      return;
    }

    dispatch(toggleReaction({ postId: post?._id, userId: user._id, type }));
    setType(type);
  };

  const date = new Date(`${post?.date}`);

  const formattedDate = date?.toLocaleString("en-US", {
    year: "2-digit",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Card className="my-4 w-full shadow-lg max-w-2xl mx-auto border">
      {/* ... (rest of the component remains the same) */}
      <CardHeader>
        {/* Placeholder for Author Avatar (replace with actual image) */}
        <img
          src={post.userId?.photo}
          alt="Post Image"
          style={{ objectFit: "cover" }}
          className="rounded-full w-10 h-10 border hover:border-blue-500"
        />
        <div>
          <Link to={"/profile"}>
            <h3 className="text-sm font-medium hover:underline hover:text-blue-800">
              {post.userId?.username}
            </h3>
          </Link>
          {formattedDate && <p className="text-xs text-gray-500">{formattedDate}</p>}
        </div>
      </CardHeader>
      <CardContent>
        {post.body && <p className="text-sm p-2">{post?.body}</p>}

        {post?.image && (
          <div className="mt-2 relative aspect-video overflow-hidden rounded-md">
            <img
              src={post?.image}
              alt="Post image"
              style={{ objectFit: "cover" }}
              className="rounded-md"
            />
          </div>
        )}
        {post?.video && (
          <div className="mt-2 relative aspect-video overflow-hidden rounded-md">
            <video src={post?.video} className="w-full h-full rounded-md" controls />
          </div>
        )}
      </CardContent>
      <CardFooter className="px-1 sm:px-2 md:px-5 flex items-center justify-between py-2 border-t">
        <div className="flex md:space-x-4 text-sm text-gray-600">
          <Button
            onClick={() => handleReaction("like")}
            variant={"outline"}
            className="border-none hover:bg-blue-200 hover:text-black"
          >
            {post.likes?.length || ""} {type === "like" ? "Liked" : "Like"}
          </Button>
          <Button
            onClick={() => handleReaction("dislike")}
            variant={"outline"}
            className="border-non hover:bg-blue-200 hover:text-black"
          >
            {post.dislikes?.length || ""} {type === "dislike" ? "Disliked" : "Dislike"}
          </Button>
          <Button variant={"outline"} className="border-none hover:bg-blue-200 hover:text-black">
            Comments
          </Button>
        </div>
        <Button variant={"outline"} className="border-none hover:bg-blue-200 hover:text-black">
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
