// // import { useState } from "react";
// // import {
// //   FiSearch,
// //   FiEye,
// //   FiTrash2,
// //   FiChevronLeft,
// //   FiChevronRight,
// // } from "react-icons/fi";
// // import { motion, AnimatePresence } from "framer-motion";
// // import Loader from "../../utils/Loader";
// // import { Link } from "react-router-dom";
// // import {
// //   useDeleteUserMutation,
// //   useGetAllUsersQuery,
// // } from "../../Redux/features/admin/adminApi";
// // import Swal from "sweetalert2";

// // const Customers = () => {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [sortBy, setSortBy] = useState("name");
// //   const [filterStatus, setFilterStatus] = useState("all");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage] = useState(10);

// //   const { data: users, isLoading } = useGetAllUsersQuery<any>(undefined, {
// //     refetchOnMountOrArgChange: true,
// //     refetchOnFocus: true,
// //     refetchOnReconnect: true,
// //   });
// //   const [deleteUser] = useDeleteUserMutation();

// //   if (isLoading) {
// //     return <Loader />;
// //   }

// //   // delete user

// //   const handleDelete = async (user: any) => {
// //     Swal.fire({
// //       title: "Delete Admin Account",
// //       text: `Are you sure you want to delete ${user.name}'s account? This action cannot be undone.`,
// //       icon: "warning",
// //       showCancelButton: true,
// //       confirmButtonText: "Delete",
// //       cancelButtonText: "Cancel",
// //       confirmButtonColor: "#dc2626",
// //       cancelButtonColor: "#6b7280",
// //       customClass: {
// //         popup: "rounded-xl",
// //         title: "text-xl font-semibold text-gray-900",
// //         htmlContainer: "text-gray-600",
// //         confirmButton: "px-4 py-2 text-sm font-medium rounded-lg",
// //         cancelButton: "px-4 py-2 text-sm font-medium rounded-lg",
// //       },
// //     }).then(async (result) => {
// //       if (result.isConfirmed) {
// //         try {
// //           await deleteUser(user._id).unwrap();
// //           // Success notification
// //           Swal.fire({
// //             title: "Account Deleted",
// //             text: `${user.name}'s account has been successfully deleted.`,
// //             icon: "success",
// //             confirmButtonColor: "#3b82f6",
// //             customClass: {
// //               popup: "rounded-xl",
// //               title: "text-xl font-semibold text-gray-900",
// //               htmlContainer: "text-gray-600",
// //               confirmButton: "px-4 py-2 text-sm font-medium rounded-lg",
// //             },
// //           });
// //         } catch (error: any) {
// //           console.error("Delete mutation failed:", error);
// //           // Safely access the error message
// //           const errorMessage =
// //             error?.data?.message ||
// //             "An error occurred while deleting the admin.";
// //           Swal.fire({
// //             title: "Error",
// //             text: errorMessage,
// //             icon: "error",
// //           });
// //         }
// //       } else {
// //         Swal.fire({
// //           title: "Cancelled",
// //           text: "The admin account was not deleted.",
// //           icon: "error",
// //         });
// //       }
// //     });
// //   };

// //   const containerVariants = {
// //     hidden: { opacity: 0 },
// //     visible: {
// //       opacity: 1,
// //       transition: {
// //         staggerChildren: 0.1,
// //         duration: 0.3,
// //       },
// //     },
// //   };

// //   const itemVariants = {
// //     hidden: { opacity: 0, y: 20 },
// //     visible: {
// //       opacity: 1,
// //       y: 0,
// //       transition: {
// //         duration: 0.5,
// //       },
// //     },
// //   };

// //   const cardVariants = {
// //     hover: {
// //       scale: 1.02,
// //       transition: {
// //         duration: 0.2,
// //       },
// //     },
// //   };

// //   // Filter and sort customers
// //   const filteredCustomers = Array.isArray(users)
// //     ? users
// //         .filter((customer: any) => {
// //           const matchesSearch =
// //             customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //             customer.email.toLowerCase().includes(searchTerm.toLowerCase());
// //           const matchesStatus =
// //             filterStatus === "all" || customer.status === filterStatus;
// //           return matchesSearch && matchesStatus;
// //         })
// //         .sort((a: any, b: any) => {
// //           switch (sortBy) {
// //             case "orders":
// //               return b.orders - a.orders;
// //             case "spent":
// //               return b.totalSpent - a.totalSpent;
// //             case "recent":
// //               return (
// //                 new Date(b.lastOrder).getTime() -
// //                 new Date(a.lastOrder).getTime()
// //               );
// //             default:
// //               return a.name.localeCompare(b.name);
// //           }
// //         })
// //     : []; // Default to empty array if users is not an array

// //   // Get current customers for pagination
// //   const indexOfLastCustomer = currentPage * itemsPerPage;
// //   const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
// //   // const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
// //   const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

// //   // Change page
// //   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

// //   return (
// //     <motion.div
// //       initial="hidden"
// //       animate="visible"
// //       variants={containerVariants}
// //       className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8"
// //     >
// //       <div className="max-w-[1400px] mx-auto space-y-6">
// //         {/* Header Section */}
// //         <motion.div
// //           variants={itemVariants}
// //           className="bg-white rounded-2xl shadow-md p-4 sm:p-6"
// //         >
// //           <div className="text-center">
// //             <motion.h1
// //               initial={{ opacity: 0, y: -20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.5, delay: 0.2 }}
// //               className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500"
// //             >
// //               Customer Management
// //             </motion.h1>
// //             <motion.p
// //               initial={{ opacity: 0 }}
// //               animate={{ opacity: 1 }}
// //               transition={{ duration: 0.5, delay: 0.4 }}
// //               className="mt-1 text-sm text-gray-500"
// //             >
// //               Track and manage your customer relationships
// //             </motion.p>
// //           </div>
// //         </motion.div>

// //         {/* Stats Cards */}
// //         <motion.div
// //           variants={itemVariants}
// //           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
// //         >
// //           {[
// //             {
// //               title: "Total Customers",
// //               value: Array.isArray(users) ? users.length : 0,
// //               change: "↑ 12%",
// //               isPositive: true,
// //             },
// //             {
// //               title: "Active Customers",
// //               value: Array.isArray(users)
// //                 ? users.filter((user: any) => user.status === "active").length
// //                 : 0,
// //               change: "↑ 8%",
// //               isPositive: true,
// //             },
// //             {
// //               title: "Total Revenue",
// //               value: Array.isArray(users)
// //                 ? `$${users.reduce((acc: number, user: any) => acc + (user.totalSpent || 0), 0).toLocaleString()}`
// //                 : "$0",
// //               change: "↑ 15%",
// //               isPositive: true,
// //             },
// //             {
// //               title: "Avg. Order Value",
// //               value:
// //                 Array.isArray(users) && users.length > 0
// //                   ? `$${(users.reduce((acc: number, user: any) => acc + (user.totalSpent || 0), 0) / users.length).toFixed(2)}`
// //                   : "$0",
// //               change: "↓ 3%",
// //               isPositive: false,
// //             },
// //           ].map((stat: any, index: any) => (
// //             <motion.div
// //               key={index}
// //               variants={cardVariants}
// //               whileHover="hover"
// //               className="bg-white p-4 rounded-2xl shadow-md transform transition-all duration-200"
// //             >
// //               <div className="text-sm text-gray-500">{stat.title}</div>
// //               <div className="text-2xl font-bold mt-2">{stat.value}</div>
// //               <div
// //                 className={`text-xs ${stat.isPositive ? "text-green-600" : "text-red-600"} mt-1`}
// //               >
// //                 {stat.change} from last month
// //               </div>
// //             </motion.div>
// //           ))}
// //         </motion.div>

// //         {/* Filters Section */}
// //         <motion.div
// //           variants={itemVariants}
// //           className="bg-white rounded-2xl shadow-md p-4 sm:p-6"
// //         >
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //             <motion.div whileTap={{ scale: 0.98 }} className="relative">
// //               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
// //               <input
// //                 type="text"
// //                 placeholder="Search customers..."
// //                 className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //               />
// //             </motion.div>

// //             <motion.select
// //               whileTap={{ scale: 0.98 }}
// //               className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
// //               value={sortBy}
// //               onChange={(e) => setSortBy(e.target.value)}
// //             >
// //               <option value="name">Sort by Name</option>
// //               <option value="orders">Sort by Orders</option>
// //               <option value="spent">Sort by Amount Spent</option>
// //               <option value="recent">Sort by Recent Order</option>
// //             </motion.select>

// //             <motion.select
// //               whileTap={{ scale: 0.98 }}
// //               className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
// //               value={filterStatus}
// //               onChange={(e) => setFilterStatus(e.target.value)}
// //             >
// //               <option value="all">All Customers</option>
// //               <option value="active">Active</option>
// //               <option value="inactive">Inactive</option>
// //             </motion.select>
// //           </div>
// //         </motion.div>

// //         {/* Table Section */}
// //         <motion.div
// //           variants={itemVariants}
// //           className="bg-white rounded-2xl shadow-md overflow-hidden"
// //         >
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead>
// //                 <tr className="bg-gray-50">
// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
// //                     Customer
// //                   </th>
// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
// //                     Contact
// //                   </th>
// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
// //                     Role
// //                   </th>

// //                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
// //                     Status
// //                   </th>
// //                   <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-100 bg-white">
// //                 <AnimatePresence>
// //                   {users?.data?.map((customer: any, index: any) => (
// //                     <motion.tr
// //                       key={index}
// //                       initial={{ opacity: 0, x: -20 }}
// //                       animate={{ opacity: 1, x: 0 }}
// //                       exit={{ opacity: 0, x: 20 }}
// //                       whileHover={{
// //                         backgroundColor: "rgba(249, 250, 251, 0.5)",
// //                       }}
// //                       className="transition-colors"
// //                     >
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="flex items-center">
// //                           <motion.div
// //                             whileHover={{ scale: 1.1 }}
// //                             className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center shadow-inner"
// //                           >
// //                             <span className="text-sm font-semibold text-blue-800">
// //                               {customer?.name?.charAt(0)}
// //                             </span>
// //                           </motion.div>
// //                           <div className="ml-4">
// //                             <div className="text-sm font-semibold text-gray-900">
// //                               {customer?.name} * {customer?.userId}
// //                             </div>
// //                             <div className="text-xs text-gray-500 md:hidden">
// //                               {customer?.email}
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
// //                         <div className="text-sm text-gray-600">
// //                           {customer?.email}
// //                         </div>
// //                         <div className="text-xs text-gray-500">
// //                           Last order: {customer?.lastOrder}
// //                         </div>
// //                       </td>

// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-900">
// //                           {customer?.role}
// //                         </div>
// //                       </td>

// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <motion.span
// //                           whileHover={{ scale: 1.05 }}
// //                           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
// //                             customer?.status === "in-progress"
// //                               ? "bg-green-100 text-green-800"
// //                               : "bg-red-100 text-red-800"
// //                           }`}
// //                         >
// //                           <span
// //                             className={`w-1.5 h-1.5 rounded-full ${
// //                               customer.status === "in-progress"
// //                                 ? "bg-green-600"
// //                                 : "bg-red-600"
// //                             } mr-1.5`}
// //                           ></span>
// //                           {customer.status}
// //                         </motion.span>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
// //                         <Link
// //                           to={`/dashboard/users/change-status/${customer?._id}`}
// //                         >
// //                           <motion.button
// //                             whileHover={{ scale: 1.05 }}
// //                             whileTap={{ scale: 0.95 }}
// //                             className="inline-flex cursor-pointer items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors mr-2"
// //                           >
// //                             <FiChevronRight className="w-4 h-4 mr-1.5" />
// //                             Change Status
// //                           </motion.button>
// //                         </Link>

// //                         <Link to={`/dashboard/users/${customer?._id}`}>
// //                           <motion.button
// //                             whileHover={{ scale: 1.05 }}
// //                             whileTap={{ scale: 0.95 }}
// //                             className="inline-flex cursor-pointer items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors mr-2"
// //                           >
// //                             <FiEye className="w-4 h-4 mr-1.5" />
// //                             View
// //                           </motion.button>
// //                         </Link>
// //                         <>
// //                           <motion.button
// //                             onClick={() => handleDelete(customer)}
// //                             whileHover={{ scale: 1.05 }}
// //                             whileTap={{ scale: 0.95 }}
// //                             className="inline-flex cursor-pointer items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
// //                           >
// //                             <FiTrash2 className="w-4 h-4 mr-1.5" />
// //                             Delete
// //                           </motion.button>
// //                         </>
// //                       </td>
// //                     </motion.tr>
// //                   ))}
// //                 </AnimatePresence>
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Pagination */}
// //           <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
// //             <div className="flex-1 flex justify-between sm:hidden">
// //               <button
// //                 onClick={() => paginate(currentPage - 1)}
// //                 disabled={currentPage === 1}
// //                 className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
// //                   currentPage === 1
// //                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
// //                     : "bg-white text-gray-700 hover:bg-gray-50"
// //                 }`}
// //               >
// //                 Previous
// //               </button>
// //               <button
// //                 onClick={() => paginate(currentPage + 1)}
// //                 disabled={currentPage === totalPages}
// //                 className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
// //                   currentPage === totalPages
// //                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
// //                     : "bg-white text-gray-700 hover:bg-gray-50"
// //                 }`}
// //               >
// //                 Next
// //               </button>
// //             </div>
// //             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-700">
// //                   Showing{" "}
// //                   <span className="font-medium">
// //                     {indexOfFirstCustomer + 1}
// //                   </span>{" "}
// //                   to{" "}
// //                   <span className="font-medium">
// //                     {Math.min(indexOfLastCustomer, filteredCustomers.length)}
// //                   </span>{" "}
// //                   of{" "}
// //                   <span className="font-medium">
// //                     {filteredCustomers.length}
// //                   </span>{" "}
// //                   results
// //                 </p>
// //               </div>
// //               <div>
// //                 <nav
// //                   className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
// //                   aria-label="Pagination"
// //                 >
// //                   <button
// //                     onClick={() => paginate(currentPage - 1)}
// //                     disabled={currentPage === 1}
// //                     className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
// //                       currentPage === 1
// //                         ? "bg-gray-100 text-gray-400 cursor-not-allowed"
// //                         : "bg-white text-gray-500 hover:bg-gray-50"
// //                     }`}
// //                   >
// //                     <span className="sr-only">Previous</span>
// //                     <FiChevronLeft className="h-5 w-5" />
// //                   </button>
// //                   {[...Array(totalPages)].map((_, index) => (
// //                     <button
// //                       key={index}
// //                       onClick={() => paginate(index + 1)}
// //                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
// //                         currentPage === index + 1
// //                           ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
// //                           : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
// //                       }`}
// //                     >
// //                       {index + 1}
// //                     </button>
// //                   ))}
// //                   <button
// //                     onClick={() => paginate(currentPage + 1)}
// //                     disabled={currentPage === totalPages}
// //                     className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
// //                       currentPage === totalPages
// //                         ? "bg-gray-100 text-gray-400 cursor-not-allowed"
// //                         : "bg-white text-gray-500 hover:bg-gray-50"
// //                     }`}
// //                   >
// //                     <span className="sr-only">Next</span>
// //                     <FiChevronRight className="h-5 w-5" />
// //                   </button>
// //                 </nav>
// //               </div>
// //             </div>
// //           </div>
// //         </motion.div>
// //       </div>
// //     </motion.div>
// //   );
// // };

// // export default Customers;

// import { useState } from "react";
// import {
//   FiSearch,
//   FiEye,
//   FiTrash2,
//   FiChevronLeft,
//   FiChevronRight,
//   FiUsers,
//   FiUserCheck,
//   FiUserX,
//   FiFilter,
// } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2";

// import { useDeleteUserMutation, useGetAllUsersQuery } from "../../Redux/features/admin/adminApi";
// import Loader from "../../utils/Loader";

// const container = {
//   hidden: { opacity: 0 },
//   show: { opacity: 1, transition: { staggerChildren: 0.07 } },
// };
// const item = {
//   hidden: { opacity: 0, y: 14 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
// };

// const MOCK_USERS = [
//   {
//     _id: "1",
//     name: "আরিফ হোসেন",
//     email: "arif@mybarisal.com",
//     role: "admin",
//     status: "active",
//   },
//   {
//     _id: "2",
//     name: "সাবিনা আক্তার",
//     email: "sabina@mybarisal.com",
//     role: "user",
//     status: "active",
//   },
//   {
//     _id: "3",
//     name: "রাহাত খান",
//     email: "rahat@mybarisal.com",
//     role: "user",
//     status: "inactive",
//   },
//   {
//     _id: "4",
//     name: "নাজমুল ইসলাম",
//     email: "nazmul@mybarisal.com",
//     role: "moderator",
//     status: "active",
//   },
//   {
//     _id: "5",
//     name: "ফারহানা বেগম",
//     email: "farhana@mybarisal.com",
//     role: "user",
//     status: "inactive",
//   },
//   {
//     _id: "6",
//     name: "জিহাদুল ইসলাম",
//     email: "jihad@mybarisal.com",
//     role: "admin",
//     status: "active",
//   },
// ];

// const ITEMS_PER_PAGE = 5;

// const roleConfig: Record<string, { label: string; classes: string }> = {
//   admin: {
//     label: "অ্যাডমিন",
//     classes: "bg-purple-50 text-purple-700 border border-purple-200",
//   },
//   moderator: {
//     label: "মডারেটর",
//     classes: "bg-blue-50 text-blue-700 border border-blue-200",
//   },
//   user: {
//     label: "ব্যবহারকারী",
//     classes: "bg-gray-50 text-gray-600 border border-gray-200",
//   },
// };

// const statusConfig: Record<
//   string,
//   { label: string; dot: string; classes: string }
// > = {
//   active: {
//     label: "সক্রিয়",
//     dot: "bg-green-500",
//     classes: "bg-green-50 text-green-700 border border-green-200",
//   },
//   inactive: {
//     label: "নিষ্ক্রিয়",
//     dot: "bg-red-400",
//     classes: "bg-red-50 text-red-600 border border-red-200",
//   },
// };

// const Users = () => {
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [page, setPage] = useState(1);

//   // ── swap mock with real data ──
//   const users = MOCK_USERS;
//   const isLoading = false;
//   const { data, isLoading } = useGetAllUsersQuery(...);
//   const users = data?.data ?? [];
//   const [deleteUser] = useDeleteUserMutation();

//   const handleDelete = (user: any) => {
//     Swal.fire({
//       title: "অ্যাকাউন্ট মুছবেন?",
//       text: `"${user.name}" এর অ্যাকাউন্ট স্থায়ীভাবে মুছে যাবে।`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "হ্যাঁ, মুছুন",
//       cancelButtonText: "বাতিল",
//       confirmButtonColor: "#ef4444",
//       cancelButtonColor: "#6b7280",
//       customClass: { popup: "rounded-2xl font-sans" },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // await deleteUser(user._id).unwrap();
//         Swal.fire({
//           title: "মুছে ফেলা হয়েছে",
//           icon: "success",
//           confirmButtonColor: "#3b82f6",
//           customClass: { popup: "rounded-2xl" },
//         });
//       }
//     });
//   };

//   const filtered = users.filter((u) => {
//     const matchSearch =
//       u.name.toLowerCase().includes(search.toLowerCase()) ||
//       u.email.toLowerCase().includes(search.toLowerCase());
//     const matchStatus = statusFilter === "all" || u.status === statusFilter;
//     const matchRole = roleFilter === "all" || u.role === roleFilter;
//     return matchSearch && matchStatus && matchRole;
//   });

//   const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
//   const paginated = filtered.slice(
//     (page - 1) * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE,
//   );
//   const activeCount = users.filter((u) => u.status === "active").length;
//   const inactiveCount = users.length - activeCount;

//   const initials = (name: string) =>
//     name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);

//   const avatarGradients = [
//     "from-blue-400 to-blue-600",
//     "from-purple-400 to-purple-600",
//     "from-green-400 to-green-600",
//     "from-amber-400 to-amber-600",
//     "from-rose-400 to-rose-600",
//     "from-cyan-400 to-cyan-600",
//   ];

//   if (isLoading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-gray-400">লোড হচ্ছে...</p>
//         </div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//       <motion.div
//         className="max-w-7xl mx-auto space-y-5"
//         variants={container}
//         initial="hidden"
//         animate="show"
//       >
//         {/* ── Page Header ── */}
//         <motion.div
//           variants={item}
//           className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
//         >
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
//               ব্যবহারকারী ব্যবস্থাপনা
//             </h1>
//             <p className="text-sm text-gray-400 mt-0.5">
//               মোট {users.length} জন নিবন্ধিত ব্যবহারকারী
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl font-medium">
//               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//               {activeCount} সক্রিয়
//             </span>
//             <span className="flex items-center gap-1.5 text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl font-medium">
//               <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
//               {inactiveCount} নিষ্ক্রিয়
//             </span>
//           </div>
//         </motion.div>

//         {/* ── Stats ── */}
//         <motion.div variants={item} className="grid grid-cols-3 gap-3 sm:gap-4">
//           {[
//             {
//               label: "মোট ব্যবহারকারী",
//               value: users.length,
//               icon: <FiUsers />,
//               bg: "bg-blue-50",
//               text: "text-blue-600",
//               iconBg: "bg-blue-100",
//             },
//             {
//               label: "সক্রিয়",
//               value: activeCount,
//               icon: <FiUserCheck />,
//               bg: "bg-green-50",
//               text: "text-green-600",
//               iconBg: "bg-green-100",
//             },
//             {
//               label: "নিষ্ক্রিয়",
//               value: inactiveCount,
//               icon: <FiUserX />,
//               bg: "bg-red-50",
//               text: "text-red-500",
//               iconBg: "bg-red-100",
//             },
//           ].map((s) => (
//             <div key={s.label} className={`${s.bg} rounded-2xl p-4 sm:p-5`}>
//               <div
//                 className={`w-9 h-9 ${s.iconBg} ${s.text} rounded-xl flex items-center justify-center text-base mb-3`}
//               >
//                 {s.icon}
//               </div>
//               <p className={`text-2xl sm:text-3xl font-bold ${s.text}`}>
//                 {s.value}
//               </p>
//               <p className="text-xs text-gray-500 mt-1 font-medium">
//                 {s.label}
//               </p>
//             </div>
//           ))}
//         </motion.div>

//         {/* ── Filters ── */}
//         <motion.div
//           variants={item}
//           className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
//         >
//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* Search */}
//             <div className="relative flex-1">
//               <FiSearch
//                 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
//                 size={15}
//               />
//               <input
//                 type="text"
//                 placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//                 className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
//               />
//             </div>

//             {/* Status Filter */}
//             <div className="relative">
//               <FiFilter
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                 size={13}
//               />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => {
//                   setStatusFilter(e.target.value);
//                   setPage(1);
//                 }}
//                 className="pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all appearance-none cursor-pointer"
//               >
//                 <option value="all">সব স্ট্যাটাস</option>
//                 <option value="active">সক্রিয়</option>
//                 <option value="inactive">নিষ্ক্রিয়</option>
//               </select>
//             </div>

//             {/* Role Filter */}
//             <div className="relative">
//               <FiFilter
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                 size={13}
//               />
//               <select
//                 value={roleFilter}
//                 onChange={(e) => {
//                   setRoleFilter(e.target.value);
//                   setPage(1);
//                 }}
//                 className="pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all appearance-none cursor-pointer"
//               >
//                 <option value="all">সব রোল</option>
//                 <option value="admin">অ্যাডমিন</option>
//                 <option value="moderator">মডারেটর</option>
//                 <option value="user">ব্যবহারকারী</option>
//               </select>
//             </div>
//           </div>
//         </motion.div>

//         {/* ── Table ── */}
//         <motion.div
//           variants={item}
//           className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
//         >
//           {/* Table Header */}
//           <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
//             <p className="text-sm font-semibold text-gray-700">
//               {filtered.length} জন পাওয়া গেছে
//             </p>
//             <p className="text-xs text-gray-400">
//               পৃষ্ঠা {page} / {totalPages}
//             </p>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead>
//                 <tr className="bg-gray-50/80 border-b border-gray-100">
//                   {["ব্যবহারকারী", "ইমেইল", "রোল", "স্ট্যাটাস", "অ্যাকশন"].map(
//                     (h) => (
//                       <th
//                         key={h}
//                         className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
//                       >
//                         {h}
//                       </th>
//                     ),
//                   )}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 <AnimatePresence mode="popLayout">
//                   {paginated.length === 0 ? (
//                     <tr>
//                       <td colSpan={5} className="px-5 py-16 text-center">
//                         <div className="flex flex-col items-center gap-2 text-gray-300">
//                           <FiUsers size={36} />
//                           <p className="text-sm font-medium text-gray-400">
//                             কোনো ব্যবহারকারী পাওয়া যায়নি
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : (
//                     paginated.map((user, i) => (
//                       <motion.tr
//                         key={user._id}
//                         layout
//                         initial={{ opacity: 0, y: 8 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -8 }}
//                         transition={{ duration: 0.25, delay: i * 0.04 }}
//                         className="hover:bg-gray-50/70 transition-colors group"
//                       >
//                         {/* Name + Avatar */}
//                         <td className="px-5 py-3.5 whitespace-nowrap">
//                           <div className="flex items-center gap-3">
//                             <div
//                               className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm`}
//                             >
//                               {initials(user.name)}
//                             </div>
//                             <div>
//                               <p className="text-[13px] font-semibold text-gray-800">
//                                 {user.name}
//                               </p>
//                               <p className="text-[11px] text-gray-400 sm:hidden">
//                                 {user.email}
//                               </p>
//                             </div>
//                           </div>
//                         </td>

//                         {/* Email */}
//                         <td className="px-5 py-3.5 whitespace-nowrap hidden sm:table-cell">
//                           <p className="text-[13px] text-gray-500">
//                             {user.email}
//                           </p>
//                         </td>

//                         {/* Role */}
//                         <td className="px-5 py-3.5 whitespace-nowrap">
//                           <span
//                             className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${roleConfig[user.role]?.classes}`}
//                           >
//                             {roleConfig[user.role]?.label ?? user.role}
//                           </span>
//                         </td>

//                         {/* Status */}
//                         <td className="px-5 py-3.5 whitespace-nowrap">
//                           <span
//                             className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${statusConfig[user.status]?.classes}`}
//                           >
//                             <span
//                               className={`w-1.5 h-1.5 rounded-full ${statusConfig[user.status]?.dot}`}
//                             />
//                             {statusConfig[user.status]?.label ?? user.status}
//                           </span>
//                         </td>

//                         {/* Actions */}
//                         <td className="px-5 py-3.5 whitespace-nowrap">
//                           <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
//                             <Link
//                               to={`/dashboard/users/change-status/${user._id}`}
//                             >
//                               <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
//                               >
//                                 <FiChevronRight size={13} />
//                                 <span className="hidden sm:inline">
//                                   স্ট্যাটাস
//                                 </span>
//                               </motion.button>
//                             </Link>

//                             <Link to={`/dashboard/users/${user._id}`}>
//                               <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
//                               >
//                                 <FiEye size={13} />
//                                 <span className="hidden sm:inline">দেখুন</span>
//                               </motion.button>
//                             </Link>

//                             <motion.button
//                               onClick={() => handleDelete(user)}
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
//                             >
//                               <FiTrash2 size={13} />
//                               <span className="hidden sm:inline">মুছুন</span>
//                             </motion.button>
//                           </div>
//                         </td>
//                       </motion.tr>
//                     ))
//                   )}
//                 </AnimatePresence>
//               </tbody>
//             </table>
//           </div>

//           {/* ── Pagination ── */}
//           <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
//             <p className="text-xs text-gray-400 order-2 sm:order-1">
//               {filtered.length === 0
//                 ? "কোনো ফলাফল নেই"
//                 : `${(page - 1) * ITEMS_PER_PAGE + 1} – ${Math.min(page * ITEMS_PER_PAGE, filtered.length)} / ${filtered.length} জন`}
//             </p>
//             <div className="flex items-center gap-1.5 order-1 sm:order-2">
//               <motion.button
//                 whileTap={{ scale: 0.93 }}
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page === 1}
//                 className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//               >
//                 <FiChevronLeft size={15} />
//               </motion.button>

//               {[...Array(totalPages)].map((_, idx) => (
//                 <motion.button
//                   key={idx}
//                   whileTap={{ scale: 0.93 }}
//                   onClick={() => setPage(idx + 1)}
//                   className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
//                     page === idx + 1
//                       ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
//                       : "border border-gray-200 text-gray-500 hover:bg-gray-50"
//                   }`}
//                 >
//                   {idx + 1}
//                 </motion.button>
//               ))}

//               <motion.button
//                 whileTap={{ scale: 0.93 }}
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages}
//                 className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//               >
//                 <FiChevronRight size={15} />
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default Users;




import { useState } from "react";
import {
  FiSearch, FiEye, FiTrash2,
  FiChevronLeft, FiChevronRight,
  FiUsers, FiUserCheck, FiUserX, FiFilter,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useDeleteUserMutation, useGetAllUsersQuery } from "../../Redux/features/admin/adminApi";
import Loader from "../../utils/Loader";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const ITEMS_PER_PAGE = 5;

const roleConfig: Record<string, { label: string; classes: string }> = {
  admin:     { label: "অ্যাডমিন",    classes: "bg-purple-50 text-purple-700 border border-purple-200" },
  moderator: { label: "মডারেটর",     classes: "bg-blue-50 text-blue-700 border border-blue-200" },
  user:      { label: "ব্যবহারকারী", classes: "bg-gray-50 text-gray-600 border border-gray-200" },
};

const statusConfig: Record<string, { label: string; dot: string; classes: string }> = {
  active:   { label: "সক্রিয়",   dot: "bg-green-500", classes: "bg-green-50 text-green-700 border border-green-200" },
  inactive: { label: "নিষ্ক্রিয়", dot: "bg-red-400",  classes: "bg-red-50 text-red-600 border border-red-200" },
};

const avatarGradients = [
  "from-blue-400 to-blue-600",
  "from-purple-400 to-purple-600",
  "from-green-400 to-green-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-cyan-400 to-cyan-600",
];

const Users = () => {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter]   = useState("all");
  const [page, setPage]               = useState(1);

  const { data, isLoading } = useGetAllUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [deleteUser] = useDeleteUserMutation();

  const users: any[] = data?.data ?? [];

  const handleDelete = (user: any) => {
    Swal.fire({
      title: "অ্যাকাউন্ট মুছবেন?",
      text: `"${user.name}" এর অ্যাকাউন্ট স্থায়ীভাবে মুছে যাবে।`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      customClass: { popup: "rounded-2xl font-sans" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(user._id).unwrap();
          Swal.fire({
            title: "মুছে ফেলা হয়েছে",
            icon: "success",
            confirmButtonColor: "#3b82f6",
            customClass: { popup: "rounded-2xl" },
          });
        } catch (error: any) {
          Swal.fire({
            title: "সমস্যা হয়েছে",
            text: error?.data?.message || "কিছু একটা সমস্যা হয়েছে।",
            icon: "error",
            customClass: { popup: "rounded-2xl" },
          });
        }
      }
    });
  };

  const filtered = users.filter((u) => {
    const matchSearch  = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus  = statusFilter === "all" || u.status === statusFilter;
    const matchRole    = roleFilter   === "all" || u.role   === roleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  const totalPages    = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated     = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const activeCount   = users.filter((u) => u.status === "active").length;
  const inactiveCount = users.length - activeCount;

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <motion.div
        className="max-w-7xl mx-auto space-y-5"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* ── Page Header ── */}
        <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ব্যবহারকারী ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-400 mt-0.5">মোট {users.length} জন নিবন্ধিত ব্যবহারকারী</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {activeCount} সক্রিয়
            </span>
            <span className="flex items-center gap-1.5 text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {inactiveCount} নিষ্ক্রিয়
            </span>
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div variants={item} className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "মোট ব্যবহারকারী", value: users.length,  icon: <FiUsers />,     bg: "bg-blue-50",  text: "text-blue-600",  iconBg: "bg-blue-100"  },
            { label: "সক্রিয়",          value: activeCount,   icon: <FiUserCheck />, bg: "bg-green-50", text: "text-green-600", iconBg: "bg-green-100" },
            { label: "নিষ্ক্রিয়",       value: inactiveCount, icon: <FiUserX />,     bg: "bg-red-50",   text: "text-red-500",   iconBg: "bg-red-100"   },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 sm:p-5`}>
              <div className={`w-9 h-9 ${s.iconBg} ${s.text} rounded-xl flex items-center justify-center text-base mb-3`}>
                {s.icon}
              </div>
              <p className={`text-2xl sm:text-3xl font-bold ${s.text}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Filters ── */}
        <motion.div variants={item} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={13} />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="all">সব স্ট্যাটাস</option>
                <option value="active">সক্রিয়</option>
                <option value="inactive">নিষ্ক্রিয়</option>
              </select>
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={13} />
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                className="pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="all">সব রোল</option>
                <option value="admin">অ্যাডমিন</option>
                <option value="moderator">মডারেটর</option>
                <option value="user">ব্যবহারকারী</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* ── Table ── */}
        <motion.div variants={item} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">{filtered.length} জন পাওয়া গেছে</p>
            <p className="text-xs text-gray-400">পৃষ্ঠা {page} / {totalPages}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {["ব্যবহারকারী", "ইমেইল", "রোল", "স্ট্যাটাস", "অ্যাকশন"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode="popLayout">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <FiUsers size={36} className="text-gray-300" />
                          <p className="text-sm font-medium text-gray-400">কোনো ব্যবহারকারী পাওয়া যায়নি</p>
                        </div>
                      </td>
                    </tr>
                  ) : paginated.map((user, i) => (
                    <motion.tr
                      key={user._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className="hover:bg-gray-50/70 transition-colors group"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm`}>
                            {initials(user.name)}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-gray-800">{user.name}</p>
                            <p className="text-[11px] text-gray-400 sm:hidden">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap hidden sm:table-cell">
                        <p className="text-[13px] text-gray-500">{user.email}</p>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${roleConfig[user.role]?.classes}`}>
                          {roleConfig[user.role]?.label ?? user.role}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${statusConfig[user.status]?.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[user.status]?.dot}`} />
                          {statusConfig[user.status]?.label ?? user.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Link to={`/dashboard/users/change-status/${user._id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                            >
                              <FiChevronRight size={13} />
                              <span className="hidden sm:inline">স্ট্যাটাস</span>
                            </motion.button>
                          </Link>

                          <Link to={`/dashboard/users/${user._id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                            >
                              <FiEye size={13} />
                              <span className="hidden sm:inline">দেখুন</span>
                            </motion.button>
                          </Link>

                          <motion.button
                            onClick={() => handleDelete(user)}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                          >
                            <FiTrash2 size={13} />
                            <span className="hidden sm:inline">মুছুন</span>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400 order-2 sm:order-1">
              {filtered.length === 0
                ? "কোনো ফলাফল নেই"
                : `${(page - 1) * ITEMS_PER_PAGE + 1} – ${Math.min(page * ITEMS_PER_PAGE, filtered.length)} / ${filtered.length} জন`}
            </p>
            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft size={15} />
              </motion.button>

              {[...Array(totalPages)].map((_, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setPage(idx + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    page === idx + 1
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {idx + 1}
                </motion.button>
              ))}

              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight size={15} />
              </motion.button>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Users;