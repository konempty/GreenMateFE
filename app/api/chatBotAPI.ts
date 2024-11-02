import { AxiosResponse } from "axios";
import axios from "@/app/util";

export const getChat = (
  request: ChatRequest[],
): Promise<AxiosResponse<ChatBotChat>> => {
  return axios({
    method: "post",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      Accept: "application/json",
    },
    url: `/api/v1/chatbots`,
    data: request,
  });
};
