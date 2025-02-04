import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import clsx from "clsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { login } from "@/features/auth/authSlice";
import { loginSchema } from "@/model/schema";
import { LoginFormValues } from "@/model/interface";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginFormValues) => {
    setLoading(true);

    if (formData.email && formData.password) {
      try {
        const { data } = await axios.post(
          "https://adda-app-server.onrender.com/auth/sign-in",
          formData
        );

        if (data.user.token) {
          localStorage.setItem("jwt-token", data.user.token);
          dispatch(login({ user: data.user.user, token: data.user.token }));
          setLoading(false);
          reset();
          navigate(from, { replace: true });
        }
      } catch (error: any) {
        setLoading(false);
        setError(error?.response?.data?.message);
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // Add logic to handle social login integration here
  };

  return (
    <div className="h-screen">
      <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-lg rounded">
        <h1 className="text-2xl text-center font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-4">
            <Label htmlFor="email" className="block font-medium mb-1">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={clsx(errors.email && "border-red-500")}
            />
            <p className="text-red-600 text-sm">{errors.email?.message}</p>
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
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button variant={"secondary"} className="w-full mt-4" type="submit">
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="animate-spin" />
                  <span>Login...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
        <p className="text-gray-600 text-center text-sm mb-2">
          Create a new Account? Please{" "}
          <Link className="font-semibold text-blue-600 underline" to={"/register"}>
            Create
          </Link>
        </p>

        {/* Social Login */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm mb-4">Or login with</p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              className="py-6 px-6 text-blue-600"
              onClick={() => handleSocialLogin("Google")}
            >
              <span>Google</span>
            </Button>
            <Button
              variant="outline"
              className="py-6 px-6 text-blue-600"
              onClick={() => handleSocialLogin("Facebook")}
            >
              <span>Facebook</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
