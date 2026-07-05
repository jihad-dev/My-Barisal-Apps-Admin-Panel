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
      // ৬. Donar Endpoints (Updated)
      // ==========================================
      getAllDonors: builder.query<any, void>({
         query: () => ({
            url: '/donars',
            method: 'GET',
         }),
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
      // ৭. Pharmacy Endpoints (Updated)
      // ==========================================
      getAllPharmacies: builder.query<any, void>({
         query: () => ({
            url: '/pharmacies',
            method: 'GET',
         }),
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
      // ৮. Bank Endpoints (Updated)
      // ==========================================
      getAllBanks: builder.query<any, void>({
         query: () => ({
            url: '/bank',
            method: 'GET',
         }),
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
      // ৯. Police Endpoints (Updated)
      // ==========================================
      getAllPolice: builder.query<any, void>({
         query: () => ({
            url: '/police',
            method: 'GET',
         }),
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
      // ১০. Fire Service Endpoints (Updated)
      // ==========================================
      getAllFireStation: builder.query<any, void>({
         query: () => ({
            url: '/fire-service',
            method: 'GET',
         }),
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
         query: () => ({
            url: '/institutions',
            method: 'GET',
         }),
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
         query: () => ({
            url: '/imam-muazzin',
            method: 'GET',
         }),
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