import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiUser,
  FiPhone,
  FiMapPin,
  FiTrash2,
  FiEdit3,
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
} from "react-icons/fi";
// আপনার প্রোজেক্টের সঠিক পাথ অনুযায়ী এপিআই হুকটি ইমপোর্ট করুন
import { useGetAllImamMuzzainQuery } from "../../Redux/features/admin/adminApi";
import { Link } from "react-router-dom";

// রিয়েল ডাটা স্ট্রাকচার অনুযায়ী ইন্টারফেস আপডেট করা হয়েছে
interface IImamMuazzin {
  _id: string;
  name: string;
  role: "imam" | "muazzin" | string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  union: string;
  village: string;
  fullAddress: string;
  employmentStatus: "available" | "employed" | string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  statusUpdatedAt: string;
}

const All_Imam = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // RTK Query হুক কল
  const {
    data: responseData,
    isLoading,
    isError,
  } = useGetAllImamMuzzainQuery();

  // ব্যাকএন্ড ডাটা এক্সট্র্যাক্ট (এপিআই রেসপন্সের ধরন অনুযায়ী ব্যাকআপসহ)
  const rawData: IImamMuazzin[] = responseData?.data || responseData || [];

  // ১. মেমরাইজড ফিল্টারিং (সার্চ ও রোল ফিল্টার রিয়েল ডাটা প্রপার্টির সাথে ম্যাচিং)
  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      if (item.isDeleted) return false;

      const matchesSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone?.includes(searchTerm) ||
        item.fullAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.village?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || item.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [rawData, searchTerm, roleFilter]);

  // ২. পেজিনেশন ক্যালকুলেশন
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleDelete = (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত যে এই রেকর্ডটি মুছে ফেলতে চান?")) {
      // এখানে আপনার ডিলিট মিউটেশন কল হবে
      console.log("Deleted ID:", id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 font-sans antialiased text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* টপ আল্ট্রা-প্রিমিয়াম হেডার কার্ড */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <FiUser className="text-emerald-500" /> ইমাম ও মুয়াজ্জিন
              ম্যানেজমেন্ট
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              সর্বমোট নিবন্ধিত:{" "}
              <span className="text-emerald-600 font-bold font-mono">
                {filteredData.length}
              </span>{" "}
              জন
            </p>
          </div>

        <Link to='/dashboard/imam-muazzin/add'>  <button
            type="button"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-950/20 active:scale-98 transition-all cursor-pointer w-full md:w-auto justify-center"
          >
            <FiPlus  size={16} /> নতুন সদস্য যুক্ত করুন
          </button></Link>
        </div>

        {/* প্রিমিয়াম ফিল্টার ও সার্চ প্যানেল */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* সার্চ ইনপুট */}
          <div className="relative sm:col-span-2 shadow-sm rounded-xl">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="নাম, ফোন নম্বর অথবা গ্রাম/ঠিকানা লিখে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // সার্চ করলে আবার ১ম পেজে নিয়ে যাবে
              }}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-xl outline-none transition-all font-medium text-sm text-slate-900"
            />
          </div>

          {/* রোল ফিল্টার */}
          <div className="relative shadow-sm rounded-xl">
            <FiFilter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-xl outline-none transition-all font-bold text-sm text-slate-700 appearance-none cursor-pointer"
            >
              <option value="all">সকল পদ (Role)</option>
              <option value="imam">ইমাম (Imam)</option>
              <option value="muazzin">মুয়াজ্জিন (Muazzin)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
              ▼
            </div>
          </div>
        </div>

        {/* মেইন ডাটা টেবিল কন্টেইনার */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                  <th className="py-4 px-6">বেসিক প্রোফাইল</th>
                  <th className="py-4 px-6">পদবী / Role</th>
                  <th className="py-4 px-6">ঠিকানা ও অবস্থান</th>
                  <th className="py-4 px-6">कर्मसंस्थान स्टॅटस</th>
                  <th className="py-4 px-6 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-sm text-slate-700">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <FiLoader
                            className="animate-spin text-emerald-500"
                            size={28}
                          />
                          <span className="font-bold text-slate-500 text-sm">
                            ডাটাবেজ থেকে তথ্য লোড হচ্ছে...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-16 text-center text-red-500 font-bold"
                      >
                        সার্ভার রেসপন্স করছে না। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।
                      </td>
                    </tr>
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50/60 transition-colors group"
                      >
                        {/* প্রোফাইল (নাম ও ফোন) */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black border border-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all">
                              {item.name ? item.name.charAt(0) : "U"}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                                {item.name || "নামহীন"}
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-1 font-mono tracking-tight">
                                <FiPhone size={12} className="text-slate-400" />{" "}
                                {item.phone || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* রোল / পদবী */}
                        <td className="py-4 px-6">
                          {item.role === "imam" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                              ইমাম
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase">
                              মুয়াজ্জিন
                            </span>
                          )}
                        </td>

                        {/* রিয়েল এড্রেস কোয়ারি ম্যাচিং */}
                        <td className="py-4 px-6">
                          <div className="max-w-[280px] space-y-0.5">
                            <p
                              className="text-xs font-black text-slate-800 truncate"
                              title={item.fullAddress}
                            >
                              {item.village
                                ? `গ্রাম: ${item.village}`
                                : item.fullAddress}
                            </p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                              <FiMapPin size={11} className="text-slate-300" />
                              {item.upazila && item.district
                                ? `${item.union ? `${item.union}, ` : ""}${item.upazila}, ${item.district}`
                                : "ঠিকানা পাওয়া যায়নি"}
                            </p>
                          </div>
                        </td>

                        {/* কর্মসংস্থান স্ট্যাটাস */}
                        <td className="py-4 px-6">
                          {item.employmentStatus === "available" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <FiCheckCircle size={12} /> এভেইলেবল (ফ্রি)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              <FiXCircle size={12} /> নিয়োজিত আছেন
                            </span>
                          )}
                        </td>

                        {/* অ্যাকশন বাটন সমূহ */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              title="সম্পাদনা"
                              className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                            >
                              <FiEdit3 size={16} />
                            </button>
                            <button
                              title="মুছে ফেলুন"
                              onClick={() => handleDelete(item._id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-16 text-center text-slate-400 font-bold"
                      >
                        কোনো ডাটা পাওয়া যায়নি।
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* ৫. স্মুথ পেজিনেশন প্যানেল */}
          {totalPages > 1 && (
            <div className="bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500">
                পৃষ্ঠা নং{" "}
                <span className="text-slate-800 font-mono">{currentPage}</span>{" "}
                / <span className="text-slate-800 font-mono">{totalPages}</span>{" "}
                (মোট ডাটা: {filteredData.length})
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <FiChevronLeft size={16} />
                </button>

                {/* পেজ জাম্প বাটন লজিক */}
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNum = index + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(currentPage - pageNum) <= 1
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return (
                      <span key={pageNum} className="px-1 text-slate-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default All_Imam;
