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
  SendHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import React, { useEffect, useRef } from "react";
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
} from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog";
import DialogPost from "./DialogPost";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Post } from "@/model/interface";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { commentSchema } from "@/model/schema";
import { postComment } from "@/features/comment/commentSlice";
import { getTimeCompare } from "@/lib/getTimeCompare";
import UpdatePostModal from "../UpdatePostModal";

interface PostCardProps {
  post: Post;
}

const VideoPlayer: React.FC<PostCardProps> = ({ post }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { register, handleSubmit, reset } = useForm<{ body: string }>({
    resolver: yupResolver(commentSchema),
  });

  const onSubmit = ({ body }: { body: string }) => {
    if (!currentUser?._id) {
      return;
    }
    const payload = { userId: currentUser?._id, postId: post._id, body };
    console.log(payload);

    dispatch(postComment(payload)).then(() => {
      console.log("Successfully comment");
      reset();
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedVolume = localStorage.getItem("videoVolume");
    if (savedVolume !== null) {
      document.querySelectorAll("video").forEach((vid) => {
        vid.volume = parseFloat(savedVolume);
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Pause all other videos before playing the current one
            document.querySelectorAll("video").forEach((vid) => {
              if (vid !== video) vid.pause();
            });

            // Play this video
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

  const handleVolume = (e: React.ChangeEvent<HTMLVideoElement>) => {
    const newVolume = e.target.volume;
    localStorage.setItem("videoVolume", newVolume.toString());

    // Apply the same volume to all videos
    document.querySelectorAll("video").forEach((vid) => {
      vid.volume = newVolume;
    });
  };

  /* handle post copy link */
  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/posts/${post._id}`; // Construct post URL
    navigator.clipboard
      .writeText(postUrl) // Copy to clipboard
      .then(() => alert("Link copied to clipboard!")) // Show confirmation
      .catch((err) => console.error("Failed to copy:", err)); // Handle errors
  };

  /* Handle user reaction */
  const handleReaction = (type: string) => {
    if (!currentUser?._id) {
      return;
    }

    dispatch(toggleReaction({ postId: post?._id, userId: currentUser._id, type }));
  };

  // Check if user has already liked the post
  const hasLiked = post.likes?.includes(currentUser?._id);
  const hasDisliked = post.dislikes?.includes(currentUser?._id);

  /* Handle post delete */
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

  if (!post?.video) return null; // Hide the post if no video

  return (
    <Card className="my-8 md:my-4 w-full shadow-lg mx-auto max-w-4xl border">
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
            <div className="flex gap-1">
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
                <DropdownMenuItem onClick={handleCopyLink}>
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

      {/* Video player */}
      <CardContent>
        {post.body && <p className="text-sm p-2">{post?.body}</p>}
        <div className="mt-2 relative overflow-hidden rounded-md">
          <video
            ref={videoRef}
            src={post?.video}
            onVolumeChange={handleVolume}
            className="w-full max-h-[500px] rounded-md"
            controls
          />
        </div>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={"outline"}
                className="border-none hover:bg-blue-200 hover:text-black"
              >
                Comments
              </Button>
            </DialogTrigger>
            <DialogContent id="dialog-post" className="bg-white max-w-2xl max-h-screen">
              <DialogTitle>{`${post.userId?.username}'s post`}</DialogTitle>
              <ScrollArea className="max-h-[700px]">
                <DialogPost post={post} />
                <ScrollBar orientation="vertical" />
              </ScrollArea>
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogFooter>
                  <img
                    src={currentUser?.photo}
                    alt="Post Image"
                    style={{ objectFit: "cover" }}
                    className="rounded-full w-10 h-10 border hover:border-blue-500"
                  />
                  <Textarea
                    id="body"
                    className="shadow-md w-full focus:border-gray-400 focus:border-2"
                    placeholder={`Comment as ${currentUser?.username}?`}
                    {...register("body")}
                  />
                  <button type="submit">
                    <SendHorizontal color="gray" className="hover:cursor-pointer" />
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Button variant={"outline"} className="border-none hover:bg-blue-200 hover:text-black">
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoPlayer;
