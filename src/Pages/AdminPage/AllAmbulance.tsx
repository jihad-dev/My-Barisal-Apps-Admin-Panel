import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllAmbulanceQuery } from "../../Redux/features/admin/adminApi";
import Loader from "../../utils/Loader";

export type THospitalType = "government" | "private" | "clinic" | "diagnostic";

export interface IHospital {
  _id?: string;
  name: string;
  type: THospitalType;
  address: string;
  area: string;
  phone: string[];
  isDeleted: boolean;
}

/* ── type styles ── */
const typeMap = {
  government: {
    label: "সরকারি",
    color: "from-cyan-500 to-blue-500",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  private: {
    label: "বেসরকারি",
    color: "from-amber-400 to-orange-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  clinic: {
    label: "ক্লিনিক",
    color: "from-purple-500 to-pink-500",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  diagnostic: {
    label: "ডায়াগনস্টিক",
    color: "from-green-400 to-emerald-500",
    badge: "bg-green-50 text-green-700 border-green-200",
  },
} as const;

/* ── filters ── */
const FILTERS = [
  { key: "all", label: "সব" },
  { key: "government", label: "সরকারি" },
  { key: "private", label: "বেসরকারি" },
  { key: "clinic", label: "ক্লিনিক" },
  { key: "diagnostic", label: "ডায়াগনস্টিক" },
];

/* ── animation ── */
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const card = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

const AllAmbulances = () => {
  const { data, isLoading, error } = useGetAllAmbulanceQuery({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const hospitals: IHospital[] = (data?.data ?? []).filter(
    (h: IHospital) => !h.isDeleted,
  );

  const filtered = hospitals.filter((h) => {
    const okType = filter === "all" || h.type === filter;

    const okSearch = [h.name, h.area, h.address, ...(h.phone ?? [])]
      .filter(Boolean)
      .some((s) => s.toLowerCase().includes(search.toLowerCase()));

    return okType && okSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            🏥 এম্বুল্যান্স  তালিকা
          </h2>
          <p className="text-sm text-gray-400">Total: {filtered.length}</p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Ambulance..."
            className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-red-200 outline-none w-40 md:w-56 transition-all"
          />

          {/* FILTER */}
          <div className="flex gap-1 bg-white border rounded-xl p-1 shadow-sm">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filter === f.key
                    ? "bg-red-500 text-white shadow"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STATES */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-center py-20 text-red-500">Error loading data</p>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence>
            {filtered.length === 0 ? (
              <p className="col-span-full text-center text-gray-400 py-20">
                No hospitals found
              </p>
            ) : (
              filtered.map((h) => {
                const t = typeMap[h.type];

                return (
                  <motion.div
                    key={h._id}
                    variants={card}
                    whileHover={{
                      y: -6,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm cursor-pointer group"
                  >
                    {/* TOP BAR */}
                    <div className={`h-1 bg-gradient-to-r ${t.color}`} />

                    <div className="p-4">
                      {/* TITLE */}
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-500 transition">
                        {h.name}
                      </h3>

                      {/* BADGE */}
                      <span
                        className={`inline-block mt-1 text-xs px-2 py-1 rounded border ${t.badge}`}
                      >
                        {t.label}
                      </span>

                      {/* INFO */}
                      <div className="mt-3 space-y-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          📍 <span>{h.area}</span>
                        </p>

                        <p className="flex items-start gap-2">
                          🏠 <span>{h.address}</span>
                        </p>

                        {h.phone?.map((p, i) => (
                          <p
                            key={i}
                            className="flex items-center gap-2 font-mono"
                          >
                            📞 {p}
                          </p>
                        ))}
                      </div>

                      {/* FOOTER */}
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs text-gray-400">{h.type}</span>

                        <div className="flex gap-2">
                          <button className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg border hover:bg-blue-100">
                            Edit
                          </button>
                          <button className="text-xs px-3 py-1 bg-red-50 text-red-500 rounded-lg border hover:bg-red-100">
                            Delete
                          </button>
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

export default AllAmbulances;
