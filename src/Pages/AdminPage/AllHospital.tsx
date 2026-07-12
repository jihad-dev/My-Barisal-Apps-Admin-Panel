import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useDeleteHospitalMutation,
  useGetAllHospitalsQuery,
} from "../../Redux/features/admin/adminApi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

interface Hospital {
  _id: string;
  name: string;
  address: string;
  thana?: string;
  area: string;
  phone: string[];
  type: "government" | "private" | "clinic" | "diagnostic";
  isDeleted: boolean;
  createdAt?: string;
}

const typeMap = {
  government: {
    label: "সরকারি",
    color: "text-cyan-600",
    bg: "bg-cyan-50/80 backdrop-blur-sm",
    border: "border-cyan-100",
    badge:
      "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border-cyan-200/60 shadow-sm",
    bar: "from-cyan-400 via-blue-400 to-blue-500",
    icon: "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-100",
    dot: "bg-cyan-400",
  },
  private: {
    label: "বেসরকারি",
    color: "text-amber-600",
    bg: "bg-amber-50/80 backdrop-blur-sm",
    border: "border-amber-100",
    badge:
      "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200/60 shadow-sm",
    bar: "from-amber-400 via-orange-400 to-orange-500",
    icon: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-100",
    dot: "bg-amber-400",
  },
  clinic: {
    label: "ক্লিনিক",
    color: "text-violet-600",
    bg: "bg-violet-50/80 backdrop-blur-sm",
    border: "border-violet-100",
    badge:
      "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border-violet-200/60 shadow-sm",
    bar: "from-violet-400 via-purple-400 to-purple-500",
    icon: "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-100",
    dot: "bg-violet-400",
  },
  diagnostic: {
    label: "ডায়াগনস্টিক",
    color: "text-emerald-600",
    bg: "bg-emerald-50/80 backdrop-blur-sm",
    border: "border-emerald-100",
    badge:
      "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200/60 shadow-sm",
    bar: "from-emerald-400 via-teal-400 to-teal-500",
    icon: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-100",
    dot: "bg-emerald-400",
  },
} as const;

type HospitalTypeKey = keyof typeof typeMap;

const FILTERS = [
  { key: "all", label: "সব হাসপাতাল" },
  { key: "government", label: "সরকারি" },
  { key: "private", label: "বেসরকারি" },
  { key: "clinic", label: "ক্লিনিক" },
  { key: "diagnostic", label: "ডায়াগনস্টিক" },
];

const thanaNameMap: Record<string, string> = {
  "barisal sadar": "বরিশাল সদর",
  bakerganj: "বাকেরগঞ্জ",
  wazirpur: "উজিরপুর",
  babuganj: "বাবুগঞ্জ",
  banaripara: "বানারীপাড়া",
  gournadi: "গৌরনদী",
  agailjhara: "আগৈলঝারা",
  mehendiganj: "মেহেন্দিগঞ্জ",
  muladi: "মুলাদী",
  hizla: "হিজলা",
};

const STATIC_THANAS = [
  { key: "all", label: "সকল থানা" },
  ...Object.entries(thanaNameMap).map(([key, label]) => ({ key, label })),
];

/* ── Icons ── */
const IcoHosp = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <line x1="12" y1="5" x2="12" y2="9" />
    <line x1="10" y1="7" x2="14" y2="7" />
  </svg>
);
const IcoPin = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IcoPhone = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 13.5 19.79 19.79 0 0 1 1.72 4.9 2 2 0 0 1 3.7 2.7h3a2 2 0 0 1 2 1.72 12.77 12.77 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l1.47-1.47a2 2 0 0 1 2.11-.45 12.77 12.77 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IcoSearch = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IcoPlus = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* ── Motion Layout Settings ── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const HeaderVariants = {
  hidden: { opacity: 0, y: -15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const AllHospitals = () => {
  const { data, error, isLoading, isFetching } =
    useGetAllHospitalsQuery(undefined);
  const [deleteHospital] = useDeleteHospitalMutation();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedThana, setSelectedThana] = useState("all");

  const handleDelete = (id: string, hospitalName: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `"${hospitalName}" হাসপাতালটি ডিলিট করা হবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "হ্যাঁ, মুছুন!",
      cancelButtonText: "না, থাক",
      background: "#ffffff",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl font-bold px-4 py-2",
        cancelButton: "rounded-xl font-bold px-4 py-2",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteHospital(id).unwrap();
          if (res?.success || res) {
            Swal.fire({
              title: "ডিলিট হয়েছে!",
              text: "হাসপাতালটি সফলভাবে মুছে ফেলা হয়েছে।",
              icon: "success",
              confirmButtonColor: "#06b6d4",
              customClass: { popup: "rounded-2xl" },
            });
          }
        } catch (err: any) {
          Swal.fire({
            title: "ব্যর্থ হয়েছে!",
            text:
              err?.data?.message ||
              "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।",
            icon: "error",
            confirmButtonColor: "#ef4444",
            customClass: { popup: "rounded-2xl" },
          });
        }
      }
    });
  };

  const allHospitals = useMemo(() => {
    const rawData = data?.data?.data ? data.data.data : (data?.data ?? []);
    return rawData.filter((h: Hospital) => !h.isDeleted);
  }, [data]);

  const handleFilterChange = (filterKey: string) => {
    setFilter(filterKey);
    if (filterKey === "all") {
      setSelectedThana("all");
      if (search) {
        setSearch("");
      }
    }
  };

  const filteredHospitals = useMemo(() => {
    return allHospitals.filter((h: Hospital) => {
      const okType = filter === "all" || h.type === filter;
      const okThana =
        selectedThana === "all" ||
        h.thana?.trim().toLowerCase() === selectedThana;

      const cleanSearch = search.toLowerCase().trim();
      const okSearch =
        !cleanSearch ||
        [h.name, h.area, h.address].some((field) =>
          field?.toLowerCase().includes(cleanSearch),
        );

      return okType && okThana && okSearch;
    });
  }, [allHospitals, filter, selectedThana, search]);

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-8 selection:bg-cyan-500 selection:text-white">
      {/* ── Top Header and Filter Hub ── */}
      <motion.div
        variants={HeaderVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 mb-8 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Brand/Title */}
          <div className="flex items-center gap-3.5">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -3 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-200 cursor-pointer"
            >
              <IcoHosp />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                হাসপাতাল ড্যাশবোর্ড
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                স্বাস্থ্যসেবা ব্যবস্থাপনা প্যানেল
              </p>
            </div>
          </div>

          {/* Search and Right Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <AnimatePresence>
              {isFetching && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-xs text-cyan-600 bg-cyan-50/80 border border-cyan-100 px-3 py-1.5 rounded-xl font-medium"
                >
                  ⚡ ডাটা রিফ্রেশ হচ্ছে...
                </motion.span>
              )}
            </AnimatePresence>

            {/* Static Thana Selector */}
            <div className="relative group w-full sm:w-auto">
              <select
                value={selectedThana}
                onChange={(e) => setSelectedThana(e.target.value)}
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-sm text-slate-700 font-semibold outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50 transition-all duration-200 cursor-pointer appearance-none"
              >
                {STATIC_THANAS.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Search Field */}
            <div className="relative flex items-center w-full sm:w-64 group">
              <span className="absolute left-3.5 text-slate-400 group-focus-within:text-cyan-500 transition-colors pointer-events-none">
                <IcoSearch />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="নাম, এলাকা বা ঠিকানা খুঁজুন..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-50 transition-all duration-300 shadow-inner"
              />
            </div>

            <motion.div
              key={filteredHospitals.length}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="hidden sm:flex text-sm font-bold text-cyan-600 bg-cyan-50 border border-cyan-100 px-3.5 py-2 rounded-xl font-mono items-center shadow-sm"
            >
              মোট: {filteredHospitals.length}টি
            </motion.div>

            <Link to="/dashboard/hospitals/add" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-cyan-200 transition-all cursor-pointer"
              >
                <IcoPlus />
                <span>নতুন হাসপাতাল</span>
              </motion.button>
            </Link>
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100/70 rounded-xl max-w-max">
          {FILTERS.map((f) => {
            const isActive = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className="relative px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer select-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterBg"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 ${isActive ? "text-cyan-600" : "text-slate-500 hover:text-slate-800"}`}
                >
                  {f.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Main View (Cards/Loading) ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 animate-pulse shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                <div className="w-16 h-5 bg-slate-100 rounded-full" />
              </div>
              <div className="h-5 bg-slate-100 rounded-md w-5/6" />
              <div className="space-y-2 pt-2">
                <div className="h-3.5 bg-slate-100 rounded w-full" />
                <div className="h-3.5 bg-slate-100 rounded w-2/3" />
              </div>
              <div className="h-px bg-slate-50 pt-2" />
              <div className="flex justify-between items-center pt-2">
                <div className="w-14 h-4 bg-slate-50 rounded" />
                <div className="flex gap-2">
                  <div className="w-14 h-8 bg-slate-100 rounded-lg" />
                  <div className="w-12 h-8 bg-slate-100 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-20 text-center text-red-500 bg-white rounded-2xl border border-dashed border-red-200 shadow-sm font-semibold max-w-md mx-auto">
          ⚠️ ডাটাবেজ কানেকশনে সমস্যা হয়েছে। আবার চেষ্টা করুন।
        </div>
      ) : (
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredHospitals.length === 0 ? (
              <motion.div
                key="empty"
                variants={cardVariants}
                className="col-span-full py-28 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm font-medium"
              >
                এই ক্যাটাগরিতে কোনো হাসপাতাল পাওয়া যায়নি।
              </motion.div>
            ) : (
              filteredHospitals.map((h: Hospital) => {
                const hospitalType = h.type as HospitalTypeKey;
                const t = typeMap[hospitalType] ?? typeMap.government;

                const normalizedThana = h.thana?.trim().toLowerCase() || "";
                const displayThana = thanaNameMap[normalizedThana] || h.thana;

                return (
                  <motion.div
                    key={h._id}
                    layout
                    variants={cardVariants}
                    whileHover={{
                      y: -6,
                      scale: 1.01,
                      boxShadow:
                        "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)",
                    }}
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm group flex flex-col justify-between cursor-pointer transition-all duration-300"
                  >
                    <div>
                      <div className={`h-[4px] bg-gradient-to-r ${t.bar}`} />
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-9 h-9 rounded-xl ${t.icon} flex items-center justify-center shrink-0`}
                          >
                            <IcoHosp />
                          </div>
                          <span
                            className={`text-[11px] font-bold px-3 py-1 rounded-full border ${t.badge}`}
                          >
                            {t.label}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-800 leading-snug mb-3.5 group-hover:text-cyan-600 transition-colors duration-200">
                          {h.name}
                        </h3>

                        <div className="space-y-2.5">
                          <div className="flex items-start gap-2.5 text-xs text-slate-500 leading-relaxed">
                            <span className={`mt-0.5 shrink-0 ${t.color}`}>
                              <IcoPin />
                            </span>
                            <span>
                              <strong className="text-slate-700 font-semibold">
                                {displayThana && `${displayThana} — `}
                              </strong>
                              {h.area}, {h.address}
                            </span>
                          </div>

                          {h.phone?.filter(Boolean).map((p, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2.5 text-xs text-slate-500"
                            >
                              <span className={`shrink-0 ${t.color}`}>
                                <IcoPhone />
                              </span>
                              <span className="font-mono tracking-wide font-medium bg-slate-50 border border-slate-100/80 px-2 py-0.5 rounded-md text-slate-600">
                                {p}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="h-px bg-slate-100 mb-4" />
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-semibold font-mono bg-slate-50 px-2 py-1 rounded-md">
                          📆{" "}
                          {h.createdAt
                            ? new Date(h.createdAt).toLocaleDateString("bn-BD")
                            : "N/A"}
                        </span>
                        <div className="flex gap-2">
                          <Link to={`#`}>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-cyan-50 text-slate-600 hover:text-cyan-600 border border-slate-200 hover:border-cyan-100 transition-all cursor-pointer"
                            >
                              সম্পাদনা
                            </motion.button>
                          </Link>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(h._id, h.name)}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-500 border border-slate-200 hover:border-red-100 transition-all cursor-pointer"
                          >
                            মুছুন
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default AllHospitals;
