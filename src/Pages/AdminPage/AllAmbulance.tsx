import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDeleteAmbulanceMutation, useGetAllAmbulanceQuery } from "../../Redux/features/admin/adminApi";
import Swal from "sweetalert2";

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

// ── এনিমেশন কনফিগ ──
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

// ── কঙ্কাল লোডার (Skeleton Loader Component) ──
const AmbulanceSkeleton = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between h-[260px] animate-pulse"
      >
        <div>
          <div className="h-1 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded-md w-3/4" />
            <div className="h-4 bg-gray-200 rounded-md w-1/4" />
            <div className="space-y-2 pt-2">
              <div className="h-4 bg-gray-200 rounded-md w-5/6" />
              <div className="h-4 bg-gray-200 rounded-md w-full" />
              <div className="h-7 bg-gray-200 rounded-md w-1/2 mt-2" />
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div className="h-3 bg-gray-200 rounded-md w-16" />
          <div className="flex gap-2">
            <div className="h-7 w-12 bg-gray-200 rounded-lg" />
            <div className="h-7 w-14 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const AllAmbulances = () => {
  const { data, isLoading, error } = useGetAllAmbulanceQuery(undefined);
  const [deleteAmbulance] = useDeleteAmbulanceMutation();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedThana, setSelectedThana] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // ডেটা ফিল্টারিং সেফটি চেকসহ
  const ambulances: IAmbulance[] = (data?.data ?? []).filter(
    (amb: IAmbulance) => !amb?.isDeleted,
  );

  const filtered = ambulances.filter((amb) => {
    const okType = filter === "all" || amb?.type === filter;
    const okThana =
      selectedThana === "all" ||
      amb?.thana?.trim().toLowerCase() === selectedThana.toLowerCase();

    const okSearch = [
      amb?.name,
      amb?.area,
      amb?.thana,
      amb?.address,
      ...(amb?.phone ?? []),
    ]
      .filter(Boolean)
      .some((s) => s.toLowerCase().includes(search.toLowerCase()));

    return okType && okThana && okSearch;
  });

  // প্যাগিনেশন ম্যাথ
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedAmbulances = filtered.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // রিসেট হ্যান্ডলার
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
const handleDelete = (id: string, name: string) => {
  Swal.fire({
    title: "আপনি কি নিশ্চিত?",
    text: `"${name}" অ্যাম্বুল্যান্সের তথ্যটি মুছে ফেলা হবে!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444", // Tailwind red-500
    cancelButtonColor: "#6b7280", // Tailwind gray-500
    confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
    cancelButtonText: "না, রাখুন",
    background: "#ffffff",
    customClass: {
      popup: "rounded-2xl font-sans",
      confirmButton: "px-4 py-2 rounded-xl text-sm font-semibold",
      cancelButton: "px-4 py-2 rounded-xl text-sm font-semibold",
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
     
        await deleteAmbulance(id).unwrap();

        Swal.fire({
          title: "ডিলিট হয়েছে!",
          text: "অ্যাম্বুল্যান্সের তথ্যটি সফলভাবে মুছে ফেলা হয়েছে।",
          icon: "success",
          confirmButtonColor: "#10b981", // Tailwind emerald-500
          customClass: {
            popup: "rounded-2xl font-sans",
            confirmButton: "px-4 py-2 rounded-xl text-sm font-semibold",
          },
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        Swal.fire({
          title: "ভুল হয়েছে!",
          text: "তথ্যটি ডিলিট করা সম্ভব হয়নি। আবার চেষ্টা করুন।",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  });
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5 md:p-8 selection:bg-red-50 selection:text-red-600">
      {/* HEADER & TOP CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <span>🚑</span> এম্বুল্যান্স তালিকা
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-1 bg-gray-200/50 w-fit px-2.5 py-1 rounded-full">
            পেজ {currentPage} / {totalPages || 1} • মোট রেজাল্ট:{" "}
            {filtered.length} টি
          </p>
        </div>

        {/* INPUTS AND DROP-DOWNS */}
        <div className="flex flex-wrap gap-3 items-center sm:items-center">
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="খুঁজুন (নাম/স্থান/ফোন)..."
            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-red-400/20 focus:border-red-400 outline-none w-full sm:w-56 transition-all shadow-sm"
          />

          <select
            value={selectedThana}
            onChange={(e) => handleThanaChange(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 transition-all shadow-sm cursor-pointer"
          >
            {THANAS.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>

          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm overflow-x-auto max-w-full">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  filter === f.key
                    ? "bg-red-500 text-white shadow-sm shadow-red-200"
                    : "text-gray-500 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RENDER DYNAMICS */}
      {isLoading ? (
        <AmbulanceSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto p-6">
          <span className="text-4xl mb-3">⚠️</span>
          <h3 className="text-lg font-bold text-gray-800">
            লোড করতে ব্যর্থ হয়েছে
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। দয়া করে আপনার ইন্টারনেট
            কানেকশন চেক করুন।
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-xs bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition shadow-sm"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={`${currentPage}-${filter}-${selectedThana}`} // ফিল্টার বা পেজ পরিবর্তনের নিখুঁত এনিমেশন রি-রেন্ডার ট্রিগার
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {displayedAmbulances.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full text-center text-gray-400 py-24 font-medium bg-white rounded-2xl border border-dashed border-gray-200"
                >
                  🔍 কোনো অ্যাম্বুল্যান্স তথ্য পাওয়া যায়নি!
                </motion.p>
              ) : (
                displayedAmbulances.map((amb) => {
                  const t = typeMap[amb?.type] || typeMap.private;
                  const currentThanaLabel =
                    THANAS.find((th) => th.key === amb?.thana?.toLowerCase())
                      ?.label || amb?.thana;

                  return (
                    <motion.div
                      layout
                      key={amb?._id}
                      variants={cardVariants}
                      whileHover={{
                        y: -4,
                        boxShadow:
                          "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)",
                      }}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between group group-hover:border-gray-200 transition-colors duration-200"
                    >
                      <div>
                        <div className={`h-1.5 bg-gradient-to-r ${t.color}`} />
                        <div className="p-5 pb-2">
                          <h3 className="text-base md:text-[17px] font-bold text-gray-800 group-hover:text-red-500 transition line-clamp-1">
                            {amb?.name}
                          </h3>
                          <span
                            className={`inline-block mt-1.5 text-[11px] px-2.5 py-0.5 rounded-md border font-semibold ${t.badge}`}
                          >
                            {t.label}
                          </span>

                          <div className="mt-4 space-y-2.5 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs">📍</span>{" "}
                              <span className="font-semibold text-gray-700">
                                {currentThanaLabel}
                                {amb?.area ? `, ${amb.area}` : ""}
                              </span>
                            </p>
                            <p className="flex items-start gap-2 text-gray-500 text-xs leading-relaxed">
                              <span className="text-gray-400">🏠</span>{" "}
                              <span className="line-clamp-2">
                                {amb?.address || "ঠিকানা পাওয়া যায়নি"}
                              </span>
                            </p>

                            <div className="pt-2 flex flex-col gap-1.5">
                              {amb?.phone?.map((p, i) => (
                                <a
                                  href={`tel:${p}`}
                                  key={i}
                                  className="flex items-center gap-2 font-mono text-xs text-gray-700 font-semibold bg-gray-50 hover:bg-red-50 hover:text-red-600 px-2.5 py-1.5 rounded-xl border border-gray-100 transition-colors w-fit shadow-xs group/phone"
                                >
                                  <span className="group-hover/phone:animate-pulse">
                                    📞
                                  </span>{" "}
                                  {p}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS BAR */}
                      <div className="p-4 pt-3 mt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/40">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                          {amb?.type}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-xs px-3 py-1.5 bg-white text-blue-600 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 active:scale-95 transition font-semibold shadow-xs">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(amb?._id as string, amb?.name)}
                            className="text-xs px-3 py-1.5 bg-white text-red-500 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50/50 active:scale-95 transition font-semibold shadow-xs"
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

          {/* ── PAGINATION CONTROLS ── */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 pb-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition shadow-xs flex items-center gap-1"
              >
                <span>◀</span> Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-9 h-9 text-xs font-bold rounded-xl transition-all duration-200 active:scale-90 ${
                        currentPage === pageNumber
                          ? "bg-red-500 text-white shadow-md shadow-red-200"
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
                className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition shadow-xs flex items-center gap-1"
              >
                Next <span>▶</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllAmbulances;
