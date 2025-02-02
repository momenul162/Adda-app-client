import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { deletePost, toggleReaction } from "@/features/posts/postSlice";
import { AppDispatch, RootState } from "@/store";
import { Ellipsis, FilePenLine, Globe, Link2, Lock, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Post } from "@/model/interface";
import { getCommentByPostId } from "@/features/comment/commentSlice";
import { getTimeCompare } from "@/lib/getTimeCompare";
import CommentsCard from "../comments-card/CommentsCard";

interface PostCardProps {
  post: Post;
}

const DialogPost: React.FC<PostCardProps> = ({ post }) => {
  const [type, setType] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const comments = useSelector((state: RootState) => state.comments.comments);

  /* get comments */
  useEffect(() => {
    dispatch(getCommentByPostId(post._id));
  }, [post._id]);

  /* handle user reaction on post */
  const handleReaction = (type: string) => {
    if (!user?._id) {
      return;
    }

    dispatch(toggleReaction({ postId: post?._id, userId: user._id, type }));
    setType(type);
  };

  // Check if user has already liked the post
  const hasLiked = post.likes?.includes(user?._id);
  const hasDisliked = post.dislikes?.includes(user?._id);

  /* handle post remove */
  const handleRemove = (id: string) => {
    if (user?._id !== post.userId?._id) {
      return;
    }

    dispatch(deletePost(id)).then(() => {
      console.log("Deleted successful");
    });
  };

  const date = new Date(post?.date);
  const formattedDate = getTimeCompare(date);

  return (
    <div>
      <Card className="w-full shadow-lg">
        {/* ... (rest of the component remains the same) */}
        <CardHeader className="justify-between">
          {/* Placeholder for Author Avatar (replace with actual image) */}
          <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-1">
                {formattedDate && <p className="text-xs text-gray-500">{formattedDate}</p>}
                <button>
                  {post.visibility === "PUBLIC" && <Globe size={13} color="gray" />}
                  {post.visibility === "PRIVATE" && <Lock size={13} color="gray" />}
                  {post.visibility === "FRIEND" && <Users size={13} color="gray" />}
                </button>
              </div>
            </div>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-30 bg-white">
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <FilePenLine /> Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link2 /> Copy Link
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {user?._id === post?.userId?._id && (
                  <DropdownMenuLabel
                    onClick={() => handleRemove(post._id)}
                    className="flex items-center gap-2 cursor-default"
                  >
                    <Trash2 color="red" size={16} />
                    Delete Post
                  </DropdownMenuLabel>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {post.body && <p className="text-sm p-2">{post?.body}</p>}

          {post?.image && (
            <div className="mt-2 relative rounded-md">
              <img
                src={post?.image}
                alt="Post image"
                className="rounded-md max-h-full min-w-full object-cover"
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
              {post.likes?.length || ""} {hasLiked ? "Liked" : "Like"}
            </Button>
            <Button
              onClick={() => handleReaction("dislike")}
              variant={"outline"}
              className="border-non hover:bg-blue-200 hover:text-black"
            >
              {post.dislikes?.length || ""} {hasDisliked ? "Disliked" : "Dislike"}
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

      <div className="mt-4 mb-2">
        {comments &&
          comments.map((comment) => <CommentsCard key={comment._id} comment={comment} />)}
      </div>
    </div>
  );
};

export default DialogPost;
