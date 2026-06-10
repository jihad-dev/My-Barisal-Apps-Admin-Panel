import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiPlus, FiEye, FiTrendingUp, FiActivity } from "react-icons/fi";
import {
  useGetAllAmbulanceQuery,
  useGetAllHospitalsQuery,
  useGetAllLawyersQuery,
  useGetAllUsersQuery,
} from "../../Redux/features/admin/adminApi";
import Loader from "../../utils/Loader";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const quickActions = [
  {
    label: "হাসপাতাল যোগ করুন",
    icon: "🏥",
    to: "/dashboard/hospitals/add",
    color: "bg-blue-50 hover:bg-blue-100 text-blue-700",
  },
  {
    label: "অ্যাম্বুলেন্স যোগ করুন",
    icon: "🚑",
    to: "/dashboard/ambulances/add",
    color: "bg-red-50 hover:bg-red-100 text-red-600",
  },
  {
    label: "আইনজীবী যোগ করুন",
    icon: "⚖️",
    to: "/dashboard/add-lawyer",
    color: "bg-amber-50 hover:bg-amber-100 text-amber-700",
  },
  {
    label: "গুণীজন যোগ করুন",
    icon: "🌟",
    to: "/dashboard/notable/add",
    color: "bg-purple-50 hover:bg-purple-100 text-purple-700",
  },
  {
    label: "ব্যবহারকারী দেখুন",
    icon: "👥",
    to: "/dashboard/users",
    color: "bg-green-50 hover:bg-green-100 text-green-700",
  },
  {
    label: "সংবাদ যোগ করুন",
    icon: "📰",
    to: "/dashboard/news/add",
    color: "bg-cyan-50 hover:bg-cyan-100 text-cyan-700",
  },
  {
    label: "ডাক্তার যোগ করুন",
    icon: "👨‍⚕️",
    to: "/dashboard/doctors/add",
    color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700",
  },
  {
    label: "পুলিশ স্টেশন পরিচালনা",
    icon: "🚓",
    to: "/dashboard/police",
    color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700",
  },
  {
    label: "ফায়ার সার্ভিস",
    icon: "🚒",
    to: "/dashboard/fire-service",
    color: "bg-orange-50 hover:bg-orange-100 text-orange-700",
  },
  {
    label: "ইমাম ও খতিব",
    icon: "🕌",
    to: "/dashboard/imams",
    color: "bg-teal-50 hover:bg-teal-100 text-teal-700",
  },
  {
    label: "গাড়ি/রেন্ট-এ-কার",
    icon: "🚗",
    to: "/dashboard/cars",
    color: "bg-slate-50 hover:bg-slate-100 text-slate-700",
  },
  {
    label: "রক্তের গ্রুপ/দাতা",
    icon: "🩸",
    to: "/dashboard/blood-donors",
    color: "bg-rose-50 hover:bg-rose-100 text-rose-700",
  },
];

const recentActivities = [
  {
    label: "নতুন হাসপাতাল যোগ হয়েছে",
    sub: "শের-ই-বাংলা মেডিকেল",
    time: "২ মিনিট আগে",
    dot: "bg-blue-500",
  },
  {
    label: "নতুন আইনজীবী যোগ হয়েছে",
    sub: "এড. হাসান খোরশেদ",
    time: "১৫ মিনিট আগে",
    dot: "bg-amber-500",
  },
  {
    label: "নতুন ব্যবহারকারী নিবন্ধন",
    sub: "arif@mybarisal.com",
    time: "৩২ মিনিট আগে",
    dot: "bg-green-500",
  },
  {
    label: "অ্যাম্বুলেন্স আপডেট হয়েছে",
    sub: "রেড ক্রিসেন্ট সার্ভিস",
    time: "১ ঘণ্টা আগে",
    dot: "bg-red-500",
  },
  {
    label: "নতুন গুণীজন যোগ হয়েছে",
    sub: "ড. আব্দুল করিম",
    time: "২ ঘণ্টা আগে",
    dot: "bg-purple-500",
  },
];

const AdminHome = () => {
  const { data: hospital, isLoading: isHospitalsLoading } =
    useGetAllHospitalsQuery(undefined);
  const { data: lawyers, isLoading: isLawyersLoading } =
    useGetAllLawyersQuery(undefined);
  const { data: users, isLoading: isUsersLoading } =
    useGetAllUsersQuery(undefined);
  const { data: ambulances, isLoading: isAmbulancesLoading } =
    useGetAllAmbulanceQuery(undefined);

  // Show the loader if any of the major API requests are still loading
  if (
    isHospitalsLoading ||
    isLawyersLoading ||
    isUsersLoading ||
    isAmbulancesLoading
  ) {
    return <Loader />;
  }

  const total_hospital = (hospital as { data: any[] })?.data?.length || 0;
  const total_lawyers = (lawyers as { data: any[] })?.data?.length || 0;
  const total_users = (users as { data: any[] })?.data?.length || 0;
  const total_ambulances = (ambulances as { data: any[] })?.data?.length || 0;

  const stats = [
    {
      label: "মোট হাসপাতাল",
      value: total_hospital,
      change: "+2 এই মাসে",
      icon: "🏥",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      text: "text-blue-600",
      trend: "text-blue-500",
    },
    {
      label: "মোট আইনজীবী",
      value: total_lawyers,
      change: "+5 এই মাসে",
      icon: "⚖️",
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      text: "text-amber-600",
      trend: "text-amber-500",
    },
    {
      label: "অ্যাম্বুলেন্স",
      value: total_ambulances,
      change: "+1 এই মাসে",
      icon: "🚑",
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      text: "text-red-500",
      trend: "text-red-400",
    },
    {
      label: "গুণীজন",
      value: "89",
      change: "+3 এই মাসে",
      icon: "🌟",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      text: "text-purple-600",
      trend: "text-purple-500",
    },
    {
      label: "মোট ব্যবহারকারী",
      value: total_users,
      change: "+18 এই মাসে",
      icon: "👥",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      text: "text-green-600",
      trend: "text-green-500",
    },
    {
      label: "সংবাদ",
      value: "56",
      change: "+7 এই মাসে",
      icon: "📰",
      bg: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      text: "text-cyan-600",
      trend: "text-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <motion.div
        className="max-w-7xl mx-auto space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Welcome Banner */}
        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-6 sm:p-8"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 right-24 w-40 h-40 bg-white/5 rounded-full translate-y-20" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">
                স্বাগতম 👋
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                My Barisal Admin Panel
              </h1>
              <p className="text-blue-200 text-sm mt-1.5">
                বরিশালের সকল সেবা পরিচালনা করুন এক জায়গা থেকে
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                to="/dashboard/hospitals/add"
                className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors no-underline"
              >
                <FiPlus size={16} />
                নতুন যোগ করুন
              </Link>
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-2 bg-white/10 text-white border border-white/20 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors no-underline"
              >
                <FiEye size={16} />
                অ্যাপ দেখুন
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`${stat.bg} rounded-2xl p-4 cursor-pointer`}
            >
              <div
                className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center text-xl mb-3`}
              >
                {stat.icon}
              </div>
              <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                {stat.label}
              </p>
              <p className={`text-[11px] mt-1 font-medium ${stat.trend}`}>
                <FiTrendingUp className="inline mr-0.5" size={10} />
                {stat.change}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <motion.div
            variants={item}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">
                দ্রুত কাজ করুন
              </h2>
              <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                {quickActions.length} টি অপশন
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <motion.div
                  key={action.label}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to={action.to}
                    className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl transition-colors no-underline ${action.color}`}
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-[11px] font-semibold text-center leading-tight">
                      {action.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={item}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">
                সাম্প্রতিক কার্যক্রম
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-lg font-medium">
                <FiActivity size={11} />
                লাইভ
              </div>
            </div>
            <div className="space-y-2">
              {recentActivities.map((activity, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${activity.dot}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-800 truncate">
                      {activity.label}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {activity.sub}
                    </p>
                  </div>
                  <span className="text-[11px] text-gray-400 flex-shrink-0">
                    {activity.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Module Overview */}
        <motion.div
          variants={item}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900">মডিউল ওভারভিউ</h2>
            <span className="text-xs text-gray-400">সর্বশেষ আপডেট: আজ</span>
          </div>
          <div className="space-y-3">
            {[
              {
                label: "হাসপাতাল",
                value: 12,
                max: 20,
                color: "bg-blue-500",
                icon: "🏥",
              },
              {
                label: "আইনজীবী",
                value: 45,
                max: 60,
                color: "bg-amber-500",
                icon: "⚖️",
              },
              {
                label: "অ্যাম্বুলেন্স",
                value: 8,
                max: 15,
                color: "bg-red-500",
                icon: "🚑",
              },
              {
                label: "গুণীজন",
                value: 89,
                max: 100,
                color: "bg-purple-500",
                icon: "🌟",
              },
            ].map((mod) => (
              <div key={mod.label} className="flex items-center gap-4">
                <span className="text-lg w-7 flex-shrink-0">{mod.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-[13px] font-medium text-gray-700">
                      {mod.label}
                    </span>
                    <span className="text-[12px] text-gray-400">
                      {mod.value}/{mod.max}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${mod.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(mod.value / mod.max) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminHome;
