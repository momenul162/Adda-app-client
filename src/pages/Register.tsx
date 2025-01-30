import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { uploadToImgBB } from "@/lib/uploadToImgBB";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface FormValues {
  username: string;
  email: string;
  phone: string;
  password: string;
  photo: FileList | null;
  country: string;
}

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  photo: yup
    .mixed()
    .test("required", "File is required", (value) => value && value.length > 0)
    .test(
      "fileSize",
      "File size must be less than 2MB",
      (value) => !value || (value && value[0]?.size <= 2 * 1024 * 1024)
    )
    .test(
      "fileType",
      "Unsupported file format",
      (value) =>
        !value || (value && ["image/jpeg", "image/png", "application/pdf"].includes(value[0]?.type))
    ),
  country: yup.string().required("Country is required"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const country: string = watch("country");

  const onSubmit = async (formData: FormValues) => {
    const photoFile = formData?.photo[0];
    setLoading(true);
    const uploadedImageUrl = await uploadToImgBB(photoFile);

    if (uploadedImageUrl) {
      const user: object = {
        ...formData,
        photo: uploadedImageUrl,
      };

      console.log(user);

      const { data } = await axios.post("http://localhost:8080/auth/sign-up", user);

      if (data) {
        setLoading(false);
        reset();
        navigate("/login");
      }
    } else {
      console.error("Image upload failed");
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // Add logic to handle social login integration here
  };

  return (
    <div className="h-screen">
      <div className="max-w-lg mx-auto mt-10 p-5 bg-white shadow-lg rounded">
        <h1 className="text-2xl font-bold mb-4">Create an new Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="mb-4">
            <Label htmlFor="username" className="block font-medium mb-1">
              Name*
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your name"
              {...register("username")}
              className={clsx(errors.username && "border-red-500")}
            />
            <p className="text-red-600 text-sm">{errors.username?.message}</p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <Label htmlFor="email" className="block font-medium mb-1">
              Email*
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              {...register("email")}
              className={clsx(errors.email && "border-red-500")}
            />
            <p className="text-red-600 text-sm">{errors.email?.message}</p>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <Label htmlFor="phone" className="block font-medium mb-1">
              Phone
            </Label>
            <Input
              id="phone"
              type="text"
              placeholder="+1234654512"
              {...register("phone")}
              className={clsx(errors.phone && "border-red-500")}
            />
            <p className="text-red-600 text-sm">{errors.phone?.message}</p>
          </div>

          {/* Country */}
          <div className="mb-4">
            <Label htmlFor="country" className="block font-medium mb-1">
              Country
            </Label>
            <Select
              value={country || ""}
              onValueChange={(value) => setValue("country", value, { shouldValidate: true })}
            >
              <SelectTrigger className={clsx(errors.country && "border-red-500")}>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel aria-disabled>Select your country</SelectLabel>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-red-600 text-sm">{errors.country?.message}</p>
          </div>

          {/* Photo */}
          <div className="mb-4">
            <Label htmlFor="photo" className="block font-medium mb-1">
              Photo
            </Label>
            <Input
              id="photo"
              type="file"
              accept=".jpg,.jpeg,.png"
              className={clsx(errors.photo && "border-red-500")}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  // Manually set the value in the react-hook-form
                  setValue("photo", files, { shouldValidate: true });
                }
              }}
            />
            <p className="text-red-600 text-sm">{errors.photo?.message}</p>
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <Label htmlFor="password" className="block font-medium mb-1">
              Password
            </Label>
            <div className="flex items-center">
              <Input
                id="password"
                placeholder="Enter your password"
                className={clsx(errors.password && "border-red-500")}
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />
              <Button
                type="button"
                variant={"default"}
                className="py-3 absolute right-2 top-5.5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
            <p className="text-red-600 text-sm">{errors.password?.message}</p>
          </div>

          {/* Submit Button */}
          <div>
            <Button disabled={loading} variant={"secondary"} className="w-full mt-4" type="submit">
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>

        <p className="text-gray-600 text-center text-sm mt-1">
          Already have an Account? Please{" "}
          <Link className="font-semibold text-blue-600 underline" to={"/login"}>
            Login
          </Link>
        </p>

        {/* Social Login */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm mb-4">Or login with</p>
          <div className="flex justify-center space-x-4">
            <Button variant="default" onClick={() => handleSocialLogin("Google")}>
              <span>
                {" "}
                {/* Replace with a Google icon */}
                Google
              </span>
            </Button>
            <Button variant="default" onClick={() => handleSocialLogin("Facebook")}>
              <span>
                {" "}
                {/* Replace with a Facebook icon */}
                Facebook
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
