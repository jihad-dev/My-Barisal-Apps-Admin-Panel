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

  const users = data?.data ?? [];

  const handleDelete = (user:any) => {
    Swal.fire({
      title: "অ্যাকাউন্ট মুছবেন?",
      text: `"${user?.name}" এর অ্যাকাউন্ট স্থায়ীভাবে মুছে যাবে।`,
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