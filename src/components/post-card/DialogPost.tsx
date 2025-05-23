import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { deletePost, toggleReaction } from "@/features/posts/postSlice";
import { AppDispatch, RootState } from "@/store";
import {
  Ellipsis,
  FilePenLine,
  Globe,
  Link2,
  Lock,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useRef } from "react";
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
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import UpdatePostModal from "../UpdatePostModal";
import clsx from "clsx";

interface PostCardProps {
  post: Post;
}

const DialogPost: React.FC<PostCardProps> = ({ post }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const comments = useSelector((state: RootState) => state.comments.comments);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /* get comments */
  useEffect(() => {
    dispatch(getCommentByPostId(post._id));
  }, [post._id]);

  /* handle user reaction on post */
  const handleReaction = (type: string) => {
    if (!currentUser?._id) {
      return;
    }

    dispatch(toggleReaction({ postId: post?._id, userId: currentUser._id, type }));
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Pause all other videos before playing the current one
            document.querySelectorAll("video").forEach((vid) => {
              if (vid !== video) vid.pause();
            });
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // Trigger when at least 50% visible
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
      observer.disconnect();
    };
  }, []);

  // Check if user has already liked the post
  const hasLiked = post.likes?.includes(currentUser?._id);
  const hasDisliked = post.dislikes?.includes(currentUser?._id);

  /* handle post remove */
  const handleRemove = (id: string) => {
    if (currentUser?._id !== post.userId?._id) {
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
              <Link to={`/profile/${post.userId?._id}`}>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      {currentUser?._id === post?.userId?._id && (
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer"
                          onSelect={(e) => e.preventDefault()} // Prevents menu from closing
                        >
                          <FilePenLine size={16} /> Edit Post
                        </DropdownMenuItem>
                      )}
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Edit Post</DialogTitle>
                      <UpdatePostModal post={post} />
                    </DialogContent>
                  </Dialog>
                  <DropdownMenuItem>
                    <Link2 /> Copy Link
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {currentUser?._id === post?.userId?._id && (
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
                className="w-full object-cover max-h-[600px] rounded-md"
              />
            </div>
          )}
          {post?.video && (
            <div className="mt-2 relative rounded-md">
              <video
                src={post?.video}
                className="w-full max-h-[600px] rounded-md"
                controls
                ref={videoRef}
              />
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
              {post.likes?.length || ""}
              <ThumbsUp
                color={clsx(hasLiked ? "blue" : "black")}
                strokeWidth={clsx(hasLiked ? "3" : "2")}
              />
            </Button>
            <Button
              onClick={() => handleReaction("dislike")}
              variant={"outline"}
              className="border-non hover:bg-blue-200 hover:text-black"
            >
              {post.dislikes?.length || ""}{" "}
              <ThumbsDown
                color={clsx(hasDisliked ? "blue" : "black")}
                strokeWidth={clsx(hasDisliked ? "3" : "2")}
              />
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
