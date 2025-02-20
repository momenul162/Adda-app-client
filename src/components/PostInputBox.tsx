import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileVideo2, Image, SquarePlay } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import CreatePostModal from "./CreatePostModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AvatarSkeleton } from "./skeleton/avatar-skeleton";

const PostInputBox = () => {
  const { currentUser, loading } = useSelector((state: RootState) => state.auth);

  return (
    <div className="shadow-xl mx-auto bg-white p-4 mt-4 w-[580px] md:w-[668px] lg:w-[500px] xl:w-[668px]">
      {/* Input Section */}
      <div className="flex items-center space-x-3 mb-4">
        {/* Profile Picture */}
        {loading ? (
          <AvatarSkeleton />
        ) : (
          <img
            src={currentUser?.photo}
            alt="Profile"
            className="rounded-full w-11 h-11 border hover:border-blue-500"
          />
        )}
        {/* Input */}

        <Dialog>
          <DialogTrigger asChild>
            <Input
              id="post"
              type="text"
              placeholder={`What's on your mind, ${currentUser?.username}.`}
              className="rounded-full"
            />
          </DialogTrigger>
          <DialogContent id="post-input">
            <DialogTitle></DialogTitle>
            <ScrollArea className="max-h-[600px]">
              <CreatePostModal />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
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

        {/* image/Video Button */}

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
            <DialogTitle></DialogTitle>
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
