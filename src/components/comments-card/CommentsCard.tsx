import { getShortTimeAgo } from "@/lib/getTimeCompare";
import { Comment } from "@/model/interface";
import { Ellipsis } from "lucide-react";
import { Link } from "react-router-dom";

interface CommentProps {
  comment: Comment;
}

const CommentsCard: React.FC<CommentProps> = ({ comment }) => {
  const date = new Date(comment.date);
  const shortTimeAgo = getShortTimeAgo(date);

  return (
    <>
      <div className="w-full flex items-start gap-1 md:gap-2">
        <img
          src={comment.userId?.photo}
          alt="Post Image"
          className="rounded-full w-10 h-10 border hover:border-blue-500 object-cover"
        />
        <div className="w-full mb-2">
          <div className="bg-gray-300 rounded-lg p-1">
            <div className="flex items-center justify-between">
              <Link to={"/profile"}>
                <h3 className="text-sm font-medium hover:underline hover:text-blue-800">
                  {comment.userId?.username}
                </h3>
              </Link>
              <Ellipsis />
            </div>
            <p>{comment.body}</p>
          </div>
          <div className="flex gap-3 text-[13px]">
            <p className="hover:underline cursor-pointer">{shortTimeAgo}</p>
            <p className="hover:underline cursor-pointer">Like</p>
            <p className="hover:underline cursor-pointer">Reply</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentsCard;
