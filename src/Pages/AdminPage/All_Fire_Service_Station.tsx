import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useDeleteFireStationMutation,
  useGetAllFireStationQuery,
} from "../../Redux/features/admin/adminApi";
import Swal from "sweetalert2";

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

/* ── UI Configuration Maps ── */
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

const FILTERS = [
  { key: "all", label: "সব" },
  { key: "government", label: "সরকারি" },
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

/* ── Animation Framer Motion Variants ── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.02 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

/* ── 1. Skeleton Loader Component ── */
const FireStationSkeleton = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse flex flex-col justify-between h-[210px]"
      >
        <div className="p-4 space-y-3">
          <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
          <div className="flex gap-2">
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-12" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-7 bg-gray-100 rounded-lg w-2/3" />
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-md w-12" />
            <div className="h-6 bg-gray-200 rounded-md w-14" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* ── 2. Error Boundary Component ── */
const ErrorState = ({
  error,
  refetch,
}: {
  error: any;
  refetch: () => void;
}) => {
  let errorMessage =
    "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।";

  if (error) {
    if ("status" in error) {
      if (error.status === "FETCH_ERROR") {
        errorMessage = "ইন্টারনেট কানেকশন সমস্যা! আপনার নেটওয়ার্ক চেক করুন।";
      } else if (
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
      ) {
        errorMessage = (error.data as any).message;
      }
    } else if ("message" in error) {
      errorMessage = error.message as string;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm border border-red-100">
        ⚠️
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">
        উফ! কোনো একটি সমস্যা হয়েছে
      </h3>
      <p className="text-sm text-gray-500 max-w-md mb-5 font-medium">
        {errorMessage}
      </p>
      <button
        onClick={() => refetch()}
        className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-sm rounded-xl shadow-md shadow-red-100 hover:opacity-90 active:scale-95 transition"
      >
        আবার চেষ্টা করুন
      </button>
    </div>
  );
};

/* ── Main Dashboard Component ── */
const AllFireServices = () => {
  const [deleteFireStation] = useDeleteFireStationMutation();
  const { data, isLoading, isFetching, error, refetch } =
    useGetAllFireStationQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedThana, setSelectedThana] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Pro Tip: প্রথম পেজ লোডে ১০টি ডাটা দেখানোর জন্য itemsPerPage সেট করা হলো
  const itemsPerPage = 10;

  const handleDelete = async (id: string) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "মুছে ফেলার পর এই রেকর্ডটি আর ফিরে পাওয়া যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#4b5563",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "বাতিল করুন",
      customClass: {
        popup: "rounded-2xl",
      },
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "মুছে ফেলা হচ্ছে...",
          text: "অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await deleteFireStation(id).unwrap();

        Swal.fire({
          title: "সফল!",
          text: "স্টেশনটি সফলভাবে মুছে ফেলা হয়েছে।",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err: any) {
        console.error("Delete Error: ", err);
        Swal.fire({
          title: "ব্যর্থ হয়েছে!",
          text:
            err?.data?.message ||
            "মুছে ফেলতে কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

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

  // Safe data extraction
  const rawData = data?.data || [];
  const fireServices: IFireService[] = Array.isArray(rawData)
    ? rawData.filter((item: IFireService) => item && !item.isDeleted)
    : [];

  // Core Filtering Pipeline
  const filtered = fireServices.filter((item) => {
    const okType = filter === "all" || item.type === filter;
    const okThana =
      selectedThana === "all" ||
      item.thana?.trim().toLowerCase() === selectedThana.toLowerCase();

    const normalizedSearch = search.trim().toLowerCase();
    const okSearch =
      !normalizedSearch ||
      [item.name, item.area, item.thana, ...(item.phone ?? [])]
        .filter(Boolean)
        .some((s) => s.toLowerCase().includes(normalizedSearch));

    return okType && okThana && okSearch;
  });

  // Pagination Engine
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedServices = filtered.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5 md:p-8">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>🚒</span> ফায়ার সার্ভিস ড্যাশবোর্ড
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-0.5">
            {isLoading || isFetching
              ? "লোড হচ্ছে..."
              : `পেজ ${currentPage} / ${totalPages || 1} (মোট ফিল্টারড স্টেশন: ${filtered.length}টি)`}
          </p>
        </div>

        {/* ACTIONS & CONTROLS */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* SEARCH INPUT */}
          <div className="relative w-full sm:w-48 md:w-56">
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="খুঁজুন (নাম/স্থান/ফোন)..."
              className="bg-white border border-gray-200 rounded-xl pl-4 pr-8 py-2 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 w-full outline-none transition-all shadow-sm text-gray-700"
            />
            {search && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* THANA DROPDOWN */}
          <select
            value={selectedThana}
            onChange={(e) => handleThanaChange(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm cursor-pointer native-scroll"
          >
            {THANAS.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>

          {/* FILTER TABS */}
          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition whitespace-nowrap ${
                  filter === f.key
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm shadow-red-100"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DYNAMIC CONTENT SWITCHER */}
      {isLoading || isFetching ? (
        <FireStationSkeleton />
      ) : error ? (
        <ErrorState error={error} refetch={refetch} />
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={`${currentPage}-${filter}-${selectedThana}-${search}`}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {displayedServices.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full flex flex-col items-center justify-center py-20 text-center text-gray-400"
                >
                  <span className="text-4xl mb-2">🔍</span>
                  <p className="font-semibold text-gray-700">
                    কোঁন তথ্য পাওয়া যায়নি
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    অনুগ্রহ করে ভিন্ন কোনো কি-ওয়ার্ড বা ফিল্টার ট্রাই করুন।
                  </p>
                </motion.div>
              ) : (
                displayedServices.map((item) => {
                  const t = typeMap[item.type] || typeMap.government;
                  const currentThanaLabel =
                    THANAS.find((th) => th.key === item.thana?.toLowerCase())
                      ?.label || item.thana;

                  return (
                    <motion.div
                      key={item._id}
                      variants={cardVariants}
                      layoutId={item._id}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{
                        y: -4,
                        boxShadow: "0 12px 24px rgba(0,0,0,0.04)",
                      }}
                      className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-200"
                    >
                      <div>
                        <div className={`h-1 bg-gradient-to-r ${t.color}`} />
                        <div className="p-4 pb-2">
                          <h3 className="text-base font-bold text-gray-800 line-clamp-1">
                            {item.name}
                          </h3>

                          <div className="flex gap-1.5 mt-1.5 items-center">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md border font-bold ${t.badge}`}
                            >
                              {t.label}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase border ${
                                item.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-gray-50 text-gray-400 border-gray-200"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <div className="mt-4 space-y-2 text-xs md:text-sm text-gray-600">
                            <p className="flex items-start gap-1.5 text-gray-600">
                              <span className="text-gray-400 mt-0.5">📍</span>
                              <span className="font-semibold text-gray-700 line-clamp-2">
                                {currentThanaLabel}
                                {item.area ? `, ${item.area}` : ""}
                              </span>
                            </p>

                            <div className="pt-1 flex flex-wrap gap-1.5">
                              {item.phone?.filter(Boolean).map((p, i) => (
                                <a
                                  href={`tel:${p}`}
                                  key={i}
                                  className="flex items-center gap-1 font-mono text-xs text-red-600 font-bold bg-red-50/70 hover:bg-red-50 border border-red-100 px-2 py-1 rounded-lg transition"
                                >
                                  📞 {p}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CARD FOOTER ACTIONS */}
                      <div className="p-4 pt-2 mt-2 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                          {item.type}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-xs px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 shadow-sm font-semibold transition">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id as string)}
                            className="text-xs cursor-pointer px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 active:scale-95 rounded-lg border border-red-100 font-semibold transition"
                          >
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
            <div className="flex justify-center items-center gap-1.5 mt-10 pb-5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-xl border bg-white text-gray-600 hover:bg-gray-50 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ◀ Prev
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-8 h-8 text-xs font-bold rounded-xl transition-all ${
                        currentPage === pageNumber
                          ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-100"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
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
                className="px-3 py-2 rounded-xl border bg-white text-gray-600 hover:bg-gray-50 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition"
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
