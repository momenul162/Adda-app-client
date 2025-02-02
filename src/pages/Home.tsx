import AsideSection from "@/components/AsideSection";
import PostCard from "@/components/post-card/PostCard";
import PostInputBox from "@/components/PostInputBox";
import { fetchCurrentUser } from "@/features/auth/authSlice";
import { getPosts } from "@/features/posts/postSlice";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const disPatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const loading = useSelector((state: RootState) => state.posts.loading);

  useEffect(() => {
    disPatch(fetchCurrentUser());
    disPatch(getPosts());
  }, [disPatch]);

  return (
    <div className="container mx-auto lg:flex lg:justify-around gap-52 2xl:gap-4">
      <section className="max-w-2xl lg:max-w-xs 2xl:max-w-sm">
        <AsideSection />
      </section>
      <section className="max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-md 2xl:max-w-2xl">
        <PostInputBox />
        <div>{posts && posts.map((post: any) => <PostCard key={post?._id} post={post} />)}</div>
      </section>
    </div>
  );
};

export default Home;
