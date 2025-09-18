import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    // Có thể thêm logic xử lý header chung ở đây, ví dụ: authentication token
    return headers;
  },
});

export const baseQueryWithErrorHandler = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    // Xử lý các lỗi chung ở đây
    console.error('API Error:', result.error);
    // Ví dụ: hiển thị thông báo lỗi, chuyển hướng người dùng
  }
  return result;
};
