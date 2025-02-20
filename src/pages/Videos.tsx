import VideoPlayer from "@/components/post-card/videoPlayer";
import { VideoCardSkeleton } from "@/components/skeleton/video-card-skeleton";
import { getPosts } from "@/features/posts/postSlice";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Videos = () => {
  const disPatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    disPatch(getPosts());
  }, [disPatch]);
  return (
    <div className="">
      {loading ? (
        <VideoCardSkeleton />
      ) : (
        <>{posts && posts.map((post: any) => <VideoPlayer key={post?._id} post={post} />)}</>
      )}
    </div>
  );
};

export default Videos;
