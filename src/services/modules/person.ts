import type { AxiosInstance } from "axios";
import type { PersonDTO } from '@/types/models/person';

export default (axiosInstance: AxiosInstance) => ({
  fetch(page: number, limit: number) {
    return axiosInstance.get(`/api/v1/person-requests`, {
      params: { page, limit }
    });
  },

  create(data: PersonDTO) {
    return axiosInstance.post("/personTransaction-requests", data);
  },

  update(id: string, data: PersonDTO) {
    return axiosInstance.put(`/personTransaction-requests/${id}`, data);
  },

  delete(id: string) {
    return axiosInstance.delete(`/personTransaction-requests/${id}`);
  },
});
