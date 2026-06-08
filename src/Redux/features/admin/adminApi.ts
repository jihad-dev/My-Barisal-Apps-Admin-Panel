import { baseApi } from "../../api/baseApi";


const adminApi = baseApi.injectEndpoints({
   endpoints: (builder: any) => ({
      getAllUsers: builder.query({
         query: () => '/users/all-user',
         method: 'GET',
         providesTags: ['users']
      }),
      getAllHospitals: builder.query({
         query: () => ({
            url: '/hospitals',
            method: 'GET',
         }),
         providesTags: ['hospitals'],
      }),
      addHospital: builder.mutation({
         query: (newHospital: any) => ({
            url: '/hospitals/create-hospital',
            method: 'POST',
            body: newHospital,
         }),

         invalidatesTags: ['hospitals'],
      }),
      // ট্যাগ টাইপস-এ 'lawyers' যুক্ত করতে ভুলবেন না
      getAllLawyers: builder.query({
         query: () => ({
            url: '/lawyers',
            method: 'GET',
         }),
         providesTags: [{ type: 'lawyers', id: 'LIST' }],
      }),

      // ২. নতুন আইনজীবী তৈরি করার মিউটেশন
      createLawyer: builder.mutation({
         query: (newLawyer) => ({
            url: '/lawyers/add-lawyer',
            method: 'POST',
            body: newLawyer,
         }),
         // এটি ট্রিগার হওয়ার সাথে সাথে উপরের getAllLawyers কুয়েরিটি অটোমেটিক রি-রান হবে
         invalidatesTags: [{ type: 'lawyers', id: 'LIST' }],
      }),
      getAllAmbulance: builder.query({
         query: () => ({
            url: '/ambulances',
            method: 'GET',
         }),
         providesTags: [''],
      }),
      getAllAdmins: builder.query({
         query: () => ({
            url: '/users/all-admin',
            method: 'GET',
         }),
         providesTags: ['admins'],
         transformResponse: (response: any) => response?.data,
      }),
      changeStatus: builder.mutation({
         query: (data: { id: string, status: string }) => ({
            url: `/users/status/${data?.id}`,
            method: 'PATCH',
            body: {
               status: data?.status
            }
         }),
         invalidatesTags: ['users']
      }),
      //create admin
      createAdmin: builder.mutation({
         query: (data: any) => ({
            url: '/users/create-user',
            method: 'POST',
            body: data
         }),
         invalidatesTags: ['admins']
      }),
      //get single admin
      getSingleAdmin: builder.query({
         query: (id: string) => ({
            url: `/users/admin/${id}`,
            method: 'GET',
         }),
         providesTags: ['admins']
      }),
      //delete admin
      deleteAdmin: builder.mutation({
         query: (id: string) => ({
            url: `/users/admin/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['admins']
      }),
      //delete user
      deleteUser: builder.mutation({
         query: (id: string) => ({
            url: `/users/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['users']
      })

   })
})

export const { useGetAllUsersQuery, useChangeStatusMutation, useCreateAdminMutation, useGetSingleAdminQuery, useDeleteAdminMutation, useDeleteUserMutation, useGetAllAdminsQuery, useGetAllHospitalsQuery, useGetAllAmbulanceQuery, useAddHospitalMutation, useGetAllLawyersQuery, useCreateLawyerMutation } = adminApi;
