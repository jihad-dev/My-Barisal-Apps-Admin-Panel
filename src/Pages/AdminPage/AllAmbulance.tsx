
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllAmbulanceQuery } from "../../Redux/features/admin/adminApi";
import Loader from "../../utils/Loader";

export type TAmbulanceType = "government" | "private" | "volunteer";

export interface IAmbulance {
  _id?: string;
  name: string;
  type: TAmbulanceType;
  thana: string;
  address: string;
  area: string;
  phone: string[];
  isDeleted: boolean;
}

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
  volunteer: {
    label: "স্বেচ্ছাসেবী",
    color: "from-purple-500 to-pink-500",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
} as const;

const FILTERS = [
  { key: "all", label: "সব" },
  { key: "government", label: "সরকারি" },
  { key: "private", label: "বেসরকারি" },
  { key: "volunteer", label: "স্বেচ্ছাসেবী" },
];

const THANAS = [
  { key: "all", label: "সকল থানা" },
  { key: "barisal sadar", label: "বরিশাল সদর" },
  { key: "bakerganj", label: "বাকেরগঞ্জ" },
  { key: "wazirpur", label: "উজিরপুর" },
  { key: "babuganj", label: "বাবুগঞ্জ" },
  { key: "banaripara", label: "বানারীপাড়া" },
  { key: "gournadi", label: "গৌরনদী" },
  { key: "agailjhara", label: "আগৈলঝারা" },
  { key: "mehendiganj", label: "মেহেন্দিগঞ্জ" },
  { key: "muladi", label: "মুলাদী" },
  { key: "hizla", label: "হিজলা" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const card = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

const AllAmbulances = () => {
  const { data, isLoading, error } = useGetAllAmbulanceQuery(undefined);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedThana, setSelectedThana] = useState("all");

  // ── প্যাগিনেশন স্টেট ──
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // প্রতি পেজে ১২টি ডাটা

  const ambulances: IAmbulance[] = (data?.data ?? []).filter(
    (amb: IAmbulance) => !amb.isDeleted,
  );

  // ফিল্টারিং লজিক
  const filtered = ambulances.filter((amb) => {
    const okType = filter === "all" || amb.type === filter;
    const okThana =
      selectedThana === "all" ||
      amb.thana?.trim().toLowerCase() === selectedThana.toLowerCase();

    const okSearch = [
      amb.name,
      amb.area,
      amb.thana,
      amb.address,
      ...(amb.phone ?? []),
    ]
      .filter(Boolean)
      .some((s) => s.toLowerCase().includes(search.toLowerCase()));

    return okType && okThana && okSearch;
  });

  // ── প্যাগিনেশন ক্যালকুলেশন ──
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedAmbulances = filtered.slice(startIndex, endIndex);

  // স্টেট চেঞ্জ হলে পেজ ১ নম্বরে রিসেট করার ফাংশন
  const handleFilterChange = (type: string) => {
    setFilter(type);
    setCurrentPage(1);
  };

  const handleThanaChange = (thana: string) => {
    setSelectedThana(thana);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5 md:p-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            🚑 এম্বুল্যান্স তালিকা
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            পেজ {currentPage} / {totalPages || 1} (মোট রেজাল্ট:{" "}
            {filtered.length})
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="খুঁজুন (নাম/স্থান/ফোন)..."
            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-red-200 outline-none w-full sm:w-48 md:w-56 transition-all shadow-sm"
          />

          <select
            value={selectedThana}
            onChange={(e) => handleThanaChange(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-red-200 transition-all shadow-sm cursor-pointer"
          >
            {THANAS.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>

          <div className="flex gap-1 bg-white border rounded-xl p-1 shadow-sm overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap ${
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

      {/* RENDER STATES */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-center py-20 text-red-500 font-semibold">
          ডাটা লোড করতে সমস্যা হচ্ছে! আবার চেষ্টা করুন।
        </p>
      ) : (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            key={currentPage} // পেজ চেঞ্জ হলে কার্ডগুলোর এনিমেশন রি-ট্রিগার হওয়ার জন্য
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="wait">
              {displayedAmbulances.length === 0 ? (
                <p className="col-span-full text-center text-gray-400 py-20 font-medium">
                  কোনো অ্যাম্বুল্যান্স পাওয়া যায়নি।
                </p>
              ) : (
                displayedAmbulances.map((amb) => {
                  const t = typeMap[amb.type] || typeMap.private;
                  const currentThanaLabel =
                    THANAS.find((th) => th.key === amb.thana?.toLowerCase())
                      ?.label || amb.thana;

                  return (
                    <motion.div
                      key={amb._id}
                      variants={card}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 15px 30px rgba(0,0,0,0.06)",
                      }}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className={`h-1 bg-gradient-to-r ${t.color}`} />
                        <div className="p-4 pb-2">
                          <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-red-500 transition line-clamp-1">
                            {amb.name}
                          </h3>
                          <span
                            className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-md border font-medium ${t.badge}`}
                          >
                            {t.label}
                          </span>

                          <div className="mt-3 space-y-2 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              📍{" "}
                              <span className="font-semibold text-gray-700">
                                {currentThanaLabel}
                                {amb.area ? `, ${amb.area}` : ""}
                              </span>
                            </p>
                            <p className="flex items-start gap-2 text-gray-500 text-xs">
                              🏠{" "}
                              <span className="line-clamp-2">
                                {amb.address}
                              </span>
                            </p>
                            <div className="pt-1 space-y-1">
                              {amb.phone?.map((p, i) => (
                                <p
                                  key={i}
                                  className="flex items-center gap-2 font-mono text-gray-700 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100 w-fit"
                                >
                                  📞 {p}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 mt-3 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                          {amb.type}
                        </span>
                        <div className="flex gap-1.5">
                          <button className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 transition font-medium">
                            Edit
                          </button>
                          <button className="text-xs px-2.5 py-1 bg-red-50 text-red-500 rounded-lg border border-red-100 hover:bg-red-100 transition font-medium">
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── PAGINATION CONTROLS UI ── */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 pb-5">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-xl border bg-white text-gray-600 hover:bg-gray-50 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ◀ Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-9 h-9 text-xs font-semibold rounded-xl transition-all duration-200 ${
                        currentPage === pageNumber
                          ? "bg-red-500 text-white shadow-md shadow-red-200"
                          : "bg-white text-gray-600 border hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-xl border bg-white text-gray-600 hover:bg-gray-50 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllAmbulances;
