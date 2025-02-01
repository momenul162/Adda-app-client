import axios from "axios";

const uploadToCloudinary = async (file: File, resourceType: "image" | "video"): Promise<any> => {
  const CLOUD_NAME = "dnwytnhdx";
  const UPLOAD_PRESET = "adda_app_preset";

  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
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
