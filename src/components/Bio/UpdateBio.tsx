import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { User } from "@/model/interface";
import { updateUserProfile } from "@/features/auth/authAPI";
import { AppDispatch } from "@/store";
import { DialogClose } from "../ui/dialog";

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  bio: Yup.string().max(250, "Bio must be less than 250 characters").optional(),
});

interface formData {
  username?: string;
  bio?: string;
}

interface UpdateProps {
  currentUser: User | null;
}

const UpdateBio: React.FC<UpdateProps> = ({ currentUser }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Default values for username and bio from currentUser
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: currentUser?.username || "",
      bio: currentUser?.bio || "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: formData) => {
    console.log(data);
    dispatch(updateUserProfile({ username: data.username, bio: data.bio }));
  };

  return (
    <Card className="w-full mx-auto bg-slate-100 shadow-lg p-4">
      <CardHeader></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username Field */}
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...register("username")}
              placeholder="Enter new username"
              className={`bg-white ${errors.username ? "border-red-500" : ""}`}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
          </div>

          {/* Bio Field */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              {...register("bio")}
              placeholder="Write a short bio..."
              className={`w-full p-2 border rounded-md ${errors.bio ? "border-red-500" : ""}`}
              rows={3}
            ></textarea>
            {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
          </div>

          {/* Submit Button */}
          <DialogClose asChild>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </DialogClose>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateBio;
