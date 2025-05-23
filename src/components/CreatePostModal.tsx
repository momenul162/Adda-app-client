import { FileVideo, ImageUp, Loader2 } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import { DialogClose } from "./ui/dialog";
import { addPost } from "@/features/posts/postSlice";
import { ScrollArea } from "./ui/scroll-area";
import { createPostSchema } from "@/model/schema";
import { createPostValue } from "@/model/interface";
import uploadToCloudinary from "./upload-widget/uploadForPost";

const CreatePostModal = () => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, setValue, watch } = useForm<createPostValue>({
    resolver: yupResolver(createPostSchema),
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const onSubmit = async (data: createPostValue) => {
    if (!currentUser?._id) {
      console.error("User ID is missing");
      return;
    }

    if ((!data.body || !data.body.trim()) && !imageFile && !videoFile) {
      setLoading(false);
      alert("Post cannot be empty.");
      return;
    }

    let imageUrl: string | null = null;
    let videoUrl: string | null = null;

    setLoading(true);

    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile, "image");
    }

    if (videoFile) {
      videoUrl = await uploadToCloudinary(videoFile, "video");
    }

    const payload = {
      userId: currentUser._id,
      visibility: data.visibility,
      body: data.body,
      image: imageUrl || null,
      video: videoUrl || null,
    };

    dispatch(addPost(payload)).then(() => {
      setLoading(false);
      alert("Post uploaded successfully");
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <ScrollArea className="max-h-screen w-[500px] rounded-md">
        <div className="bg-white rounded-lg w-full max-w-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Create post</h2>
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

              <div className="flex items-center space-x-3 mt-10 mb-4">
                <Button variant="ghost">Add to your post</Button>
                <div className="flex items-center">
                  <TooltipComp
                    variant="outline"
                    style="text-blue-500 border-none"
                    button={
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          imageInputRef.current?.click();
                        }}
                      >
                        <ImageUp size={24} />
                      </div>
                    }
                    hover="Image"
                  />
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onClick={(e) => e.stopPropagation()}
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setImageFile(files[0]);
                        setSelectedImage(URL.createObjectURL(files[0]));
                      }
                    }}
                  />

                  <TooltipComp
                    variant="outline"
                    style="text-green-500 border-none"
                    button={
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          videoInputRef.current?.click();
                        }}
                      >
                        <FileVideo size={24} />
                      </div>
                    }
                    hover="Video"
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onClick={(e) => e.stopPropagation()}
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setVideoFile(files[0]);
                        setSelectedVideo(URL.createObjectURL(files[0]));
                      }
                    }}
                  />
                </div>
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
                <Button
                  type="submit"
                  disabled={loading || !(watch("body")?.trim() || selectedImage || selectedVideo)}
                  variant="secondary"
                  className="w-full rounded-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="animate-spin" />
                      <span>Posting...</span>
                    </div>
                  ) : (
                    "Post"
                  )}
                </Button>
              </DialogClose>
            </div>
          </form>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CreatePostModal;
