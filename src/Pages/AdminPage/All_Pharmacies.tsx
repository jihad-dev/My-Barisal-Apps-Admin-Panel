
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiPhone,
  FiMapPin,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiAlertCircle,
  FiRefreshCw,
  FiInbox,
} from "react-icons/fi";
import { useGetAllPharmaciesQuery } from "../../Redux/features/admin/adminApi";

// টাইপ ডেফিনিশন
interface IPharmacy {
  _id: string;
  name: string;
  ownerName: string;
  description: string;
  area: string;
  address: string;
  phone: string[];
  whatsapp: string;
  locationUrl: string;
  status: string;
  isHomeDelivery: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const ITEMS_PER_PAGE = 12;

// 💀 Skeleton Loader Component
const PharmacySkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
      <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
      <div className="h-3 bg-gray-100 rounded-md w-1/2"></div>
    </div>
    <div className="h-4 bg-gray-100 rounded-md w-full"></div>
    <div className="space-y-2 pt-2">
      <div className="h-8 bg-gray-100 rounded-lg w-full"></div>
      <div className="h-8 bg-gray-100 rounded-lg w-full"></div>
    </div>
    <div className="h-10 bg-gray-200 rounded-lg w-full mt-4"></div>
  </div>
);

const All_Pharmacies = () => {
  const {
    data: pharmaciesData,
    isLoading,
    isError,
    refetch,
  } = useGetAllPharmaciesQuery(undefined);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // ১. মেমোইজড ডাটা ফিল্টারিং (পারফরম্যান্স অপটিমাইজেশন)
  const pharmacies = useMemo(() => {
    const raw: IPharmacy[] = pharmaciesData?.data || pharmaciesData || [];
    return raw.filter((p) => !p.isDeleted);
  }, [pharmaciesData]);

  // ২. ইউনিক এরিয়া লিস্ট বের করা
  const areas = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(pharmacies.map((p) => p.area).filter(Boolean))),
    ];
  }, [pharmacies]);

  // ৩. সার্চ এবং এরিয়া ফিল্টারিং
  const filteredData = useMemo(() => {
    return pharmacies.filter((p) => {
      const searchLower = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !searchLower ||
        p.name?.toLowerCase().includes(searchLower) ||
        p.address?.toLowerCase().includes(searchLower) ||
        p.ownerName?.toLowerCase().includes(searchLower);

      const matchesArea = selectedArea === "All" || p.area === selectedArea;
      return matchesSearch && matchesArea;
    });
  }, [pharmacies, searchQuery, selectedArea]);

  // ৪. পেজিনেশন হিসাব
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = useMemo(() => {
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, startIndex]);

  // পেজ চেঞ্জ হ্যান্ডলার
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ইনপুট হ্যান্ডলার
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* হেডার প্যানেল */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shrink-0">
              <FiActivity size={28} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                ফার্মেসি ডিরেক্টরি
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-100">
                  Total: {pharmacies.length}
                </span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-bold border border-blue-100">
                  Found: {filteredData.length}
                </span>
              </div>
            </div>
          </div>
          <Link
            to="/dashboard/add-pharmacy"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-sm hover:bg-emerald-700 hover:shadow-md active:scale-95 transition-all"
          >
            <FiPlus size={18} /> নতুন ফার্মেসি
          </Link>
        </div>

        {/* সার্চ এবং ফিল্টার বার */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              placeholder="ফার্মেসির নাম, মালিকের নাম বা ঠিকানা দিয়ে খুঁজুন..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-sm text-gray-800 placeholder-gray-400"
              onChange={handleSearchChange}
            />
          </div>
          <div className="relative">
            <FiFilter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
            <select
              className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-sm text-gray-700 cursor-pointer appearance-none"
              onChange={handleAreaChange}
              value={selectedArea}
            >
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area === "All" ? "সব এলাকা" : area}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <FiChevronRight className="rotate-90" size={16} />
            </div>
          </div>
        </div>

        {/* ১. লোডিং স্টেট (Skeleton UI) */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <PharmacySkeleton key={idx} />
            ))}
          </div>
        )}

        {/* ২. এরর স্টেট */}
        {isError && !isLoading && (
          <div className="bg-white rounded-2xl p-10 text-center border border-red-100 shadow-sm flex flex-col items-center justify-center gap-4">
            <div className="p-3 bg-red-50 text-red-500 rounded-full">
              <FiAlertCircle size={36} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900">
                ডাটা লোড করতে সমস্যা হয়েছে!
              </h3>
              <p className="text-sm text-gray-500">
                সার্ভার থেকে সঠিক তথ্য পুনরুদ্ধার করা যায়নি। অনুগ্রহ করে আবার
                চেষ্টা করুন।
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
            >
              <FiRefreshCw size={16} /> পুনরায় চেষ্টা করুন
            </button>
          </div>
        )}

        {/* ৩. খালি ডাটা স্টেট (No Results Found) */}
        {!isLoading && !isError && currentData.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-gray-50 text-gray-400 rounded-full">
              <FiInbox size={36} />
            </div>
            <p className="text-gray-600 font-bold text-base">
              আপনার খোঁজা ফিল্টারের সাথে কোনো ফার্মেসি মিলেনি!
            </p>
            <p className="text-xs text-gray-400">
              বানান চেক করুন বা অন্য কি-ওয়ার্ড ব্যবহার করে আবার চেষ্টা করুন।
            </p>
          </div>
        )}

        {/* ৪. প্রধান ফার্মেসি গ্রিড */}
        {!isLoading && !isError && currentData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {currentData.map((pharmacy, idx) => (
                <motion.div
                  key={pharmacy._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-xs border border-emerald-100">
                        {idx + 1 + startIndex}
                      </div>
                      <span
                        className={`flex items-center gap-1.5 text-[10px] font-bold uppercase py-1 px-2.5 rounded-full ${
                          pharmacy.status === "open"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            pharmacy.status === "open"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-amber-500"
                          }`}
                        ></span>
                        {pharmacy.status === "open" ? "Active" : "Closed"}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {pharmacy.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-1">
                      মালিক:{" "}
                      <span className="text-gray-600 font-medium">
                        {pharmacy.ownerName || "N/A"}
                      </span>
                    </p>

                    <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-4 min-h-[32px]">
                      <FiMapPin
                        className="text-emerald-500 mt-0.5 shrink-0"
                        size={14}
                      />
                      <span className="line-clamp-2">
                        {pharmacy.address || "ঠিকানা দেওয়া হয়নি"}
                      </span>
                    </div>

                    {/* ফোন নম্বর সেকশন */}
                    <div className="space-y-1.5 mb-5">
                      {pharmacy.phone && pharmacy.phone.length > 0 ? (
                        pharmacy.phone.slice(0, 2).map((num, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-gray-700 border border-gray-100"
                          >
                            <div className="flex items-center gap-2">
                              <FiPhone size={12} className="text-gray-400" />
                              {num}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          ফোন নম্বর উপলব্ধ নেই
                        </div>
                      )}
                    </div>
                  </div>

                  {/* বিস্তারিত লিংক */}
                  <Link
                    to='#'
                    className="w-full py-2.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-xl text-center block group-hover:bg-emerald-600 group-hover:text-white transition-all border border-gray-100 group-hover:border-emerald-600"
                  >
                    বিস্তারিত দেখুন
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ৫. পেজিনেশন কন্ট্রোলস */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 disabled:hover:bg-white disabled:hover:text-gray-700 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              <FiChevronLeft size={18} />
            </button>

            {/* পেজ বাটন প্রোভাইডার */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 disabled:hover:bg-white disabled:hover:text-gray-700 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default All_Pharmacies;
