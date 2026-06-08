import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllHospitalsQuery } from "../../Redux/features/admin/adminApi";
import Loader from "../../utils/Loader";

interface Hospital {
  _id: string;
  name: string;
  address: string;
  area: string;
  phone: string[];
  type: "government" | "private" | "clinic";
  isDeleted: boolean;
  createdAt?: string;
}

const typeMap = {
  government: {
    label: "সরকারি",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    badge: "bg-cyan-100 text-cyan-700 border-cyan-200",
    bar: "from-cyan-400 to-blue-500",
    icon: "bg-cyan-50 text-cyan-600",
    dot: "bg-cyan-400",
  },
  private: {
    label: "বেসরকারি",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    bar: "from-amber-400 to-orange-500",
    icon: "bg-amber-50 text-amber-600",
    dot: "bg-amber-400",
  },
  clinic: {
    label: "ক্লিনিক",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    bar: "from-violet-400 to-purple-500",
    icon: "bg-violet-50 text-violet-600",
    dot: "bg-violet-400",
  },
} as const;

const FILTERS = [
  { key: "all", label: "সব" },
  { key: "government", label: "সরকারি" },
  { key: "private", label: "বেসরকারি" },
  { key: "clinic", label: "ক্লিনিক" },
];

/* ── icons ── */
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

/* ── variants ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const cardV = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};
const headV = {
  hidden: { opacity: 0, y: -12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

/* ── component ── */
const AllHospitals = () => {
  const { data, error, isLoading, isFetching } = useGetAllHospitalsQuery({});


  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  if (isLoading) return <Loader />;
  const all: Hospital[] = (data?.data ?? []).filter(
    (h: Hospital) => !h.isDeleted,
  );

  const filtered = all.filter((h) => {
    const okType = filter === "all" || h.type === filter;
    const okSearch = [h.name, h.area, h.address].some((s) =>
      s.includes(search),
    );
    return okType && okSearch;
  });

  return (
    <div className="min-h-full bg-gray-50 p-5 md:p-7">
      {/* ── Header ── */}
      <motion.div
        variants={headV}
        initial="hidden"
        animate="show"
        className="flex flex-wrap items-center justify-between gap-3 mb-6"
      >
        {/* Title */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-200 shrink-0"
          >
            <IcoHosp />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 leading-tight">
              সকল হাসপাতাল
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              বরিশাল স্বাস্থ্য বিভাগ
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Refreshing */}
          <AnimatePresence>
            {isFetching && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-xs text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full font-mono"
              >
                ↻ আপডেট
              </motion.span>
            )}
          </AnimatePresence>

          {/* Search */}
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              <IcoSearch />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="খুঁজুন..."
              className="bg-white border border-gray-200 rounded-full py-2 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all duration-200 w-40 focus:w-52 shadow-sm"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {FILTERS.map((f) => (
              <motion.button
                key={f.key}
                whileTap={{ scale: 0.93 }}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  filter === f.key
                    ? "bg-cyan-500 text-white shadow"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </motion.button>
            ))}
          </div>

          {/* Count */}
          <motion.span
            key={filtered.length}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-sm font-bold font-mono text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full"
          >
            {filtered.length}টি
          </motion.span>

          {/* Add button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md shadow-cyan-200 hover:shadow-lg hover:shadow-cyan-200 transition-shadow"
          >
            <IcoPlus />
            <span className="hidden sm:inline">নতুন</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Loading ── */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 py-24 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400 text-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.75, ease: "linear" }}
            className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-cyan-500"
          />
          লোড হচ্ছে...
        </div>
      ) : /* ── Error ── */
      error ? (
        <div className="py-24 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
          ⚠️ ডেটা লোড করতে সমস্যা হয়েছে।
        </div>
      ) : (
        /* ── Grid ── */
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                variants={cardV}
                className="col-span-full py-24 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm"
              >
                কোনো হাসপাতাল পাওয়া যায়নি।
              </motion.div>
            ) : (
              filtered.map((h) => {
                const t = typeMap[h.type] ?? typeMap.government;
                return (
                  <motion.div
                    key={h._id}
                    layout
                    variants={cardV}
                    whileHover={{
                      y: -4,
                      boxShadow: "0 16px 32px rgba(0,0,0,0.10)",
                    }}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
                  >
                    {/* accent bar */}
                    <div className={`h-[3px] bg-gradient-to-r ${t.bar}`} />

                    <div className="p-4">
                      {/* top */}
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl ${t.icon} flex items-center justify-center shrink-0`}
                        >
                          <IcoHosp />
                        </div>
                        <span
                          className={`text-[11px] font-semibold font-mono px-2.5 py-0.5 rounded-full border ${t.badge}`}
                        >
                          {t.label}
                        </span>
                      </div>

                      {/* name */}
                      <p className="text-sm font-bold text-gray-800 leading-snug mb-3 group-hover:text-cyan-700 transition-colors">
                        {h.name}
                      </p>

                      {/* meta */}
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 text-xs text-gray-500">
                          <span className={`mt-0.5 shrink-0 ${t.color}`}>
                            <IcoPin />
                          </span>
                          <span>
                            {h.area} — {h.address}
                          </span>
                        </div>
                        {h.phone?.map((p, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs text-gray-500"
                          >
                            <span className={`shrink-0 ${t.color}`}>
                              <IcoPhone />
                            </span>
                            <span className="font-mono">{p}</span>
                          </div>
                        ))}
                      </div>

                      {/* divider */}
                      <div className="h-px bg-gray-100 my-3" />

                      {/* footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(h.createdAt ?? "").toLocaleDateString(
                            "bn-BD",
                          )}
                        </span>
                        <div className="flex gap-1.5">
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            className="text-xs font-semibold px-3 py-1 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-200 hover:bg-cyan-100 transition-colors"
                          >
                            সম্পাদনা
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            className="text-xs font-semibold px-3 py-1 rounded-lg bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors"
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
