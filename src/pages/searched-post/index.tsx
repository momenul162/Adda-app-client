import DialogPost from "@/components/post-card/DialogPost";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { fetchCurrentUser } from "@/features/auth/authSlice";
import { getPostById } from "@/features/posts/postSlice";
import { AppDispatch, RootState } from "@/store";
import { ArrowLeft, SendHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const Post = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { postId } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const post: any = useSelector((state: RootState) => state.posts.selectedPost);

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId));
      dispatch(fetchCurrentUser());
    }
  }, [postId]);

  console.log(post);

  if (!post) {
    return;
  }

  return (
    <Dialog open={true}>
      <DialogContent id="dialog-post" className="bg-white max-w-2xl max-h-screen">
        <Link to={"/"}>
          <ArrowLeft />
        </Link>
        <DialogTitle>{`${user?.username}'s post`}</DialogTitle>
        <ScrollArea className="max-h-[700px]">
          <DialogPost post={post} />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <div>
          <DialogFooter>
            <img
              src={post.userId?.photo}
              alt="Post Image"
              style={{ objectFit: "cover" }}
              className="rounded-full w-10 h-10 border hover:border-blue-500"
            />
            <Textarea
              className="shadow-md w-full focus:border-gray-400 focus:border-2"
              placeholder={`Comment as ${user?.username}?`}
            />
            <SendHorizontal color="gray" className="hover:cursor-pointer" />
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Post;
