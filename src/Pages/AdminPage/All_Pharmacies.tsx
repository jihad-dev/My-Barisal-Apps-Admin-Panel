import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiLoader,
  FiPhone,
  FiMapPin,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiAlertCircle,
} from "react-icons/fi";
import { useGetAllPharmaciesQuery } from "../../Redux/features/admin/adminApi";

// রিয়েল ডাটার উপর ভিত্তি করে টাইপ ডেফিনিশন
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

const All_Pharmacies = () => {
  const {
    data: pharmaciesData,
    isLoading,
    isError,
  } = useGetAllPharmaciesQuery(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // ১. লোডিং স্টেট হ্যান্ডেলিং
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <FiLoader size={35} className="animate-spin text-emerald-600" />
        <span className="text-sm font-bold text-gray-500">
          ডাটা লোড হচ্ছে...
        </span>
      </div>
    );
  }

  // ২. এরর স্টেট হ্যান্ডেলিং
  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-red-500">
        <FiAlertCircle size={40} />
        <span className="text-base font-bold">
          সার্ভার থেকে ডাটা আনতে সমস্যা হয়েছে!
        </span>
      </div>
    );
  }

  // ডাটা স্ট্রাকচার সেফটি চেক
  const rawPharmacies: IPharmacy[] =
    pharmaciesData?.data || pharmaciesData || [];
  const pharmacies = rawPharmacies.filter((p) => !p.isDeleted);

  // ইউনিক এরিয়া লিস্ট বের করা (ফিল্টার ড্রপডাউন)
  const areas = ["All", ...new Set(pharmacies.map((p) => p.area))];

  // সার্চ এবং এরিয়া ফিল্টারিং লজিক (কেস-সেন্সিটিভ ইস্যু ফিক্সড)
  const filteredData = pharmacies.filter((p) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchLower) ||
      p.address.toLowerCase().includes(searchLower) ||
      p.ownerName.toLowerCase().includes(searchLower); // ওনারের নাম দিয়েও সার্চ সুবিধা

    const matchesArea = selectedArea === "All" || p.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  // পেজিনেশন লজিক
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // পেজ পরিবর্তনের হ্যান্ডলার
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // স্মুথ স্ক্রল টপ
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* হেডার প্যানেল */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
              <FiActivity size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">
                ফার্মেসি ডিরেক্টরি
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                  Total: {pharmacies.length}
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                  Found: {filteredData.length}
                </span>
              </div>
            </div>
          </div>
          <Link
            to="/dashboard/add-pharmacy"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all"
          >
            <FiPlus /> নতুন ফার্মেসি
          </Link>
        </div>

        {/* সার্চ এবং ফিল্টার বার */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ফার্মেসির নাম, মালিকের নাম বা ঠিকানা দিয়ে খুঁজুন..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <select
              className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-bold text-gray-700 cursor-pointer appearance-none relative z-0"
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setCurrentPage(1);
              }}
              value={selectedArea}
            >
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area === "All" ? "সব এলাকা" : area}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <FiChevronRight className="rotate-90" />
            </div>
          </div>
        </div>

        {/* ফার্মেসি গ্রিড / নো ডাটা স্টেট */}
        {currentData.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3">
            <FiAlertCircle size={40} className="text-gray-300" />
            <p className="text-gray-500 font-bold">
              আপনার খোঁজা শর্তের সাথে কোনো ফার্মেসি মেলেনি!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {currentData.map((pharmacy, idx) => (
                <motion.div
                  key={pharmacy._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                        {idx + 1 + startIndex}
                      </div>
                      <span
                        className={`flex items-center gap-1.5 text-[10px] font-black uppercase py-1 px-2 rounded-full ${
                          pharmacy.status === "open"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            pharmacy.status === "open"
                              ? "bg-emerald-500 animate-ping"
                              : "bg-amber-500"
                          }`}
                        ></span>
                        {pharmacy.status === "open" ? "Active" : "Closed"}
                      </span>
                    </div>

                    <h3 className="font-black text-gray-800 text-base mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {pharmacy.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2 line-clamp-1">
                      মালিক: {pharmacy.ownerName}
                    </p>

                    <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-4 min-h-[32px]">
                      <FiMapPin className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{pharmacy.address}</span>
                    </div>

                    {/* ফোন নম্বর সেকশন */}
                    <div className="space-y-1.5 mb-5">
                      {pharmacy.phone &&
                        pharmacy.phone.slice(0, 2).map((num, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-[13px] font-mono font-bold text-gray-700 border border-gray-100"
                          >
                            <div className="flex items-center gap-2">
                              <FiPhone size={12} className="text-gray-400" />
                              {num}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* বিস্তারিত বাটনটি লিংক হিসেবে ম্যাপ করা হয়েছে */}
                  <Link
                    to={`/dashboard/pharmacy/${pharmacy._id}`}
                    className="w-full py-2.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg text-center block group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm"
                  >
                    বিস্তারিত দেখুন
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* পেজিনেশন কন্ট্রোলস */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-3 bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 disabled:hover:bg-white disabled:hover:text-gray-700 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={18} />
            </button>
            <span className="text-sm font-black text-gray-700 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-3 bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 disabled:hover:bg-white disabled:hover:text-gray-700 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
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
