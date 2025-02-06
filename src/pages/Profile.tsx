import PostCard from "@/components/post-card/PostCard";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarSkeletonFull, CoverSkeleton } from "@/components/ui/skeleton/avatar-skeleton";
import { PostCardSkeleton } from "@/components/ui/skeleton/post-card-skeleton";
import { fetchCurrentUser } from "@/features/auth/authSlice";
import { getPosts } from "@/features/posts/postSlice";
import { AppDispatch, RootState } from "@/store";
import { Edit } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const disPatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.posts);
  const { user, loading: userLoading } = useSelector((state: RootState) => state.auth);
  const { username } = useParams();

  useEffect(() => {
    disPatch(fetchCurrentUser());
    disPatch(getPosts());
  }, [disPatch]);

  const filteredPost = posts.filter((post) => post.userId?.username === username);

  const paramsUser = posts.find((post) => post.userId?.username === username);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Cover Photo */}
      <Card className="mb-4 rounded-none shadow-sm border">
        <CardContent>
          <div className="relative h-48 w-full">
            {userLoading ? (
              <CoverSkeleton />
            ) : (
              <img
                src="https://cdn.pixabay.com/photo/2020/06/18/17/08/sunset-5314319_1280.jpg"
                alt="Cover"
                className="w-full h-40 rounded-t-md object-cover"
              />
            )}
          </div>
          {/* Profile Photo */}
          <div className="relative w-32 h-32 -mt-16 mx-auto">
            {userLoading ? (
              <AvatarSkeletonFull />
            ) : (
              <img
                src={user?.username === username ? user?.photo : paramsUser?.userId?.photo}
                alt="Profile"
                className="w-32 h-32 border-2 border-[#94acea] rounded-full"
              />
            )}
          </div>
          <div className="mx-5 pb-2 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">
                {user?.username === username ? user?.username : paramsUser?.userId?.username}
              </h3>
              <p className="text-sm text-gray-500 my-2">
                Front-end Developer | JavaScript | React | Student at University of Rajshahi
              </p>
            </div>
            <Edit />
          </div>
        </CardContent>
      </Card>

      {/* Friends List */}
      <div className="container mx-auto md:flex justify-center md:justify-between gap-6 2xl:gap-4">
        <section className="md:max-w-xs xl:max-w-sm">
          <div>About Section</div>
          <div>Friends list</div>
        </section>
        <Card className="max-w-md">
          <p className="text-center my-2 text-2xl text-gray-700 font-bold">Your Timelines</p>
          <div>
            {loading && <PostCardSkeleton />}
            {filteredPost.length === 0 ? (
              <p>Post is empty</p>
            ) : (
              filteredPost.map((post) => <PostCard key={post._id} post={post} />)
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
