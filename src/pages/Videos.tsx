import VideoPlayer from "@/components/post-card/videoPlayer";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const Videos = () => {
  const posts = useSelector((state: RootState) => state.posts.posts);
  return (
    <div>{posts && posts.map((post: any) => <VideoPlayer key={post?._id} post={post} />)}</div>
  );
};

export default Videos;
