import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const waterApi = createApi({
  reducerPath: "waterApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://daltoncrew.duckdns.org/api/bucketmeter/",
  }),

  endpoints: (builder) => ({
    getQuantity: builder.query({
      query: () => "quantity",
    }),
    setEmpty: builder.mutation({
      query: () => "empty/",
      method: "POST",
    })
  }),
});

export const {
  useGetQuantityQuery,
  useSetEmptyMutation,
} = waterApi;