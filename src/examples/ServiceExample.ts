/** Compile-safe reference: feature services import the canonical client, never create a second client. */
import axiosInstance from '@/services/axiosInstance';
export const exampleService = { list: () => axiosInstance.get('/example') };
