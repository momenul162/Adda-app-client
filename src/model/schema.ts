import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const registerSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  phone: yup
    .string()
    .matches(
      /^(\+\d{1,3}[- ]?)?\(?\d{1,4}\)?[- ]?\d{1,4}[- ]?\d{1,9}$/,
      "Enter a valid phone number"
    )
    .required("Phone number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("Password is required"),
  photo: yup
    .mixed<FileList>()
    .nullable()
    .test("fileSize", "File size must be less than 2MB", (value) => {
      return !value || (value.length > 0 && value[0].size <= 2 * 1024 * 1024);
    })
    .optional(),
  country: yup.string().required("Country is required"),
});

export const createPostSchema = yup.object().shape({
  visibility: yup.string().default("PUBLIC").required("Visibility is required"),
  body: yup.string().optional(),
  image: yup
    .mixed<FileList>()
    .nullable()
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return !value || (value.length > 0 && value[0].size <= 5 * 1024 * 1024);
    })
    .optional(),
  video: yup
    .mixed<FileList>()
    .nullable()
    .test("fileSize", "Video size must be less than 20MB", (value) => {
      return !value || (value.length > 0 && value[0].size <= 20 * 1024 * 1024);
    })
    .optional(),
});

export const commentSchema = yup.object({
  body: yup
    .string()
    .required("Comment is required")
    .max(500, "Comment cannot exceed 500 characters"),
});
