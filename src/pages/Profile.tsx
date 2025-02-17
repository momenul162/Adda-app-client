import PostCard from "@/components/post-card/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PostCardSkeleton } from "@/components/skeleton/post-card-skeleton";
import {
  acceptRequest,
  fetchCurrentUser,
  getUserById,
  sendFriendRequest,
  updateUserProfile,
} from "@/features/auth/authAPI";
import { getPosts } from "@/features/posts/postSlice";
import { AppDispatch, RootState } from "@/store";
import {
  Cake,
  Edit,
  Ellipsis,
  EllipsisVertical,
  ImageUp,
  Mail,
  MapPinCheckInside,
  Phone,
  School,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FriendSection from "@/components/Profile-friend-section/FriendSection";
import AboutRow from "@/components/about/AboutRow";
import { AvatarSkeletonFull, CoverSkeleton } from "@/components/skeleton/avatar-skeleton";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UpdateBio from "@/components/Bio/UpdateBio";
import UpdateAbout from "@/components/about/UpdateAbout";
import uploadToCloudinary from "@/components/upload-widget/uploadForPost";

const UserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.posts);
  const { currentUser, user, loading: isLoading } = useSelector((state: RootState) => state.auth);
  const { userId } = useParams();

  // Ensure `paramsUser` is declared before usage
  const filteredPost = posts
    .filter((post) => post.userId?._id === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // State for cover & profile photos
  const [coverPhoto, setCoverPhoto] = useState(currentUser?.coverPhoto);
  const [profilePhoto, setProfilePhoto] = useState(currentUser?.photo);
  useEffect(() => {
    if (currentUser) {
      setCoverPhoto(currentUser.coverPhoto);
      setProfilePhoto(currentUser.photo);
    }
  }, [currentUser]);

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
    const url = await uploadToCloudinary(file, "image");
    setCoverPhoto(url);
    dispatch(updateUserProfile({ coverPhoto: url }))
      .unwrap()
      .then(() => {
        toast({
          title: "Success!",
          description: "Cover photo updated successfully",
        });
      });
  };

  const handleProfileChange = async (event: any) => {
    const imageFile = event.target.files[0];
    const url = await uploadToCloudinary(imageFile, "image");
    console.log(url);
    setProfilePhoto(url);
    dispatch(updateUserProfile({ photo: url }))
      .unwrap()
      .then(() => {
        toast({
          title: "Success!",
          description: "Profile photo updated successfully",
        });
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Cover Photo */}
      <Card className="mb-4 rounded-none shadow-sm border">
        <CardContent>
          <div className="relative h-48 w-full">
            {isLoading && !coverPhoto && <CoverSkeleton />}
            {currentUser?._id === userId ? (
              <img
                src={coverPhoto}
                alt="Upload your cover photo"
                className="w-full h-40 rounded-t-md border object-cover"
              />
            ) : (
              <img
                src={user?.coverPhoto}
                alt="Not upload cover photo yet"
                className="w-full h-40 rounded-t-md border object-cover"
              />
            )}
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
            {isLoading && !profilePhoto && <AvatarSkeletonFull />}
            {currentUser?._id === userId ? (
              <img
                src={profilePhoto}
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
                    ) : hasSentRequest && user ? (
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
                {currentUser?._id === userId
                  ? currentUser?.bio || "{ Update Your Bio }"
                  : user?.bio || "{ Empty Bio }"}
              </p>
            </div>
            {currentUser?._id === userId ? (
              <Dialog>
                <DialogTrigger>
                  <Edit />
                </DialogTrigger>
                <DialogContent className="bg-slate-300">
                  <DialogTitle>Update Name & Bio</DialogTitle>
                  <UpdateBio currentUser={currentUser} />
                </DialogContent>
              </Dialog>
            ) : (
              <div>
                <EllipsisVertical />
              </div>
            )}
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
              {currentUser?._id === userId && (
                <Dialog>
                  <DialogTrigger>
                    <Ellipsis />
                  </DialogTrigger>
                  <DialogContent className="bg-slate-300">
                    <DialogTitle>Update Name & Bio</DialogTitle>
                    <UpdateAbout />
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent className="p-3 flex flex-col gap-y-4">
              <AboutRow
                icon={<MapPinCheckInside size={16} color="#3c538f" />}
                propertyName="Current City"
                value={
                  currentUser?._id === userId
                    ? currentUser?.currentCity || "..."
                    : user?.currentCity || "..."
                }
              />
              <AboutRow
                icon={<Cake size={16} color="#3c538f" />}
                propertyName="Date of Birth"
                value={
                  currentUser?._id === userId
                    ? currentUser?.dateOfBirth
                      ? new Date(currentUser?.dateOfBirth).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "././."
                    : user?.dateOfBirth
                    ? new Date(user?.dateOfBirth).toLocaleDateString()
                    : "././."
                }
              />

              <AboutRow
                icon={<School size={16} color="#3c538f" />}
                propertyName="Occupation"
                value={
                  currentUser?._id === userId
                    ? currentUser?.occupation || "..."
                    : user?.occupation || "..."
                }
              />
              <AboutRow
                icon={<Mail size={16} color="#3c538f" />}
                propertyName="Email"
                value={currentUser?._id === userId ? currentUser?.email || "" : user?.email || ""}
              />
              <AboutRow
                icon={<Phone size={16} color="#3c538f" />}
                propertyName="Mobile"
                value={currentUser?._id === userId ? currentUser?.phone || "" : user?.phone || ""}
              />
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
