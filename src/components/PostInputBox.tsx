import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileVideo2, Image, SquarePlay } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreatePostModal from "./CreatePostModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const PostInputBox = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="shadow-lg mx-auto bg-white p-4 mt-4">
      {/* Input Section */}
      <div className="flex items-center space-x-3 mb-4">
        {/* Profile Picture */}
        <img
          src={user?.photo}
          alt="Profile"
          className="rounded-full w-11 h-11 border hover:border-blue-500"
        />
        {/* Input */}
        <Dialog>
          <DialogTrigger asChild>
            <Input
              id="post"
              type="text"
              placeholder={`What's on your mind, ${user?.username}.`}
              className="rounded-full"
            />
          </DialogTrigger>
          <DialogContent id="post-input">
            <CreatePostModal />
          </DialogContent>
        </Dialog>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center border-t pt-3">
        {/* Live Video Button */}
        <Button
          variant="outline"
          className="flex items-center space-x-2 hover:bg-gray-100 shadow-sm border-none h-10"
        >
          <FileVideo2 strokeWidth={3} size={48} color="salmon" />
          Live video
        </Button>

        {/* Photo/Video Button */}

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center space-x-2 hover:bg-gray-100 shadow-sm border-none h-10"
            >
              <Image strokeWidth={3} size={48} color="salmon" />
              Photo/video
            </Button>
          </DialogTrigger>
          <DialogContent id="post-input">
            <CreatePostModal />
          </DialogContent>
        </Dialog>

        {/* Reel Button */}
        <Button
          variant="outline"
          className="flex items-center space-x-2 hover:bg-gray-100 shadow-sm border-none h-10"
        >
          <SquarePlay strokeWidth={3} size={48} color="salmon" />
          Reel
        </Button>
      </div>
    </div>
  );
};

export default PostInputBox;
