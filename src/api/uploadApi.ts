import axiosClient from "./axiosClient";

export const uploadApi = {
  postImage(data:any) {
    const url = `/sence-text-ocr`;
    return axiosClient.post(url, data);
  },
};
