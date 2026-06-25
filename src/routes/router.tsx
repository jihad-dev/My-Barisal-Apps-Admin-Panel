import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/Mainlayout";
import Home from "../Pages/Home/Home/Home";
import Error from "../Pages/Error/Error";
import Login from "../Pages/Login/Login";
import Dashboard from "../components/layout/Dashboard";
import AdminHome from "../Pages/AdminPage/AdminHome";
import Customers from "../Pages/AdminPage/Customers";
import PrivateRoute from "../utils/PrivateRoute";
import Profile from "../Pages/Profile/Profile";
import ViewUserInfo from "../Pages/AdminPage/ViewUserInfo";
import ChangeStatus from "../Pages/AdminPage/ChangeStatus";
import AllAdmin from "../Pages/AdminPage/AllAdmin";
import CreateAdmin from "../Pages/AdminPage/CreateAdmin";
import ViewAdminInfo from "../Pages/AdminPage/ViewAdminInfo";
import Unauthorized from "../utils/Unauthorized";
import AllHospitals from "../Pages/AdminPage/AllHospital";
import AllAmbulances from "../Pages/AdminPage/AllAmbulance";
import AddHospital from "../Pages/AdminPage/AddHospital";
import AllLayers from "../Pages/AdminPage/AllLayers";
import AddLawyerPage from "../Pages/AdminPage/AddLawyerPage";
import AllDoctors from "../Pages/AdminPage/AllDoctors";
import AddDoctor from "../Pages/AdminPage/AddDoctor";
import AddAmbulance from "../Pages/AdminPage/AddAmbulance";
import AllDonars from "../Pages/AdminPage/AllDonars";
import AllPolice from "../Pages/AdminPage/AllPolice";
import AddPoliceStation from "../Pages/AdminPage/AddPoliceStation";
import RegisterDonor from "../Pages/AdminPage/RegisterDonar";
import All_Rent_A_Car from "../Pages/AdminPage/All_Rent_A_Car";
import Add_Rent_A_Car from "../Pages/AdminPage/Add_Rent_A_Car";
import All_Fire_Service_Station from "../Pages/AdminPage/All_Fire_Service_Station";
import Add_Fire_Service from "../Pages/AdminPage/Add_Fire_Service";
import All_Bank_Lists from "../Pages/AdminPage/All_Bank_Lists";
import AddBank from "../Pages/AdminPage/AddBank";
export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute allowedRoles={["admin"]}>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard/admin-home",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminHome />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-hospitals",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AllHospitals />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-doctors",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AllDoctors />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/add-doctor",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AddDoctor />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/hospitals/add",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AddHospital />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-lawyers",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AllLayers />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/add-lawyer",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AddLawyerPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-ambulances",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AllAmbulances />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-donors",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AllDonars />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/add-donor",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <RegisterDonor />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-police",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AllPolice />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-cars",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <All_Rent_A_Car />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-fire-station",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <All_Fire_Service_Station />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/add-fire-station",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <Add_Fire_Service />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/cars/add",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <Add_Rent_A_Car />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/all-banks",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <All_Bank_Lists />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/add-bank",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AddBank />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/add-station",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AddPoliceStation />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/add-ambulance",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AddAmbulance />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/users",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <Customers />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/users/:id",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <ViewUserInfo />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/users/change-status/:id",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <ChangeStatus />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/All-admin",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AllAdmin />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/admin/create-admin",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <CreateAdmin />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/admin/admin-info/:id",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <ViewAdminInfo />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);
