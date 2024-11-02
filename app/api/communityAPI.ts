import { AxiosResponse } from "axios";
import axios from "@/app/util";

export const createCommunity = (
  request: CreateCommunityRequest,
  reportPhotos: File[],
) => {
  const formData = new FormData();
  formData.append("request", JSON.stringify(request));
  reportPhotos.forEach((reportPhoto) => {
    formData.append("reportPhotos", reportPhoto);
  });

  return axios({
    method: "post",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    url: `/api/v1/communities`,
    data: formData,
  });
};

export const getCommunityList = (): Promise<AxiosResponse<CommunityPost[]>> => {
  return axios({
    method: "get",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json",
    },
    url: `/api/v1/communities`,
  });
};

export const likeCommunity = (
  communityId: number,
): Promise<AxiosResponse<{ likeCount: number; isLike: boolean }>> => {
  return axios({
    method: "post",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json",
    },
    url: `/api/v1/communities/${communityId}/like`,
  });
};

export const getCommunityDetail = (
  postId: number,
): Promise<AxiosResponse<CommunityData>> => {
  return axios({
    method: "get",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json",
    },
    url: `/api/v1/communities/${postId}`,
  });
};

export const createCommunityComment = (postId: number, content: string) => {
  return axios({
    method: "post",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json",
    },
    url: `/api/v1/communities/${postId}/comment`,
    data: { content },
  });
};
