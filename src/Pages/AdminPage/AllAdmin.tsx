import { useState, useMemo } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiAlertCircle,
  FiRefreshCw,
  FiUserCheck,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteAdminMutation,
  useGetAllAdminsQuery,
} from "../../Redux/features/admin/adminApi";

// টাইপ ডেফিনিশন
export interface IAdmin {
  _id: string;
  avatar?: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
}

// 💀 Skeleton Loader Components
const TableRowSkeleton = () => (
  <tr className="animate-pulse border-b border-gray-100">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-100 rounded w-44"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-gray-100 rounded-full w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-gray-100 rounded-full w-16"></div>
    </td>
    <td className="px-6 py-4 text-right">
      <div className="h-8 bg-gray-100 rounded-lg w-24 ml-auto"></div>
    </td>
  </tr>
);

const CardSkeleton = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-100 rounded w-3/4"></div>
      </div>
    </div>
    <div className="h-8 bg-gray-50 rounded-lg w-full"></div>
  </div>
);

const AllAdmin = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useGetAllAdminsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [deleteAdmin] = useDeleteAdminMutation();

  // ১. মেমোইজড ডাটা এক্সট্রাকশন
  const admins: IAdmin[] = useMemo(() => {
    if (!responseData) return [];
    return Array.isArray(responseData)
      ? responseData
      : responseData?.data || [];
  }, [responseData]);

  // ২. সার্চ ফিল্টারিং (মেমোইজড)
  const filteredAdmins = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return admins;
    return admins.filter(
      (admin) =>
        admin.name?.toLowerCase().includes(query) ||
        admin.email?.toLowerCase().includes(query),
    );
  }, [admins, searchTerm]);

  // ৩. ডিলিট হ্যান্ডলার
  const handleDelete = async (admin: IAdmin) => {
    const result = await Swal.fire({
      title: "Delete Admin Account",
      text: `Are you sure you want to delete ${admin.name}'s account? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-2xl",
        title: "text-xl font-bold text-gray-900",
        htmlContainer: "text-gray-600 text-sm",
        confirmButton: "px-4 py-2 text-sm font-semibold rounded-xl",
        cancelButton: "px-4 py-2 text-sm font-semibold rounded-xl",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteAdmin(admin._id).unwrap();
        Swal.fire({
          title: "Account Deleted",
          text: `${admin.name}'s account has been successfully deleted.`,
          icon: "success",
          confirmButtonColor: "#2563eb",
          customClass: {
            popup: "rounded-2xl",
            confirmButton: "px-4 py-2 text-sm font-semibold rounded-xl",
          },
        });
      } catch (error: unknown) {
        const err = error as { data?: { message?: string } };
        const errorMessage =
          err?.data?.message || "An error occurred while deleting the admin.";
        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          customClass: {
            popup: "rounded-2xl",
          },
        });
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* হেডার অ্যান্ড সার্চ বার */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              All Administrators
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage permissions and monitor administrator accounts
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <FiSearch
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full sm:w-72 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
              />
            </div>

            <Link
              to="/dashboard/admin/create-admin"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all active:scale-95 shrink-0"
            >
              <FiUserPlus size={18} />
              <span>Add New Admin</span>
            </Link>
          </div>
        </div>

        {/* ১. লোডিং স্টেট (Skeletons) */}
        {isLoading && (
          <div>
            {/* Mobile Skeleton */}
            <div className="block sm:hidden space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
            {/* Desktop Skeleton */}
            <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Admin Info
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ২. এরর স্টেট */}
        {isError && !isLoading && (
          <div className="bg-white rounded-2xl p-8 text-center border border-red-100 shadow-sm flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-red-50 text-red-500 rounded-full">
              <FiAlertCircle size={32} />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Failed to load admin data
            </h3>
            <p className="text-xs text-gray-500">
              There was an issue fetching administrators from the server.
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors"
            >
              <FiRefreshCw size={14} /> Retry Request
            </button>
          </div>
        )}

        {/* ৩. খালি স্টেট */}
        {!isLoading && !isError && filteredAdmins.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3">
            <FiUserCheck className="text-gray-300" size={40} />
            <p className="text-gray-600 font-bold text-base">
              No administrators found
            </p>
            <p className="text-xs text-gray-400">
              Try adjusting your search query or add a new admin.
            </p>
          </div>
        )}

        {/* ৪. প্রধান ডাটা ভিউ (রেসপন্সিভ কার্ডস + রেসপন্সিভ টেবিল) */}
        {!isLoading && !isError && filteredAdmins.length > 0 && (
          <>
            {/* মোবাইল ভিউ (Cards Layout) */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="block sm:hidden space-y-3"
            >
              <AnimatePresence>
                {filteredAdmins.map((admin) => (
                  <motion.div
                    key={admin._id}
                    variants={itemVariants}
                    layout
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="h-12 w-12 rounded-full object-cover border border-gray-100"
                        src={
                          admin.avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                        }
                        alt={admin.name}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-gray-900 truncate">
                          {admin.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {admin.email}
                        </p>
                        <div className="flex gap-2 mt-1.5">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            {admin.role || "Admin"}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {admin.status || "Active"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                      <Link
                        to={`/dashboard/admin/admin-info/${admin._id}`}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </Link>
                      <button
                        className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        title="Edit Admin"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(admin)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Admin"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ডেসকটপ ভিউ (Table Layout) */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Admin Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  <AnimatePresence>
                    {filteredAdmins.map((admin) => (
                      <motion.tr
                        key={admin._id}
                        variants={itemVariants}
                        layout
                        className="hover:bg-gray-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              className="h-12 w-12 rounded-full object-cover border border-gray-100"
                              src={
                                admin.avatar ||
                                "https://img.magnific.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_test_b&w=740&q=80"
                              }
                              alt={admin.name}
                            />
                            <div>
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {admin.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {admin.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 inline-flex text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            {admin.role || "Admin"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 inline-flex text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {admin.status || "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/dashboard/admin/admin-info/${admin._id}`}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FiEye size={18} />
                            </Link>
                            <button
                              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit Admin"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(admin)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Admin"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllAdmin;
