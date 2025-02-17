import { useForm } from "react-hook-form";
import { AppDispatch } from "@/store";
import { updateUserProfile } from "@/features/auth/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";

// Define validation schema with yup
const validationSchema = yup.object().shape({
  currentCity: yup.string().max(100, "Current city name is too long").nullable().optional(),
  dateOfBirth: yup.date().nullable().optional(),
  occupation: yup.string().max(100, "Occupation is too long").nullable().optional(),
  email: yup.string().email("Invalid email format").nullable().optional(),
  phone: yup
    .string()
    .matches(/^(\+?\d{1,4}|\d{1,4})\s?\(?\d{1,4}\)?\s?\d{1,4}\s?\d{1,4}$/, "Invalid phone number")
    .nullable()
    .optional(),
});

interface AboutInterface {
  currentCity?: string | null;
  dateOfBirth?: Date | null;
  occupation?: string | null;
  email?: string | null;
  phone?: string | null;
}

const UpdateAbout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AboutInterface>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      currentCity: currentUser?.currentCity ?? null,
      dateOfBirth: currentUser?.dateOfBirth ? new Date(currentUser.dateOfBirth) : null,
      occupation: currentUser?.occupation ?? null,
      email: currentUser?.email ?? null,
      phone: currentUser?.phone ?? null,
    },
  });

  const onSubmit = async (data: AboutInterface) => {
    if (Object.keys(data).length > 0) {
      dispatch(
        updateUserProfile({
          currentCity: data.currentCity ?? undefined,
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toLocaleDateString()
            : undefined,
          occupation: data.occupation ?? undefined,
          email: data.email ?? undefined,
          phone: data.phone ?? undefined,
        })
      );
    }
  };

  return (
    <Card className="w-full mx-auto bg-slate-100 shadow-lg p-4">
      <CardHeader>
        <CardTitle>Update Your About Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* City */}
          <div>
            <label htmlFor="currentCity" className="block text-sm font-medium text-gray-700">
              Current City
            </label>
            <Input
              id="currentCity"
              placeholder="Enter your current city"
              className="mt-1 block w-full"
              {...register("currentCity")}
            />
            {errors.currentCity && (
              <p className="text-red-500 text-sm">{errors.currentCity.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <Input
              id="dateOfBirth"
              type="date"
              className="mt-1 block w-full"
              {...register("dateOfBirth")}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>
            )}
          </div>

          {/* Occupation */}
          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
              Occupation
            </label>
            <Input
              id="occupation"
              placeholder="Enter your occupation"
              className="mt-1 block w-full"
              {...register("occupation")}
            />
            {errors.occupation && (
              <p className="text-red-500 text-sm">{errors.occupation.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1 block w-full"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <Input
              id="phone"
              placeholder="Enter your phone number"
              className="mt-1 block w-full"
              {...register("phone")}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          <div className="mt-4">
            <DialogClose asChild>
              <Button type="submit" className="w-full bg-blue-500 text-white hover:text-gray-800">
                Save Changes
              </Button>
            </DialogClose>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateAbout;
