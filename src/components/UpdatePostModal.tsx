import { FileVideo, ImageUp, Loader2 } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { DialogClose } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { createPostSchema } from "@/model/schema";
import { createPostValue, Post } from "@/model/interface";
import { useState } from "react";
import { updatePost } from "@/features/posts/postAPI";
import uploadToCloudinary from "./upload-widget/uploadForPost";
import { Separator } from "./ui/separator";

interface updateProps {
  post: Post;
}

const UpdatePostModal = ({ post }: updateProps) => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  // Use defaultValues for the form fields
  const { register, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(createPostSchema),
    defaultValues: {
      body: post.body || "",
      visibility: post.visibility || "PUBLIC",
    },
  });

  // Initialize state for file previews (image/video)
  const [selectedImage, setSelectedImage] = useState<string | null>(post.image || "");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(post.video || "");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const onSubmit = async (data: createPostValue) => {
    if (!currentUser?._id || !post._id) return console.error("User or Post ID is missing");

    console.log(data);

    setLoading(true);
    try {
      let imageUrl = imageFile ? await uploadToCloudinary(imageFile, "image") : post.image;
      let videoUrl = videoFile ? await uploadToCloudinary(videoFile, "video") : post.video;

      const updatedData = {
        visibility: data.visibility,
        body: data.body,
        image: imageUrl,
        video: videoUrl,
      };

      await dispatch(updatePost({ updatedData, postId: post._id }));
      setLoading(false);
      alert("Post updated successfully");
    } catch (error) {
      setLoading(false);
      console.error("Error updating post", error);
      alert("An error occurred while updating the post.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <ScrollArea className="max-h-screen w-[500px] rounded-md">
        <div className="bg-white rounded-lg w-full max-w-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Update post</h2>
              <DialogClose asChild>
                <button className="text-gray-500 text-xl font-extrabold hover:text-red-600">
                  &times;
                </button>
              </DialogClose>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar>
                  <AvatarImage src={currentUser?.photo} />
                </Avatar>
                <div>
                  <p className="font-semibold">{currentUser?.username}</p>
                  <Select
                    value={watch("visibility") || "PUBLIC"}
                    onValueChange={(value) =>
                      setValue("visibility", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="pl-0 pr-20 py-0 border-none shadow-none text-blue-500">
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
                </div>
              </div>

              <Textarea
                placeholder={`What's on your mind, ${currentUser?.username}?`}
                {...register("body")}
              />
              <Separator />

              <div className="absolute bottom-14 left-10">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="imageUpload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setSelectedImage(URL.createObjectURL(file));
                    }
                  }}
                />
                <label htmlFor="imageUpload">
                  <ImageUp size={25} color="#3c538f" />
                </label>
              </div>
              <div className="absolute bottom-14 left-20">
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  id="videoUpload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setVideoFile(file);
                      setSelectedVideo(URL.createObjectURL(file));
                    }
                  }}
                />
                <label htmlFor="videoUpload">
                  <FileVideo size={25} color="#3c538f" />
                </label>
              </div>

              {selectedImage && (
                <img
                  src={selectedImage}
                  className="max-w-full max-h-[300px] mt-2 rounded-md"
                  alt="Preview"
                />
              )}
              {selectedVideo && (
                <video
                  src={selectedVideo}
                  controls
                  className="max-w-full max-h-[300px] mt-2 rounded-md"
                />
              )}
            </div>
            <div className="p-4 border-t">
              <DialogClose asChild>
                <Button type="submit" variant="secondary" className="w-full rounded-lg">
                  {loading ? <Loader2 className="animate-spin" /> : "Update Post"}
                </Button>
              </DialogClose>
            </div>
          </form>
        </div>
      </ScrollArea>
    </div>
  );
};

export default UpdatePostModal;
