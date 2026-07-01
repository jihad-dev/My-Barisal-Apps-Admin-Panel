import  { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiHome,
  FiPhone,
  FiMapPin,
  FiTrash2,
  FiEdit3,
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiFilter,
  FiCalendar,
  FiUsers,
  FiRefreshCw,
} from "react-icons/fi";
// আপনার প্রজেক্টের সঠিক পাথ অনুযায়ী এপিআই হুকটি ইমপোর্ট করুন
import { useGetAllInstitutionsQuery } from "../../Redux/features/admin/adminApi";
import { Link } from "react-router-dom";

// আপনার অফিশিয়াল টাইপ স্কিমা
export type TInstitutionType =
  | "primary_school"
  | "high_school"
  | "college"
  | "masjid"
  | "madrasa"
  | "university"
  | "mandir";

// ইনস্টিটিউশন ইন্টারফেস
interface IInstitution {
  _id: string;
  name: string;
  type: TInstitutionType | string;
  status: "active" | "inactive" | string;
  area: string;
  upazila: string;
  address: string;
  phone: string[];
  established: number;
  totalStudents: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const All_Institute = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // পেজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // RTK Query ডাটা ফেচিং
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllInstitutionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // ব্যাকএন্ড রেসপন্স থেকে ডাটা এক্সট্র্যাক্ট
  const institutions: IInstitution[] = responseData?.data || responseData || [];

  // ১. অপ্টিমাইজড ফিল্টারিং লজিক (useMemo)
  const filteredData = useMemo(() => {
    return institutions.filter((item) => {
      if (item.isDeleted) return false;

      const matchesSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone?.some((p) => p.includes(searchTerm));

      const matchesType = typeFilter === "all" || item.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [institutions, searchTerm, typeFilter]);

  // ২. পেজিনেশন স্লাইসিং মেকানিজম
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // ডিলিট হ্যান্ডলার
  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "আপনি কি নিশ্চিত যে এই প্রতিষ্ঠানের তথ্যটি মুছে ফেলতে চান?",
      )
    ) {
      console.log("Deleted Institution ID:", id);
    }
  };

  // ৩. এরর মেসেজ হ্যান্ডলিং
  const getErrorMessage = () => {
    if (!error) return "সার্ভার রেসপন্স করছে না।";
    if ("status" in error) {
      const data = error.data as any;
      return (
        data?.message ||
        `Error ${error.status}: ডাটা লোড করতে ইন্টারনাল সমস্যা হয়েছে।`
      );
    }
    return error.message || "ইন্টারনেট কানেকশন চেক করে আবার চেষ্টা করুন।";
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 font-sans antialiased text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* টপ প্রিমিয়াম ড্যাশবোর্ড হেডার */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <FiHome className="text-emerald-500" /> প্রতিষ্ঠান ম্যানেজমেন্ট
              প্যানেল
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
              মোট ফিল্টার্ড প্রতিষ্ঠান:{" "}
              <span className="text-emerald-600 font-bold font-mono">
                {filteredData.length}
              </span>{" "}
              টি
              {isFetching && (
                <FiRefreshCw
                  className="animate-spin text-slate-400"
                  size={14}
                />
              )}
            </p>
          </div>
          <Link to="/dashboard/add-institute">
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-950/20 active:scale-98 transition-all cursor-pointer w-full md:w-auto justify-center"
            >
              <FiPlus size={16} /> নতুন প্রতিষ্ঠান যোগ করুন
            </button>
          </Link>
        </div>

        {/* ফিল্টার এবং সার্চ প্যানেল */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* সার্চ ফিল্ড */}
          <div className="relative sm:col-span-2 shadow-sm rounded-xl">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="নাম, ফোন নম্বর, এলাকা অথবা ঠিকানা লিখে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-xl outline-none transition-all font-medium text-sm text-slate-900"
            />
          </div>

          {/* টাইপ ফিল্টার (১০০% ম্যাচিং রিয়েল ডাটা) */}
          <div className="relative shadow-sm rounded-xl">
            <FiFilter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-xl outline-none transition-all font-bold text-sm text-slate-700 appearance-none cursor-pointer"
            >
              <option value="all">সকল ক্যাটাগরি (All Types)</option>
              <option value="primary_school">
                প্রাথমিক বিদ্যালয় (Primary School)
              </option>
              <option value="high_school">উচ্চ বিদ্যালয় (High School)</option>
              <option value="college">কলেজ (College)</option>
              <option value="university">বিশ্ববিদ্যালয় (University)</option>
              <option value="madrasa">মাদরাসা (Madrasa)</option>
              <option value="masjid">মসজিদ (Masjid)</option>
              <option value="mandir">মন্দির (Mandir)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
              ▼
            </div>
          </div>
        </div>

        {/* মেইন টেবিল কন্টেইনার */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                  <th className="py-4 px-6">প্রতিষ্ঠানের বেসিক ও যোগাযোগ</th>
                  <th className="py-4 px-6">ক্যাটাগরি ও সাল</th>
                  <th className="py-4 px-6">লোকেশন / এলাকা</th>
                  <th className="py-4 px-6">মোট শিক্ষার্থী</th>
                  <th className="py-4 px-6">স্ট্যাটাস</th>
                  <th className="py-4 px-6 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-sm text-slate-700">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <FiLoader
                            className="animate-spin text-emerald-500"
                            size={28}
                          />
                          <span className="font-bold text-slate-500 text-sm">
                            ডাটাবেজ থেকে তথ্য রিড করা হচ্ছে...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto px-4">
                          <FiAlertCircle className="text-red-500" size={36} />
                          <p className="font-black text-slate-800 text-base">
                            ডাটা লোড ব্যালেন্সিং এরর!
                          </p>
                          <p className="text-xs text-red-600 font-semibold bg-red-50 p-3 rounded-xl border border-red-100 w-full whitespace-normal">
                            {getErrorMessage()}
                          </p>
                          <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                          >
                            <FiRefreshCw size={12} /> আবার চেষ্টা করুন
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50/60 transition-colors group"
                      >
                        {/* প্রতিষ্ঠানের নাম ও ফোন */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black border border-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all">
                              {item.name ? item.name.charAt(0) : "I"}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                                {item.name || "নামহীন ইনস্টিটিউট"}
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-1 font-mono tracking-tight">
                                <FiPhone size={12} className="text-slate-400" />
                                {item.phone && item.phone.length > 0
                                  ? item.phone[0]
                                  : "ফোন নম্বর নেই"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ক্যাটাগরি ও প্রতিষ্ঠা সাল (ফিক্সড ও ইউনিক কালার ব্যাজ) */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black border uppercase ${
                                item.type === "primary_school"
                                  ? "bg-sky-50 text-sky-700 border-sky-100"
                                  : item.type === "high_school"
                                    ? "bg-blue-50 text-blue-700 border-blue-100"
                                    : item.type === "college"
                                      ? "bg-purple-50 text-purple-700 border-purple-100"
                                      : item.type === "university"
                                        ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                                        : item.type === "madrasa"
                                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                          : item.type === "masjid"
                                            ? "bg-teal-50 text-teal-700 border-teal-100"
                                            : item.type === "mandir"
                                              ? "bg-amber-50 text-amber-700 border-amber-100"
                                              : "bg-slate-50 text-slate-700 border-slate-100"
                              }`}
                            >
                              {item.type === "primary_school" &&
                                "প্রাথমিক বিদ্যালয়"}
                              {item.type === "high_school" && "উচ্চ বিদ্যালয়"}
                              {item.type === "college" && "কলেজ"}
                              {item.type === "university" && "বিশ্ববিদ্যালয়"}
                              {item.type === "madrasa" && "(মাদরাসা)"}
                              {item.type === "masjid" && "(মসজিদ)"}
                              {item.type === "mandir" && "মন্দির"}
                              {![
                                "primary_school",
                                "high_school",
                                "college",
                                "university",
                                "madrasa",
                                "masjid",
                                "mandir",
                              ].includes(item.type) &&
                                (item.type || "অন্যান্য")}
                            </span>

                            <p className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                              <FiCalendar size={11} /> Estd:
                              {item.established || "N/A"}
                            </p>
                          </div>
                        </td>

                        {/* লোকেশন / এলাকা */}
                        <td className="py-4 px-6">
                          <div className="max-w-[240px] space-y-0.5">
                            <p
                              className="text-xs font-black text-slate-800 truncate"
                              title={item.address}
                            >
                              {item.area
                                ? `${item.area}`
                                : "এলাকা নির্দিষ্ট নেই"}
                            </p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                              <FiMapPin size={11} className="text-slate-300" />
                              {item.address || `${item.upazila || "N/A"}`}
                            </p>
                          </div>
                        </td>

                        {/* মোট শিক্ষার্থী */}
                        <td className="py-4 px-6 font-mono text-xs font-bold text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <FiUsers className="text-slate-400" size={14} />
                            {item.totalStudents
                              ? item.totalStudents.toLocaleString("bn-BD")
                              : "০"}{" "}
                            জন
                          </div>
                        </td>

                        {/* একটিভ/ইনএকটিভ স্ট্যাটাস */}
                        <td className="py-4 px-6">
                          {item.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <FiCheckCircle size={12} /> একটিভ
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                              <FiXCircle size={12} /> ইনএকটিভ
                            </span>
                          )}
                        </td>

                        {/* অ্যাকশন জোন */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-1">
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
                        colSpan={6}
                        className="py-16 text-center text-slate-400 font-bold"
                      >
                        কোনো প্রতিষ্ঠানের তথ্য ডেটাবেজে পাওয়া যায়নি।
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* পেজিনেশন কন্ট্রোল */}
          {totalPages > 1 && (
            <div className="bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500">
                পৃষ্ঠা নং{" "}
                <span className="text-slate-800 font-mono">{currentPage}</span>{" "}
                / <span className="text-slate-800 font-mono">{totalPages}</span>{" "}
                (মোট ফিল্টার্ড ডাটা: {filteredData.length})
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
                  onClick={() => setCurrentPage((prev) => prev + 1)}
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

export default All_Institute;
