import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FriendType } from "@/model/interface";
import { UserCheck, X } from "lucide-react";

const FriendSection = ({
  userId,
  handleConfirmRequest,
  handleRejectRequest,
}: {
  userId: string | null;
  handleConfirmRequest: Function;
  handleRejectRequest: Function;
}) => {
  const [listName, setListName] = useState<string>("friends");
  const [showList, setShowList] = useState<FriendType[]>([]);
  const { currentUser, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    handleShowFriend("friends");
  }, []);

  const handleShowFriend = (value: string) => {
    setListName(value);

    if (currentUser?._id === userId) {
      // Show current user's lists when they view their own profile
      if (value === "friends") {
        setShowList(currentUser?.friends ?? []);
      } else if (value === "requestFriends") {
        setShowList(currentUser?.friendRequests ?? []);
      } else if (value === "sentFriends") {
        setShowList(currentUser?.sentRequests ?? []);
      }
    } else {
      // Show another user's lists when viewing their profile
      if (value === "friends") {
        setShowList(user?.friends ?? []);
      } else if (value === "following") {
        setShowList(user?.sentRequests ?? []);
      } else if (value === "followers") {
        setShowList(user?.friendRequests ?? []);
      }
    }
  };
  return (
    <Card className="py-4 h-[500px]">
      <CardHeader className="gap-1 px-1">
        <Button
          onClick={() => handleShowFriend("friends")}
          variant={"outline"}
          className="hover:text-blue-600 hover:shadow-[#94acea]"
        >
          Friends
        </Button>

        {currentUser?._id === userId ? (
          <>
            <Button
              onClick={() => handleShowFriend("requestFriends")}
              variant={"outline"}
              className="hover:text-blue-600 hover:shadow-[#94acea]"
            >
              Friend Requests
            </Button>
            <Button
              onClick={() => handleShowFriend("sentFriends")}
              variant={"outline"}
              className="hover:text-blue-600 hover:shadow-[#94acea]"
            >
              Sent Requests
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => handleShowFriend("following")}
              variant={"outline"}
              className="hover:text-blue-600 hover:shadow-[#94acea]"
            >
              Following
            </Button>
            <Button
              onClick={() => handleShowFriend("followers")}
              variant={"outline"}
              className="hover:text-blue-600 hover:shadow-[#94acea]"
            >
              Followers
            </Button>
          </>
        )}
      </CardHeader>

      <CardContent className="p-3">
        <p className="mb-2 text-gray-600 text-sm">
          {listName === "friends"
            ? `Your Friends (${showList.length})`
            : listName === "requestFriends"
            ? `Friend Requests (${showList.length})`
            : `Sent Requests (${showList.length})`}
        </p>

        {showList.length === 0 ? (
          <p className="text-gray-500">No {listName} available.</p>
        ) : (
          showList.map((friend) => (
            <div key={friend._id} className="flex gap-2 items-center mb-2">
              <img
                src={friend.photo || "/default-avatar.png"}
                alt={friend.username}
                className="rounded-full w-10 h-10 border hover:border-blue-500"
              />

              <div className="flex items-center justify-between w-full">
                <Link to={`/profile/${friend.username}`}>
                  <h3 className="text-sm font-medium hover:underline hover:text-blue-800">
                    {friend.username}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {listName === "friends"
                      ? "You are friends"
                      : listName === "requestFriends"
                      ? "Wants to be your friend"
                      : "Request sent"}
                  </p>
                </Link>

                {listName === "requestFriends" && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="bg-blue-500 text-white hover:shadow-[#94acea]"
                      onClick={() => handleConfirmRequest(userId)}
                    >
                      <UserCheck />
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-red-400 text-white hover:text-red-500 hover:shadow-red-200"
                      onClick={() => handleRejectRequest(userId)}
                    >
                      <X />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default FriendSection;
