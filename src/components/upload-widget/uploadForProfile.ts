import axios from "axios";

const cloud_name = "dnwytnhdx";
const upload_preset = "adda_app_preset";

const uploadToCloudinary = async (file: File): Promise<any> => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", upload_preset);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      formData
    );

    if (res.data.secure_url) {
      return res.data.secure_url;
    } else {
      throw new Error("Cloudinary upload failed");
    }
  } catch (error) {
    console.log("[Cloudinary Upload Error]: ", error);
    return null;
  }
};

export default uploadToCloudinary;
