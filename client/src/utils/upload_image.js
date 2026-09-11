import { API_PATHS } from './api_path';
import axiosInstance from './axios_instance';

const uploadImage = async (imageFile) => {
  const formData = new FormData();

  // append image file to form data
  formData.append('image', imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // set header to upload file
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading the image:', error);
    throw error;
  }
};

export default uploadImage;
