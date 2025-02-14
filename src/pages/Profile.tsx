import PostCard from "@/components/post-card/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostCardSkeleton } from "@/components/skeleton/post-card-skeleton";
import {
  acceptRequest,
  fetchCurrentUser,
  getUserById,
  sendFriendRequest,
} from "@/features/auth/authAPI";
import { getPosts } from "@/features/posts/postSlice";
import { AppDispatch, RootState } from "@/store";
import {
  Cake,
  Edit,
  Ellipsis,
  EllipsisVertical,
  ImageUp,
  MapPinCheckInside,
  School,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FriendSection from "@/components/Profile-friend-section/FriendSection";

const UserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.posts);
  const { currentUser, user } = useSelector((state: RootState) => state.auth);
  const { userId } = useParams();

  // Ensure `paramsUser` is declared before usage
  const filteredPost = posts.filter((post) => post.userId?._id === userId);

  // State for cover & profile photos
  const [coverPhoto, setCoverPhoto] = useState(
    "https://cdn.pixabay.com/photo/2020/06/18/17/08/sunset-5314319_1280.jpg"
  );
  const [profilePhoto, setProfilePhoto] = useState(currentUser?.photo);
  console.log(profilePhoto);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    if (userId) {
      dispatch(getUserById(userId));
    }
    dispatch(getPosts());
  }, [dispatch]);

  const isFriend = currentUser?.friends?.some((friend) => friend._id === user?._id);
  const hasSentRequest = currentUser?.sentRequests?.some((req) => req._id === user?._id);
  const hasReceivedRequest = currentUser?.friendRequests?.some((req) => req._id === user?._id);

  const handleAddFriend = async (receiverId: string) => {
    if (receiverId) {
      dispatch(sendFriendRequest(receiverId));
    }
  };

  const handleConfirmRequest = async (senderId: string) => {
    console.log(senderId);
    if (senderId) {
      dispatch(acceptRequest(senderId));
    }
  };

  const handleRejectRequest = async (senderId: string) => {
    try {
      await fetch("/api/friends/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: currentUser?._id, senderId }),
      });
      dispatch(fetchCurrentUser()); // Refresh state
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const handleCancelRequest = async (receiverId: string) => {
    try {
      await fetch("/api/friends/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: currentUser?._id, receiverId }),
      });
      dispatch(fetchCurrentUser()); // Refresh state
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  // Handle file selection and preview
  const handleCoverChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPhoto(url);
      await handleUpload(file, "cover"); // Upload to server
    }
  };

  const handleProfileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePhoto(url);
      await handleUpload(file, "profile"); // Upload to server
    }
  };

  // Function to handle image upload (Modify API endpoint)
  const handleUpload = async (file: string, type: string) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`/api/upload/${type}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        type === "cover" ? setCoverPhoto(data.imageUrl) : setProfilePhoto(data.imageUrl);
      } else {
        console.error("Upload failed:", data.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Cover Photo */}
      <Card className="mb-4 rounded-none shadow-sm border">
        <CardContent>
          <div className="relative h-48 w-full">
            <img src={coverPhoto} alt="Cover" className="w-full h-40 rounded-t-md object-cover" />
            {currentUser?._id === userId && (
              <div className="absolute bottom-10 right-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="coverUpload"
                  onChange={handleCoverChange}
                />
                <label htmlFor="coverUpload">
                  <ImageUp size={25} color="#3c538f" />
                </label>
              </div>
            )}
          </div>

          {/* Profile Photo */}
          <div className="relative w-32 h-32 -mt-16 mx-auto">
            {currentUser?._id === userId ? (
              <img
                src={currentUser?.photo}
                alt="Profile"
                className="w-32 h-32 border-2 border-[#94acea] rounded-full object-cover"
              />
            ) : (
              <img
                src={user?.photo}
                alt="Profile"
                className="w-32 h-32 border-2 border-[#94acea] rounded-full object-cover"
              />
            )}
            {currentUser?._id === userId && (
              <div className="absolute bottom-2 right-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profileUpload"
                  onChange={handleProfileChange}
                />
                <label htmlFor="profileUpload">
                  <ImageUp size={24} color="#3c538f" />
                </label>
              </div>
            )}
          </div>

          <div className="mx-5 pb-2 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold">
                  {currentUser?._id === userId ? currentUser?.username : user?.username}
                </h3>

                {/* Friend Buttons */}
                {currentUser?._id !== userId && (
                  <>
                    {isFriend ? (
                      <Button variant="outline" disabled>
                        <UserCheck /> Friends
                      </Button>
                    ) : hasReceivedRequest ? (
                      <>
                        <Button
                          variant="outline"
                          className="bg-blue-500 text-white hover:shadow-[#94acea]"
                          onClick={() => user?._id && handleConfirmRequest(user?._id)}
                        >
                          <UserCheck /> Confirm
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-red-400 text-white hover:text-red-500 hover:shadow-red-200"
                          onClick={() => user?._id && handleRejectRequest(user?._id)}
                        >
                          <X /> Reject
                        </Button>
                      </>
                    ) : hasSentRequest ? (
                      <Button
                        variant="outline"
                        className="bg-blue-500 text-white hover:text-red-500 hover:shadow-[#94acea]"
                        onClick={() => user?._id && handleCancelRequest(user?._id)}
                      >
                        <X /> Cancel Request
                      </Button>
                    ) : (
                      <Button
                        className="bg-blue-500 text-white hover:shadow-[#94acea]"
                        variant="outline"
                        onClick={() => user?._id && handleAddFriend(user?._id)}
                      >
                        <UserPlus />
                        Add Friend
                      </Button>
                    )}
                  </>
                )}
              </div>

              <p className="text-sm text-gray-500 my-2">
                Front-end Developer | JavaScript | React | Student at University of Rajshahi
              </p>
            </div>
            {currentUser?._id === userId ? <Edit /> : <EllipsisVertical />}
          </div>
        </CardContent>
        <CardFooter className="block md:hidden">
          <Button variant={"outline"}>About info</Button>
          <Button variant={"outline"}>Friends</Button>
        </CardFooter>
      </Card>

      {/* Friends List */}
      <div className="container mx-auto md:flex justify-center md:justify-between gap-6 2xl:gap-4">
        <section className="hidden md:block">
          <Card className="w-[350px] py-4 mb-2">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>About</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {currentUser?._id === userId && <Ellipsis />}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-10 bg-white">
                  <DropdownMenuItem>Edit About</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="p-3 flex flex-col gap-y-4">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1 text-sm font-medium">
                  <MapPinCheckInside size={16} color="#3c538f" /> Current City:
                </p>
                <p className="text-sm text-gray-600">Rajshahi</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1 text-sm font-medium">
                  <Cake size={16} color="#3c538f" /> Date of Birth:
                </p>
                <p className="text-sm text-gray-600">12 Nov 2001</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1 text-sm font-medium">
                  <School size={16} color="#3c538f" /> Occupation:
                </p>
                <p className="text-sm text-gray-600">Student</p>
              </div>
            </CardContent>
          </Card>

          {/* Friend section */}
          <FriendSection
            userId={userId ?? null}
            handleConfirmRequest={handleConfirmRequest}
            handleRejectRequest={handleRejectRequest}
          />
        </section>
        <Card className="max-w-lg">
          <p className="text-center my-2 text-2xl text-gray-700 font-bold">Your Timelines</p>
          <div className="max-w-lg">
            {loading && <PostCardSkeleton />}
            {filteredPost.length === 0 ? (
              <p className="w-lg">Post is empty</p>
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
