
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEye,
  FiTrendingUp,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import {

  useGetAllAmbulanceQuery,
  useGetAllBanksQuery,
  useGetAllCarsQuery,
  useGetAllDoctorsQuery,
   useGetAllDonorsQuery,
  useGetAllHospitalsQuery,
  useGetAllImamMuzzainQuery,
  useGetAllInstitutionsQuery,
  useGetAllLawyersQuery,
  useGetAllPoliceQuery,
  useGetAllUsersQuery,
} from "../../Redux/features/admin/adminApi";
import { useAppSelector } from "../../Redux/hooks";

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Static Configurations
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
    to: "/dashboard/add-ambulance",
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
    to: "/dashboard/add-doctor",
    color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700",
  },
  {
    label: "পুলিশ স্টেশন পরিচালনা",
    icon: "🚓",
    to: "/dashboard/all-police",
    color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700",
  },
  {
    label: "ফায়ার সার্ভিস",
    icon: "🚒",
    to: "/dashboard/all-fire-station",
    color: "bg-orange-50 hover:bg-orange-100 text-orange-700",
  },
  {
    label: "ইмам ও খতিব",
    icon: "🕌",
    to: "/dashboard/all-imam-muazzin",
    color: "bg-teal-50 hover:bg-teal-100 text-teal-700",
  },
  {
    label: "গাড়ি/রেন্ট-এ-কার",
    icon: "🚗",
    to: "/dashboard/all-cars",
    color: "bg-slate-50 hover:bg-slate-100 text-slate-700",
  },
  {
    label: "রক্তের গ্রুপ/দাতা",
    icon: "🩸",
    to: "/dashboard/all-donors",
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

// Reusable Skeleton Components for a seamless layout shift
const StatsSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 animate-pulse">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="bg-gray-200/70 rounded-2xl p-4 h-[124px] flex flex-col justify-between"
      />
    ))}
  </div>
);

const AdminHome = () => {
  const user = useAppSelector((state) => state.auth.user);

  // API Queries Execution
  const {
    data: hospital,
    isLoading: isHospitalsLoading,
    isError: isHospitalsError,
    refetch: refetchHospitals,
  } = useGetAllHospitalsQuery(undefined);
  const {
    data: lawyers,
    isLoading: isLawyersLoading,
    isError: isLawyersError,
  } = useGetAllLawyersQuery(undefined);
  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetAllUsersQuery(undefined);
  const {
    data: ambulances,
    isLoading: isAmbulancesLoading,
    isError: isAmbulancesError,
  } = useGetAllAmbulanceQuery(undefined);
  const {
    data: doctors,
    isLoading: isDoctorsLoading,
    isError: isDoctorsError,
  } = useGetAllDoctorsQuery(undefined);
  const {
    data: imamMuzzain,
    isLoading: isImamLoading,
    isError: isImamError,
  } = useGetAllImamMuzzainQuery(undefined);
  const {
    data: bloodDonors,
    isLoading: isBloodLoading,
    isError: isBloodError,
  } = useGetAllDonorsQuery(undefined);
  const {
    data: banks,
    isLoading: isBanksLoading,
    isError: isBanksError,
  } = useGetAllBanksQuery(undefined);
  const {
    data: institutes,
    isLoading: isInstitutesLoading,
    isError: isInstitutesError,
  } = useGetAllInstitutionsQuery(undefined);
  const {
    data: policeStations,
    isLoading: isPoliceLoading,
    isError: isPoliceError,
  } = useGetAllPoliceQuery(undefined);
  const {
    data: vehicles,
    isLoading: isVehiclesLoading,
    isError: isVehiclesError,
  } = useGetAllCarsQuery(undefined);

  // Global Check States
  const anyLoading =
    isHospitalsLoading ||
    isLawyersLoading ||
    isUsersLoading ||
    isAmbulancesLoading ||
    isDoctorsLoading ||
    isImamLoading ||
    isBloodLoading ||
    isBanksLoading ||
    isInstitutesLoading ||
    isPoliceLoading ||
    isVehiclesLoading;
  const anyError =
    isHospitalsError ||
    isLawyersError ||
    isUsersError ||
    isAmbulancesError ||
    isDoctorsError ||
    isImamError ||
    isBloodError ||
    isBanksError ||
    isInstitutesError ||
    isPoliceError ||
    isVehiclesError;

  // Safe Data Transformations (Prevents crashing if `.data` or array structure varies)
  const extractLength = (res: any) =>
    Array.isArray(res?.data)
      ? res.data.length
      : Array.isArray(res)
        ? res.length
        : 0;

  const total_hospital = extractLength(hospital);
  const total_lawyers = extractLength(lawyers);
  const total_users = extractLength(users);
  const total_ambulances = extractLength(ambulances);
  const total_doctors = extractLength(doctors);
  const total_imam = extractLength(imamMuzzain);
  const total_blood = extractLength(bloodDonors);
  const total_bank = extractLength(banks);
  const total_institute = extractLength(institutes);
  const total_police = extractLength(policeStations);
  const total_car = extractLength(vehicles);

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
      label: "মোট নিবন্ধিত ডাক্তার",
      value: total_doctors,
      change: "+2 এই মাসে",
      icon: "🩺",
      bg: "bg-rose-50",
      iconBg: "bg-rose-100",
      text: "text-rose-600",
      trend: "text-rose-500",
    },
    {
      label: "ইমাম ও মুয়াজ্জিন",
      value: total_imam,
      change: "+4 এই মাসে",
      icon: "🕌",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      text: "text-emerald-600",
      trend: "text-emerald-500",
    },
    {
      label: "রক্তের ডোনার",
      value: total_blood,
      change: "+12 এই মাসে",
      icon: "🩸",
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      text: "text-red-600",
      trend: "text-red-500",
    },
    {
      label: "ব্যাংক ও আর্থিক সেবা",
      value: total_bank,
      change: "+1 এই মাসে",
      icon: "🏦",
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      text: "text-indigo-600",
      trend: "text-indigo-500",
    },
    {
      label: "শিক্ষা প্রতিষ্ঠান",
      value: total_institute,
      change: "+3 এই মাসে",
      icon: "🏫",
      bg: "bg-violet-50",
      iconBg: "bg-violet-100",
      text: "text-violet-600",
      trend: "text-violet-500",
    },
    {
      label: "থানা ও পুলিশ প্রশাসন",
      value: total_police,
      change: "+0 এই মাসে",
      icon: "👮",
      bg: "bg-sky-50",
      iconBg: "bg-sky-100",
      text: "text-sky-600",
      trend: "text-sky-500",
    },
    {
      label: "গাড়ি ও পরিবহন",
      value: total_car,
      change: "+5 এই মাসে",
      icon: "🚘",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      text: "text-orange-600",
      trend: "text-orange-500",
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
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <motion.div
        className="max-w-7xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* 🚨 Network/API Global Error Banner */}
        {anyError && (
          <motion.div
            variants={itemVariants}
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <FiAlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-sm font-medium">
                কিছু মডিউলের ডেটা লোড করার সময় নেটওয়ার্ক বা সার্ভার সমস্যা
                হয়েছে। প্রদর্শিত ডেটা অসম্পূর্ণ হতে পারে।
              </p>
            </div>
            <button
              onClick={() => refetchHospitals()}
              className="flex items-center gap-1.5 self-start sm:self-auto bg-white border border-red-200 hover:bg-red-100 text-red-700 font-semibold text-xs px-3 py-1.5 rounded-xl transition"
            >
              <FiRefreshCw size={12} /> পুনরায় চেষ্টা করুন
            </button>
          </motion.div>
        )}

        {/* Welcome Banner */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 border border-white/10 shadow-2xl shadow-blue-950/20"
        >
          <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full blur-[80px] opacity-40 animate-pulse" />
          <div className="absolute bottom-[-30%] right-[20%] w-56 h-56 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-full blur-[60px] opacity-30" />
          <div className="absolute top-[20%] left-[-5%] w-32 h-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-[50px] opacity-20" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-cyan-300 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                {user?.role || "Super Admin"} Panel
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mt-1">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
                    My Barisal Apps
                  </span>{" "}
                  Admin Panel
                </h1>
                <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl mt-1">
                  <span className="text-white font-bold">My Barisal</span>{" "}
                  অ্যাপ্লিকেশনের সকল জরুরি সেবা ও ডাটাবেজ মডিউলসমূহ পরিচালনা
                  করুন।
                </p>
              </div>
              {user?.email && (
                <div className="text-xs font-mono bg-black/20 inline-block px-2.5 py-1 rounded-md border border-white/5 text-red-400">
                  Logged in as: {user.email}
                </div>
              )}
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 flex-shrink-0">
              <Link
                to="/dashboard/hospitals/add"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-2xl text-sm font-bold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 no-underline border border-blue-400/20 w-full sm:w-auto"
              >
                <FiPlus size={18} className="stroke-[3]" /> নতুন ডেটা যোগ করুন
              </Link>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 backdrop-blur-md px-5 py-3 rounded-2xl text-sm font-bold hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 no-underline w-full sm:w-auto"
              >
                <FiEye size={18} className="text-cyan-400" /> লাইভ অ্যাপ দেখুন
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Section with Localized Skeleton Fallback */}
        {anyLoading ? (
          <StatsSkeleton />
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`${stat.bg} rounded-2xl p-4 cursor-pointer`}
              >
                <div
                  className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center text-xl mb-3`}
                >
                  {stat.icon}
                </div>
                <p className={`text-2xl font-bold ${stat.text}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">
                  {stat.label}
                </p>
                <p className={`text-[11px] mt-1 font-medium ${stat.trend}`}>
                  <FiTrendingUp className="inline mr-0.5" size={10} />{" "}
                  {stat.change}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Quick Actions + Recent Activity Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions Panel */}
          <motion.div
            variants={itemVariants}
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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

          {/* Recent Activity Panel */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">
                সাম্প্রতিক কার্যক্রম
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-lg font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
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

        {/* Dynamic Module Overview (Linked up with live endpoint counts dynamically) */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900">মডিউল ওভারভিউ</h2>
            <span className="text-xs text-gray-400">লাইভ ট্র্যাকিং</span>
          </div>
          <div className="space-y-4">
            {[
              {
                label: "হাসপাতাল",
                value: total_hospital,
                max: Math.max(total_hospital + 5, 20),
                color: "bg-blue-500",
                icon: "🏥",
              },
              {
                label: "আইনজীবী",
                value: total_lawyers,
                max: Math.max(total_lawyers + 15, 60),
                color: "bg-amber-500",
                icon: "⚖️",
              },
              {
                label: "অ্যাম্বুলেন্স",
                value: total_ambulances,
                max: Math.max(total_ambulances + 5, 15),
                color: "bg-red-500",
                icon: "🚑",
              },
              {
                label: "নিবন্ধিত ডাক্তার",
                value: total_doctors,
                max: Math.max(total_doctors + 20, 100),
                color: "bg-rose-500",
                icon: "🩺",
              },
            ].map((mod) => {
              const percentages = ((mod.value / mod.max) * 100).toFixed(0);
              return (
                <div key={mod.label} className="flex items-center gap-4">
                  <span className="text-lg w-7 flex-shrink-0">{mod.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-[13px] font-medium text-gray-700">
                        {mod.label}
                      </span>
                      <span className="text-[12px] text-gray-400 font-mono">
                        {mod.value} / {mod.max}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${mod.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentages}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminHome;
