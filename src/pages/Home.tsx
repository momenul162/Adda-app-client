import AsideSection from "@/components/AsideSection";
import PostCard from "@/components/post-card/PostCard";
import PostInputBox from "@/components/PostInputBox";
import { PostCardSkeleton } from "@/components/skeleton/post-card-skeleton";
import { fetchCurrentUser } from "@/features/auth/authAPI";
import { getPosts } from "@/features/posts/postSlice";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const disPatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    disPatch(fetchCurrentUser());
    disPatch(getPosts());
  }, [disPatch]);

  return (
    <div className="container mx-auto lg:flex justify-center lg:justify-around gap-52 2xl:gap-4">
      <section>
        <AsideSection />
      </section>
      <section className="max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-md 2xl:max-w-2xl">
        <PostInputBox />
        <div>
          {loading ? (
            <PostCardSkeleton />
          ) : (
            <>{posts && posts.map((post: any) => <PostCard key={post?._id} post={post} />)}</>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
