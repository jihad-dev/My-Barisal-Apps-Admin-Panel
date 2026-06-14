
import { baseApi } from "../../api/baseApi";
import { EndpointBuilder } from "@reduxjs/toolkit/query";
interface ApiResponse<T = any> {
   success: boolean;
   message?: string;
   data?: T;
}
const adminApi = baseApi.injectEndpoints({
   // এখানে builder-এর সঠিক টাইপ অ্যাসাইন করা হয়েছে (any-র পরিবর্তে)
   endpoints: (builder: EndpointBuilder<any, any, any>) => ({
      getAllUsers: builder.query<any, void>({
         query: () => ({
            url: '/users/all-user',
            method: 'GET',
         }),
         providesTags: ['users']
      }),
      getAllHospitals: builder.query<any, void>({
         query: () => ({
            url: '/hospitals',
            method: 'GET',
         }),
         providesTags: ['hospitals'],
      }),
      getAllDoctors: builder.query<any, void>({
         query: () => ({
            url: '/doctors',
            method: 'GET',
         }),
         providesTags: ['doctors'],
      }),
      // এখন আর এখানে কোনো TS এরর আসবে না 🎉
      addDoctor: builder.mutation<ApiResponse, any>({
         query: (newDoctor: any) => ({
            url: '/doctors/add-doctor',
            method: 'POST',
            body: newDoctor,
         }),
         invalidatesTags: ['doctors'],
      }),
      addHospital: builder.mutation<ApiResponse, any>({
         query: (newHospital: any) => ({
            url: '/hospitals/create-hospital',
            method: 'POST',
            body: newHospital,
         }),
         invalidatesTags: ['hospitals'],
      }),
      getAllLawyers: builder.query<any, void>({
         query: () => ({
            url: '/lawyers',
            method: 'GET',
         }),
         providesTags: [{ type: 'lawyers', id: 'LIST' }],
      }),
      createLawyer: builder.mutation<ApiResponse, any>({
         query: (newLawyer: any) => ({
            url: '/lawyers/add-lawyer',
            method: 'POST',
            body: newLawyer,
         }),
         invalidatesTags: [{ type: 'lawyers', id: 'LIST' }],
      }),
      getAllAmbulance: builder.query<any, void>({
         query: () => ({
            url: '/ambulances',
            method: 'GET',
         }),
         providesTags: ['ambulances'],
      }),
      addAmbulance: builder.mutation<any, any>({
         query: (newAmbulance) => ({
            url: '/ambulances/add-ambulance',
            method: 'POST',
            body: newAmbulance,
         }),
         invalidatesTags: ['ambulances'],
      }),
      getAllDonors: builder.query<any, void>({
         query: () => '/donars', // আপনার ব্যাকএন্ডের সঠিক রাউট
         providesTags: ['donars']
      }),
      registerDonar: builder.mutation<any, any>({
         query: (data) => ({
            url: '/donars/register', // আপনার ব্যাকএন্ডের সঠিক রাউট দিন
            method: 'POST',
            body: data,
         }),
         invalidatesTags: ['donars']
      }),
      getAllPolice: builder.query<any, void>({
         query: () => '/police', // আপনার ব্যাকএন্ডের সঠিক রাউট
         providesTags: ['police']
      }),
      addPoliceStation: builder.mutation<any, any>({
         query: (data) => ({
            url: '/police/add-station', // আপনার ব্যাকএন্ডের সঠিক রাউট দিন
            method: 'POST',
            body: data,
         }),
         invalidatesTags: ['police']
      }),
      getAllAdmins: builder.query<any, void>({
         query: () => ({
            url: '/users/all-admin',
            method: 'GET',
         }),
         providesTags: ['admins'],
         transformResponse: (response: any) => response?.data,
      }),
      changeStatus: builder.mutation<ApiResponse, { id: string; status: string }>({
         query: (data: { id: string, status: string }) => ({
            url: `/users/status/${data?.id}`,
            method: 'PATCH',
            body: {
               status: data?.status
            }
         }),
         invalidatesTags: ['users']
      }),
      createAdmin: builder.mutation<ApiResponse, any>({
         query: (data: any) => ({
            url: '/users/create-user',
            method: 'POST',
            body: data
         }),
         invalidatesTags: ['admins']
      }),
      getSingleAdmin: builder.query<any, string>({
         query: (id: string) => ({
            url: `/users/admin/${id}`,
            method: 'GET',
         }),
         providesTags: ['admins']
      }),
      deleteAdmin: builder.mutation<ApiResponse, string>({
         query: (id: string) => ({
            url: `/users/admin/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['admins']
      }),
      deleteUser: builder.mutation<ApiResponse, string>({
         query: (id: string) => ({
            url: `/users/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['users']
      })
   })
});

export const {
   useGetAllUsersQuery,
   useChangeStatusMutation,
   useCreateAdminMutation,
   useGetSingleAdminQuery,
   useDeleteAdminMutation,
   useDeleteUserMutation,
   useGetAllAdminsQuery,
   useGetAllHospitalsQuery,
   useGetAllAmbulanceQuery,
   useAddHospitalMutation,
   useGetAllLawyersQuery,
   useCreateLawyerMutation,
   useGetAllDoctorsQuery,
   useAddDoctorMutation,
   useAddAmbulanceMutation,
   useGetAllDonorsQuery,
   useGetAllPoliceQuery,
   useAddPoliceStationMutation,
   useRegisterDonarMutation
} = adminApi;