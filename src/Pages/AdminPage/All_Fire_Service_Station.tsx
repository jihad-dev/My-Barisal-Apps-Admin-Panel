
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllFireStationQuery } from "../../Redux/features/admin/adminApi";
import Loader from "../../utils/Loader";

export type TFireServiceType = "government" | "volunteer";
export type TFireServiceStatus = "active" | "inactive";

export interface IFireService {
  _id?: string;
  name: string;
  type: TFireServiceType;
  status: TFireServiceStatus;
  area: string;
  thana: string;
  phone: string[];
  isDeleted: boolean;
}

/* ── Fire Service Type & Status Styles ── */
const typeMap = {
  government: {
    label: "সরকারি",
    color: "from-red-500 to-rose-600",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
  volunteer: {
    label: "স্বেচ্ছাসেবী",
    color: "from-orange-500 to-amber-600",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
  },
} as const;

/* ── Fire Service Filters ── */
const FILTERS = [
  { key: "all", label: "সব" },
  { key: "government", label: "সরকারি" },
  { key: "volunteer", label: "স্বেচ্ছাসেবী" },
];

/* ── Thana List For Filtering ── */
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

/* ── Animation Config ── */
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

const AllFireServices = () => {
  // ১. আরটিকে কোয়েরি দিয়ে ডাটা ফেচ করা
  const { data, isLoading, error } = useGetAllFireStationQuery(undefined)

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedThana, setSelectedThana] = useState("all"); // থানার স্টেট

  // প্যাগিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // একটিভ ফায়ার সার্ভিস ফিল্টার (isDeleted: false)
  const fireServices: IFireService[] = (data?.data ?? []).filter(
    (item: IFireService) => !item.isDeleted,
  );

  // কম্বাইন্ড ফিল্টারিং লজিক (টাইপ + থানা + সার্চ)
  const filtered = fireServices.filter((item) => {
    const okType = filter === "all" || item.type === filter;

    const okThana =
      selectedThana === "all" ||
      item.thana?.trim().toLowerCase() === selectedThana.toLowerCase();

    const okSearch = [item.name, item.area, item.thana, ...(item.phone ?? [])]
      .filter(Boolean)
      .some((s) => s.toLowerCase().includes(search.toLowerCase()));

    return okType && okThana && okSearch;
  });

  // প্যাগিনেশন ক্যালকুলেশন
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedServices = filtered.slice(startIndex, endIndex);

  // ইনপুট চেঞ্জ হ্যান্ডলার (পেজ ১ নম্বরে রিসেট করবে)
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
            🚒 ফায়ার সার্ভিস তালিকা
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            পেজ {currentPage} / {totalPages || 1} (মোট স্টেশন: {filtered.length}
            )
          </p>
        </div>

        {/* CONTROLS (SEARCH + THANA + TYPE) */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="খুঁজুন (নাম/স্থান/ফোন)..."
            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-red-200 outline-none w-full sm:w-48 md:w-56 transition-all shadow-sm"
          />

          {/* THANA FILTER DROPDOWN */}
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

          {/* TYPE TABS */}
          <div className="flex gap-1 bg-white border rounded-xl p-1 shadow-sm overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap ${
                  filter === f.key
                    ? "bg-red-600 text-white shadow"
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
          {/* CARDS GRID */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            key={currentPage}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="wait">
              {displayedServices.length === 0 ? (
                <p className="col-span-full text-center text-gray-400 py-20 font-medium">
                  কোনো স্টেশন বা সার্ভিস পাওয়া যায়নি।
                </p>
              ) : (
                displayedServices.map((item) => {
                  const t = typeMap[item.type] || typeMap.government;
                  const currentThanaLabel =
                    THANAS.find((th) => th.key === item.thana?.toLowerCase())
                      ?.label || item.thana;

                  return (
                    <motion.div
                      key={item._id}
                      variants={card}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 15px 30px rgba(0,0,0,0.06)",
                      }}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        {/* TOP BAR COLOR */}
                        <div className={`h-1 bg-gradient-to-r ${t.color}`} />

                        <div className="p-4 pb-2">
                          {/* TITLE */}
                          <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-red-600 transition line-clamp-1">
                            {item.name}
                          </h3>

                          <div className="flex gap-1.5 mt-1 items-center">
                            {/* TYPE BADGE */}
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${t.badge}`}
                            >
                              {t.label}
                            </span>

                            {/* STATUS BADGE */}
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                                item.status === "active"
                                  ? "bg-green-50 text-green-600 border border-green-200"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {item.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </div>

                          {/* DETAILS */}
                          <div className="mt-3 space-y-2 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              📍{" "}
                              <span className="font-semibold text-gray-700">
                                {currentThanaLabel}
                                {item.area ? `, ${item.area}` : ""}
                              </span>
                            </p>

                            <div className="pt-1 space-y-1">
                              {item.phone?.map((p, i) => (
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

                      {/* CARD FOOTER */}
                      <div className="p-4 pt-0 mt-3 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                          {item.type}
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

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 pb-5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-xl border bg-white text-gray-600 hover:bg-gray-50 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ◀ Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-9 h-9 text-xs font-semibold rounded-xl transition-all duration-200 ${
                        currentPage === pageNumber
                          ? "bg-red-600 text-white shadow-md shadow-red-200"
                          : "bg-white text-gray-600 border hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

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

export default AllFireServices;
