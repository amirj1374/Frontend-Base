import axiosInstance from "@/services/axiosInstance";
import userApi from "./modules/user";
import apiBase from "./modules/base";


export const api = {
  user: userApi(axiosInstance),
  base: apiBase(axiosInstance),
};
