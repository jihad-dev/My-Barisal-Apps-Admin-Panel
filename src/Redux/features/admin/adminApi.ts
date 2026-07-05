
// import { baseApi } from "../../api/baseApi";
// import { EndpointBuilder } from "@reduxjs/toolkit/query";
// interface ApiResponse<T = any> {
//    success: boolean;
//    message?: string;
//    data?: T;
// }
// const adminApi = baseApi.injectEndpoints({
//    // এখানে builder-এর সঠিক টাইপ অ্যাসাইন করা হয়েছে (any-র পরিবর্তে)
//    endpoints: (builder: EndpointBuilder<any, any, any>) => ({
//       getAllUsers: builder.query<any, void>({
//          query: () => ({
//             url: '/users/all-user',
//             method: 'GET',
//          }),
//          providesTags: ['users']
//       }),
//       getAllHospitals: builder.query<any, void>({
//          query: () => ({
//             url: '/hospitals',
//             method: 'GET',
//          }),
//          providesTags: ['hospitals'],
//       }),
//       getAllDoctors: builder.query<any, void>({
//          query: () => ({
//             url: '/doctors',
//             method: 'GET',
//          }),
//          providesTags: ['doctors'],
//       }),
//       // এখন আর এখানে কোনো TS এরর আসবে না 🎉
//       addDoctor: builder.mutation<ApiResponse, any>({
//          query: (newDoctor: any) => ({
//             url: '/doctors/add-doctor',
//             method: 'POST',
//             body: newDoctor,
//          }),
//          invalidatesTags: ['doctors'],
//       }),
//       addHospital: builder.mutation<ApiResponse, any>({
//          query: (newHospital: any) => ({
//             url: '/hospitals/create-hospital',
//             method: 'POST',
//             body: newHospital,
//          }),
//          invalidatesTags: ['hospitals'],
//       }),
//       getAllLawyers: builder.query<any, void>({
//          query: () => ({
//             url: '/lawyers',
//             method: 'GET',
//          }),
//          providesTags: ['lawyers'],
//       }),
//       createLawyer: builder.mutation<ApiResponse, any>({
//          query: (newLawyer: any) => ({
//             url: '/lawyers/add-lawyer',
//             method: 'POST',
//             body: newLawyer,
//          }),
//          invalidatesTags: [{ type: 'lawyers', id: 'LIST' }],
//       }),
//       getAllAmbulance: builder.query<any, void>({
//          query: () => ({
//             url: '/ambulances',
//             method: 'GET',
//          }),
//          providesTags: ['ambulances'],
//       }),
//       addAmbulance: builder.mutation<any, any>({
//          query: (newAmbulance) => ({
//             url: '/ambulances/add-ambulance',
//             method: 'POST',
//             body: newAmbulance,
//          }),
//          invalidatesTags: ['ambulances'],
//       }),
//       getAllDonors: builder.query<any, void>({
//          query: () => '/donars', // আপনার ব্যাকএন্ডের সঠিক রাউট
//          providesTags: ['donars']
//       }),
//       getAllPharmacies: builder.query<any, void>({
//          query: () => '/pharmacies', // আপনার ব্যাকএন্ডের সঠিক রাউট
//          providesTags: ['pharmacies']
//       }),
//       getAllBanks: builder.query<any, void>({
//          query: () => '/bank', // আপনার ব্যাকএন্ডের সঠিক রাউট
//          providesTags: ['banks']
//       }),
//       registerDonar: builder.mutation<any, any>({
//          query: (data) => ({
//             url: '/donars/register', // আপনার ব্যাকএন্ডের সঠিক রাউট দিন
//             method: 'POST',
//             body: data,
//          }),
//          invalidatesTags: ['donars']
//       }),
//       addBank: builder.mutation<any, any>({
//          query: (data) => ({
//             url: '/bank/register', // আপনার ব্যাকএন্ডের সঠিক রাউট দিন
//             method: 'POST',
//             body: data,
//          }),
//          invalidatesTags: ['bank']
//       }),
//       addPharmacy: builder.mutation<any, any>({
//          query: (data) => ({
//             url: '/pharmacies/create-pharmacy', // আপনার ব্যাকএন্ডের সঠিক রাউট দিন
//             method: 'POST',
//             body: data,
//          }),
//          invalidatesTags: ['pharmacies']
//       }),
//       getAllPolice: builder.query<any, void>({
//          query: () => '/police', // আপনার ব্যাকএন্ডের সঠিক রাউট
//          providesTags: ['police']
//       }),
//       deletePolice: builder.mutation<{ success: boolean; message: string; data: any }, string>({
//          query: (id) => ({
//             url: `/police/${id}`,
//             method: 'DELETE',
//          }),
//          invalidatesTags: ['police'], // ডিলিট হওয়ার সাথে সাথে টেবিল অটো-রিফ্রেশ করবে
//       }),
//       getAllFireStation: builder.query<any, void>({
//          query: () => '/fire-service', // আপনার ব্যাকএন্ডের সঠিক রাউট
//          providesTags: ['fire-service']
//       }),
//       // ২. ডিলিট ফায়ার স্টেশন মিউটেশন
//       deleteFireStation: builder.mutation<any, string>({
//          query: (id) => ({
//             url: `/fire-service/${id}`,
//             method: 'DELETE',
//          }),
//          // ডিলিট সফল হলে এই ট্যাগটি ইনভ্যালিড হবে এবং অটোমেটিক নতুন ডেটা ফেচ হবে
//          invalidatesTags: ['fire-service']
//       }),
//       getAllInstitutions: builder.query<any, void>({
//          query: () => '/institutions', // আপনার ব্যাকএন্ডের সঠিক রাউট
//          providesTags: ['institute']
//       }),
//       getAllImamMuzzain: builder.query<any, void>({
//          query: () => '/imam-muazzin', // আপনার ব্যাকএন্ডের সঠিক রাউট
//          providesTags: ['imam-muazzin']
//       }),
//       // ২. নতুন ফায়ার সার্ভিস স্টেশন যুক্ত করার জন্য মিউটেশন (ভবিষ্যতের কাজের সুবিধার্থে)
//       addFireStation: builder.mutation<any, any>({
//          query: (data) => ({
//             url: "/fire-service/create", // আপনার ব্যাকএন্ডের ক্রিয়েট রাউট
//             method: "POST",
//             body: data,
//          }),
//          invalidatesTags: ["fire-service"], // নতুন স্টেশন অ্যাড হলেই যেন অল-স্টেশন পেজ অটো রিফ্রেশ হয়
//       }),
//       addImamMuzzain: builder.mutation<any, any>({
//          query: (data) => ({
//             url: "/imam-muazzin/create", // আপনার ব্যাকএন্ডের ক্রিয়েট রাউট
//             method: "POST",
//             body: data,
//          }),
//          invalidatesTags: ["imam-muazzin"], // নতুন স্টেশন অ্যাড হলেই যেন অল-স্টেশন পেজ অটো রিফ্রেশ হয়
//       }),
//       deleteImamMuzzain: builder.mutation<any, string>({
//          query: (id) => ({
//             url: `/imam-muazzin/${id}`, // ডিলিট করার জন্য ডাইনামিক আইডি রাউট
//             method: "DELETE",
//          }),
//          invalidatesTags: ["imam-muazzin"], // ডিলিট হওয়ার সাথে সাথে লিস্ট পেজ অটো রিফ্রেশ হবে
//       }),
//       addPoliceStation: builder.mutation<any, any>({
//          query: (data) => ({
//             url: '/police/add-station', // আপনার ব্যাকএন্ডের সঠিক রাউট দিন
//             method: 'POST',
//             body: data,
//          }),
//          invalidatesTags: ['police']
//       }),
//       getAllAdmins: builder.query<any, void>({
//          query: () => ({
//             url: '/users/all-admin',
//             method: 'GET',
//          }),
//          providesTags: ['admins'],
//          transformResponse: (response: any) => response?.data,
//       }),
//       // 🚀 ২. নতুন গাড়ি যোগ করার মিউটেশন (Add Car)
//       addCar: builder.mutation<any, any>({
//          query: (carData) => ({
//             url: '/rent-cars/add-car',
//             method: 'POST',
//             body: carData,
//          }),

//          invalidatesTags: ['cars'],
//       }),
//       addInstitute: builder.mutation<any, any>({
//          query: (instituteData) => ({
//             url: '/institutions/create',
//             method: 'POST',
//             body: instituteData,
//          }),

//          invalidatesTags: ['institute'],
//       }),
//       getAllCars: builder.query<any, void>({
//          query: () => ({
//             url: '/rent-cars',
//             method: 'GET',
//          }),
//          providesTags: ['cars'],
//          transformResponse: (response: any) => response?.data,
//       }),
//       // আপনার adminApi স্লাইসের ভেতরে builder.mutation হিসেবে এটি যোগ করুন
//       deleteCar: builder.mutation<any, string>({
//          query: (id) => ({
//             url: `/rent-cars/${id}`,
//             method: 'DELETE',
//          }),
//          // 💡 এই ট্যাগটি ইনভ্যালিডেট করার কারণে ডিলিট হওয়ার সাথে সাথে আপনার টেবিলটি লাইভ রিফ্রেশ হবে!
//          invalidatesTags: ['cars'],
//       }),
//       changeStatus: builder.mutation<ApiResponse, { id: string; status: string }>({
//          query: (data: { id: string, status: string }) => ({
//             url: `/users/status/${data?.id}`,
//             method: 'PATCH',
//             body: {
//                status: data?.status
//             }
//          }),
//          invalidatesTags: ['users']
//       }),
//       createAdmin: builder.mutation<ApiResponse, any>({
//          query: (data: any) => ({
//             url: '/users/create-user',
//             method: 'POST',
//             body: data
//          }),
//          invalidatesTags: ['admins']
//       }),
//       getSingleAdmin: builder.query<any, string>({
//          query: (id: string) => ({
//             url: `/users/admin/${id}`,
//             method: 'GET',
//          }),
//          providesTags: ['admins']
//       }),
//       deleteAdmin: builder.mutation<ApiResponse, string>({
//          query: (id: string) => ({
//             url: `/users/admin/${id}`,
//             method: 'DELETE',
//          }),
//          invalidatesTags: ['admins']
//       }),
//       deleteUser: builder.mutation<ApiResponse, string>({
//          query: (id: string) => ({
//             url: `/users/${id}`,
//             method: 'DELETE',
//          }),
//          invalidatesTags: ['users']
//       })
//    })
// });

// export const {
//    useGetAllUsersQuery,
//    useChangeStatusMutation,
//    useCreateAdminMutation,
//    useGetSingleAdminQuery,
//    useDeleteAdminMutation,
//    useDeleteUserMutation,
//    useGetAllAdminsQuery,
//    useGetAllHospitalsQuery,
//    useGetAllAmbulanceQuery,
//    useAddHospitalMutation,
//    useGetAllLawyersQuery,
//    useCreateLawyerMutation,
//    useGetAllDoctorsQuery,
//    useAddDoctorMutation,
//    useAddAmbulanceMutation,
//    useGetAllDonorsQuery,
//    useGetAllPoliceQuery,
//    useAddPoliceStationMutation,
//    useRegisterDonarMutation,
//    useGetAllCarsQuery,
//    useDeleteCarMutation,
//    useAddCarMutation,
//    useGetAllFireStationQuery,
//    useAddFireStationMutation,
//    useGetAllBanksQuery,
//    useAddBankMutation,
//    useGetAllPharmaciesQuery,
//    useAddPharmacyMutation,
//    useGetAllImamMuzzainQuery,
//    useAddImamMuzzainMutation,
//    useGetAllInstitutionsQuery,
//    useAddInstituteMutation,
//    useDeleteImamMuzzainMutation,
//    useDeleteFireStationMutation,
//    useDeletePoliceMutation
// } = adminApi;



import { baseApi } from "../../api/baseApi";

interface ApiResponse<T = any> {
   success: boolean;
   message?: string;
   data?: T;
}

const adminApi = baseApi.injectEndpoints({
   overrideExisting: false,
   endpoints: (builder) => ({
      // ==========================================
      // ১. User & Admin Endpoints
      // ==========================================
      getAllUsers: builder.query<any, void>({
         query: () => ({
            url: '/users/all-user',
            method: 'GET',
         }),
         providesTags: ['users']
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

      deleteUser: builder.mutation<ApiResponse, string>({
         query: (id: string) => ({
            url: `/users/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['users']
      }),

      getAllAdmins: builder.query<any, void>({
         query: () => ({
            url: '/users/all-admin',
            method: 'GET',
         }),
         providesTags: ['admins'],
         transformResponse: (response: any) => response?.data,
      }),

      getSingleAdmin: builder.query<any, string>({
         query: (id: string) => ({
            url: `/users/admin/${id}`,
            method: 'GET',
         }),
         providesTags: ['admins']
      }),

      createAdmin: builder.mutation<ApiResponse, any>({
         query: (data: any) => ({
            url: '/users/create-user',
            method: 'POST',
            body: data
         }),
         invalidatesTags: ['admins']
      }),

      deleteAdmin: builder.mutation<ApiResponse, string>({
         query: (id: string) => ({
            url: `/users/admin/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['admins']
      }),

      // ==========================================
      // ২. Hospital Endpoints
      // ==========================================
      getAllHospitals: builder.query<any, void>({
         query: () => ({
            url: '/hospitals',
            method: 'GET',
         }),
         providesTags: ['hospitals'],
      }),

      addHospital: builder.mutation<ApiResponse, any>({
         query: (newHospital: any) => ({
            url: '/hospitals/create-hospital',
            method: 'POST',
            body: newHospital,
         }),
         invalidatesTags: ['hospitals'],
      }),

      // ==========================================
      // ৩. Doctor Endpoints
      // ==========================================
      getAllDoctors: builder.query<any, void>({
         query: () => ({
            url: '/doctors',
            method: 'GET',
         }),
         providesTags: ['doctors'],
      }),

      addDoctor: builder.mutation<ApiResponse, any>({
         query: (newDoctor: any) => ({
            url: '/doctors/add-doctor',
            method: 'POST',
            body: newDoctor,
         }),
         invalidatesTags: ['doctors'],
      }),

      // ==========================================
      // ৪. Lawyer Endpoints
      // ==========================================
      getAllLawyers: builder.query<any, void>({
         query: () => ({
            url: '/lawyers',
            method: 'GET',
         }),
         providesTags: ['lawyers'],
      }),

      createLawyer: builder.mutation<ApiResponse, any>({
         query: (newLawyer: any) => ({
            url: '/lawyers/add-lawyer',
            method: 'POST',
            body: newLawyer,
         }),
         invalidatesTags: [{ type: 'lawyers', id: 'LIST' }] as any,
      }),

      // ==========================================
      // ৫. Ambulance Endpoints
      // ==========================================
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

      // ==========================================
      // ৬. Donar Endpoints (Spelled as provided)
      // ==========================================
      getAllDonors: builder.query<any, void>({
         query: () => '/donars',
         providesTags: ['donars']
      }),

      registerDonar: builder.mutation<any, any>({
         query: (data) => ({
            url: '/donars/register',
            method: 'POST',
            body: data,
         }),
         invalidatesTags: ['donars']
      }),

      // ==========================================
      // ৭. Pharmacy Endpoints
      // ==========================================
      getAllPharmacies: builder.query<any, void>({
         query: () => '/pharmacies',
         providesTags: ['pharmacies']
      }),

      addPharmacy: builder.mutation<any, any>({
         query: (data) => ({
            url: '/pharmacies/create-pharmacy',
            method: 'POST',
            body: data,
         }),
         invalidatesTags: ['pharmacies']
      }),

      // ==========================================
      // ৮. Bank Endpoints
      // ==========================================
      getAllBanks: builder.query<any, void>({
         query: () => '/bank',
         providesTags: ['banks']
      }),

      addBank: builder.mutation<any, any>({
         query: (data) => ({
            url: '/bank/register',
            method: 'POST',
            body: data,
         }),
         invalidatesTags: ['banks']
      }),

      // ==========================================
      // ৯. Police Endpoints
      // ==========================================
      getAllPolice: builder.query<any, void>({
         query: () => '/police',
         providesTags: ['police']
      }),

      addPoliceStation: builder.mutation<any, any>({
         query: (data) => ({
            url: '/police/add-station',
            method: 'POST',
            body: data,
         }),
         invalidatesTags: ['police']
      }),

      deletePolice: builder.mutation<{ success: boolean; message: string; data: any }, string>({
         query: (id) => ({
            url: `/police/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['police'],
      }),

      // ==========================================
      // ১০. Fire Service Endpoints
      // ==========================================
      getAllFireStation: builder.query<any, void>({
         query: () => '/fire-service',
         providesTags: ['fire-service']
      }),

      addFireStation: builder.mutation<any, any>({
         query: (data) => ({
            url: "/fire-service/create",
            method: "POST",
            body: data,
         }),
         invalidatesTags: ["fire-service"],
      }),

      deleteFireStation: builder.mutation<any, string>({
         query: (id) => ({
            url: `/fire-service/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['fire-service']
      }),

      // ==========================================
      // ১১. Institution Endpoints
      // ==========================================
      getAllInstitutions: builder.query<any, void>({
         query: () => '/institutions',
         providesTags: ['institute']
      }),

      addInstitute: builder.mutation<any, any>({
         query: (instituteData) => ({
            url: '/institutions/create',
            method: 'POST',
            body: instituteData,
         }),
         invalidatesTags: ['institute'],
      }),

      // ==========================================
      // ১২. Imam & Muazzin Endpoints
      // ==========================================
      getAllImamMuzzain: builder.query<any, void>({
         query: () => '/imam-muazzin',
         providesTags: ['imam-muazzin']
      }),

      addImamMuzzain: builder.mutation<any, any>({
         query: (data) => ({
            url: "/imam-muazzin/create",
            method: "POST",
            body: data,
         }),
         invalidatesTags: ["imam-muazzin"],
      }),

      deleteImamMuzzain: builder.mutation<any, string>({
         query: (id) => ({
            url: `/imam-muazzin/${id}`,
            method: "DELETE",
         }),
         invalidatesTags: ["imam-muazzin"],
      }),

      // ==========================================
      // ১৩. Rent a Car Endpoints
      // ==========================================
      getAllCars: builder.query<any, void>({
         query: () => ({
            url: '/rent-cars',
            method: 'GET',
         }),
         providesTags: ['cars'],
         transformResponse: (response: any) => response?.data,
      }),

      addCar: builder.mutation<any, any>({
         query: (carData) => ({
            url: '/rent-cars/add-car',
            method: 'POST',
            body: carData,
         }),
         invalidatesTags: ['cars'],
      }),

      deleteCar: builder.mutation<any, string>({
         query: (id) => ({
            url: `/rent-cars/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['cars'],
      }),
   })
});

export const {
   useGetAllUsersQuery,
   useChangeStatusMutation,
   useDeleteUserMutation,
   useGetAllAdminsQuery,
   useGetSingleAdminQuery,
   useCreateAdminMutation,
   useDeleteAdminMutation,
   useGetAllHospitalsQuery,
   useAddHospitalMutation,
   useGetAllDoctorsQuery,
   useAddDoctorMutation,
   useGetAllLawyersQuery,
   useCreateLawyerMutation,
   useGetAllAmbulanceQuery,
   useAddAmbulanceMutation,
   useGetAllDonorsQuery,
   useRegisterDonarMutation,
   useGetAllPharmaciesQuery,
   useAddPharmacyMutation,
   useGetAllBanksQuery,
   useAddBankMutation,
   useGetAllPoliceQuery,
   useAddPoliceStationMutation,
   useDeletePoliceMutation,
   useGetAllFireStationQuery,
   useAddFireStationMutation,
   useDeleteFireStationMutation,
   useGetAllInstitutionsQuery,
   useAddInstituteMutation,
   useGetAllImamMuzzainQuery,
   useAddImamMuzzainMutation,
   useDeleteImamMuzzainMutation,
   useGetAllCarsQuery,
   useAddCarMutation,
   useDeleteCarMutation
} = adminApi;