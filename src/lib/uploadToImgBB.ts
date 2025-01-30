import axios from 'axios';

const IMG_API_KEY = '1ee3e46ff66e9c3383ab95d31fc48c2d';
const url = `https://api.imgbb.com/1/upload?key=${IMG_API_KEY}`;

export const uploadToImgBB = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axios.post(url, formData);
    return response.data.data.url; // Return the hosted image URL
  } catch (error) {
    console.error("Failed to upload file to ImgBB:", error);
    return null;
  }
};