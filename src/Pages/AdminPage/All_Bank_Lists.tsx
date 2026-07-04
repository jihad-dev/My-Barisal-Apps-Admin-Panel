import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBriefcase,
  FiPhone,
  FiMapPin,
  FiSearch,
  FiPlus,
  FiAlertCircle,
  FiHash,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useGetAllBanksQuery } from "../../Redux/features/admin/adminApi";

const THANAS = [
  { name: "বরিশাল সদর (Barisal Sadar)", value: "Barisal Sadar" },
  { name: "বাকেরগঞ্জ (Bakerganj)", value: "Bakerganj" },
  { name: "উজিরপুর (Wazirpur)", value: "Wazirpur" },
  { name: "বাবুগঞ্জ (Babuganj)", value: "Babuganj" },
  { name: "বানারীপাড়া (Banaripara)", value: "Banaripara" },
  { name: "গৌরনদী (Gournadi)", value: "Gournadi" },
  { name: "আগৈলঝারা (Agailjhara)", value: "Agailjhara" },
  { name: "মেহেন্দিগঞ্জ (Mehendiganj)", value: "Mehendiganj" },
  { name: "মুলাদী (Muladi)", value: "Muladi" },
  { name: "হিজলা (Hizla)", value: "Hizla" },
];

interface BankData {
  _id: string;
  name: string;
  thana: string;
  branch: string;
  routingNumber: string;
  address: string;
  phone: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const ITEMS_PER_PAGE = 9; // প্রতি পেজে ৯টি করে ব্যাংক কার্ড দেখাবে

const All_Bank_Lists = () => {
  const {
    data: banksData,
    isLoading,
    isError,
  } = useGetAllBanksQuery(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThana, setSelectedThana] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  console.log(banksData?.data);

  // --- লোডিং স্কেলিটন কম্পোনেন্ট ---
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {[...Array(6)].map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-2/3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </div>
          <div className="h-8 bg-gray-100 rounded-lg w-full"></div>
          <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
        </div>
      ))}
    </div>
  );

  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2 text-rose-500 bg-rose-50/50 rounded-2xl border border-rose-100 p-6 max-w-xl mx-auto mt-10">
        <FiAlertCircle size={40} />
        <h3 className="font-black text-base">ডেটা লোড করতে সমস্যা হয়েছে!</h3>
        <p className="text-xs text-gray-500 text-center">
          অনুগ্ৰহ করে পেজটি রিফ্রেশ করুন অথবা সার্ভার কানেকশন চেক করুন।
        </p>
      </div>
    );
  }

  // ডেটা এক্সট্র্যাক্ট এবং ফিল্টারিং
  const rawBanks: BankData[] = banksData?.data || banksData || [];
  const banks = rawBanks.filter((bank) => !bank.isDeleted);

  const filteredBanks = banks.filter((bank) => {
    const searchLower = searchQuery.toLowerCase();

    // ফোন নম্বরের অ্যারেতে ইউজার যা লিখছে তা ম্যাচ করছে কি না তা চেক করার লজিক
    const matchesPhone = bank.phone?.some((num) =>
      num?.toLowerCase().includes(searchLower),
    );

    const matchesSearch =
      bank.name?.toLowerCase().includes(searchLower) ||
      bank.branch?.toLowerCase().includes(searchLower) ||
      bank.routingNumber?.includes(searchLower) ||
      matchesPhone; // 👈 ফোন নম্বর কন্ডিশন এখানে যোগ করা হয়েছে

    const matchesThana = selectedThana ? bank.thana === selectedThana : true;
    return matchesSearch && matchesThana;
  });

  // --- পেজিনেশন লজিক ---
  const totalPages = Math.ceil(filteredBanks.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentBanks = filteredBanks.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchOrFilterChange = (
    type: "search" | "thana",
    value: string,
  ) => {
    if (type === "search") setSearchQuery(value);
    if (type === "thana") setSelectedThana(value);
    setCurrentPage(1); // সার্চ বা ফিল্টার করলে পেজ ১ এ রিসেট হবে
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* টপ হেডার প্যানেল */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <FiBriefcase size={24} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                ব্যাংক ও শাখাসমূহ
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                My Barisal ডিরেক্টরির সব ব্যাংক, রাউটিং নম্বর ও অফিসিয়াল
                যোগাযোগ মাধ্যম।
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/add-bank"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition-all no-underline"
          >
            <FiPlus size={16} /> নতুন ব্যাংক যুক্ত করুন
          </Link>
        </div>

        {/* সার্চ বার এবং থানা ফিল্টার সেকশন */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {/* সার্চ ইনপুট */}
          <div className="relative sm:col-span-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="ব্যাংক, ব্রাঞ্চ, রাউটিং বা ফোন নম্বর দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) =>
                handleSearchOrFilterChange("search", e.target.value)
              }
              className="w-full bg-white text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium shadow-sm"
            />
          </div>

          {/* থানা ড্রপডাউন ফিল্টার */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <FiFilter size={16} />
            </span>
            <select
              value={selectedThana}
              onChange={(e) =>
                handleSearchOrFilterChange("thana", e.target.value)
              }
              className="w-full bg-white text-gray-900 text-sm pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-semibold shadow-sm appearance-none cursor-pointer"
            >
              <option value="">সব থানা (All Thanas)</option>
              {THANAS.map((thana) => (
                <option key={thana.value} value={thana.value}>
                  {thana.name}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-400 text-[10px]">
              ▼
            </span>
          </div>
        </div>

        {/* কন্টেন্ট লোডিং বা মেইন গ্রিড ভিউ */}
        {isLoading ? (
          <SkeletonLoader />
        ) : filteredBanks.length === 0 ? (
          <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 shadow-sm">
            <p className="text-sm font-bold text-gray-400">
              আপনার ফিল্টার বা সার্চ করা তথ্যের কোনো ব্যাংক পাওয়া যায়নি!
            </p>
          </div>
        ) : (
          <>
            {/* ব্যাংক কার্ড গ্রিড */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {currentBanks.map((bank, idx) => (
                  <motion.div
                    key={bank._id || idx}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: idx * 0.02 }}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200/80 transition-all flex flex-col overflow-hidden group"
                  >
                    {/* কার্ড কন্টেন্ট */}
                    <div className="p-5 flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="font-black text-gray-900 text-base group-hover:text-indigo-600 transition-colors leading-tight">
                            {bank.name}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            <p className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider">
                              {bank.branch}
                            </p>
                            <p className="text-[10px] font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md inline-block">
                              📍 {bank.thana}
                            </p>
                          </div>
                        </div>

                        {/* লাইভ ব্লিংকিং অ্যাক্টিভ ইন্ডিকেটর */}
                        <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/80 flex items-center gap-1.5 flex-shrink-0 shadow-sm select-none">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Active
                        </span>
                      </div>

                      {/* রাউটিং নম্বর ও এড্রেস উইজেট */}
                      <div className="space-y-2 text-xs font-bold text-gray-600">
                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg p-2 text-gray-700 font-mono">
                          <FiHash
                            size={13}
                            className="text-indigo-500 flex-shrink-0"
                          />
                          <span>Routing: {bank.routingNumber}</span>
                        </div>
                        <div className="flex items-start gap-1.5 pt-1">
                          <FiMapPin
                            size={13}
                            className="text-gray-400 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-gray-500 font-semibold leading-relaxed">
                            {bank.address}
                          </span>
                        </div>
                      </div>

                      <hr className="border-gray-100" />

                      {/* কন্টাক্ট নম্বরসমূহ */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                          ফোন কন্টাক্ট
                        </label>
                        <div className="space-y-1.5">
                          {bank.phone?.map((num, pIdx) => {
                            const isHotline = num.length <= 5;
                            return (
                              <div
                                key={pIdx}
                                className="flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl text-xs font-mono font-bold text-gray-800 hover:bg-indigo-50/30 hover:border-indigo-100 transition-all"
                              >
                                <span className="flex items-center gap-2">
                                  <FiPhone
                                    size={12}
                                    className="text-gray-400"
                                  />
                                  {num}
                                </span>
                                <span className="px-1.5 py-0.5 text-[9px] font-black rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {isHotline
                                    ? "Hotline"
                                    : `${num.replace(/[^0-9]/g, "").length} Digit`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* --- রেসপনসিভ পেজিনেরেশন কন্ট্রোলস --- */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                          currentPage === pageNum
                            ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                            : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default All_Bank_Lists;
