import { FileVideo, ImageUp } from "lucide-react";
import { TooltipComp } from "./Tooltip";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const CreatePostModal = () => {
  const { handleSubmit, setValue, watch, register } = useForm();
  const user = useSelector((state: RootState) => state.auth.user);

  // State to store file previews
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Refs for file input
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      if (type === "image") {
        setSelectedImage(previewURL);
      } else {
        setSelectedVideo(previewURL);
      }
    }
  };

  // Handle form submission
  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    console.log("Selected Image:", selectedImage);
    console.log("Selected Video:", selectedVideo);

    // Here, you can send the data to an API endpoint
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      {/* Modal Container */}
      <div className="bg-white rounded-lg w-full max-w-lg shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Create post</h2>
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <AvatarImage src={user?.photo}></AvatarImage>
            </Avatar>
            <div>
              <p className="font-semibold">{user?.username}</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Select
                  value={watch("visibility") || ""}
                  onValueChange={(value) => setValue("visibility", value, { shouldValidate: true })}
                >
                  <SelectTrigger className="item-center pl-0 pr-20 py-0 border-none shadow-none text-blue-500">
                    <SelectValue placeholder="Public" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="FRIEND">Friend</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </form>
            </div>
          </div>

          {/* Input */}
          <Textarea
            id="post"
            placeholder={`What's on your mind, ${user?.username}?`}
            {...register("postText")}
          />

          {/* Add to Post Section */}
          <div className="flex items-center space-x-3 mt-10 mb-4">
            <Button variant="ghost" className="flex items-center space-x-2">
              <span className="text-gray-700">Add to your post</span>
            </Button>
            <div className="flex items-center">
              {/* Image Upload Button */}
              <TooltipComp
                variant={"outline"}
                style={"text-blue-500 border-none"}
                button={
                  <button onClick={() => imageInputRef.current?.click()} type="button">
                    <ImageUp size={48} strokeWidth={3} />
                  </button>
                }
                hover={"Image"}
              />

              {/* Hidden Input for Image */}
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                className="hidden"
                onChange={(e) => handleFileChange(e, "image")}
              />

              {/* Video Upload Button */}
              <TooltipComp
                variant={"outline"}
                style={"text-green-500 border-none"}
                button={
                  <button onClick={() => videoInputRef.current?.click()} type="button">
                    <FileVideo size={48} strokeWidth={3} />
                  </button>
                }
                hover={"Video"}
              />

              {/* Hidden Input for Video */}
              <input
                type="file"
                accept="video/*"
                ref={videoInputRef}
                className="hidden"
                onChange={(e) => handleFileChange(e, "video")}
              />
            </div>
          </div>

          {/* Preview Section */}
          {selectedImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Image Preview:</p>
              <img src={selectedImage} alt="Preview" className="w-full rounded-md mt-2" />
            </div>
          )}
          {selectedVideo && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Video Preview:</p>
              <video src={selectedVideo} controls className="w-full rounded-md mt-2" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button type="submit" variant={"secondary"} className="w-full rounded-lg">
              Post
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
