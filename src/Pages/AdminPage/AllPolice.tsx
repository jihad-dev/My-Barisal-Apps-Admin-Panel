
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiTrash2,
  FiPlus,
  FiShield,
  FiPhone,
  FiMapPin,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiRefreshCw,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  useGetAllPoliceQuery,
  useDeletePoliceMutation,
} from "../../Redux/features/admin/adminApi";
import Swal from "sweetalert2";

// থানা অবজেক্টের টাইপ ডেফিনিশন (TypeScript Interface)
interface PoliceStation {
  _id: string;
  thanaName: string;
  location?: string;
  ocName?: string;
  ocNumber?: string;
  dutyOfficer?: string;
  controlRoom?: string;
  isDeleted?: boolean;
}

// ১. প্রিমিয়াম টেবিল লোডিং কঙ্কাল (Skeleton Loader)
const TableSkeleton = () => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 w-1/4">
            <div className="w-8 h-8 rounded-xl bg-gray-200 flex-shrink-0" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-1/4 hidden md:block" />
          <div className="h-4 bg-gray-200 rounded w-1/6" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
      ))}
    </div>
  );
};

const AllPolice = () => {
  // ২. রিডাক্স কোয়েরি ও মিউটেশন (RTK Query)
  const {
    data: policeRes,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllPoliceQuery(undefined, {
    pollingInterval: 60000, // ১ মিনিট পর পর অটো-রিফ্রেশ
    refetchOnFocus: true,
  });

  const [deletePolice, { isLoading: isDeleting }] = useDeletePoliceMutation();

  // ৩. স্টেট ম্যানেজমেন্ট
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ৪. মেমোরাইজড ডাটা এক্সট্র্যাক্ট (পারফরম্যান্স বুস্ট)
  const policeList = useMemo<PoliceStation[]>(() => {
    if (!policeRes) return [];
    return policeRes.data || (Array.isArray(policeRes) ? policeRes : []);
  }, [policeRes]);

  // ৫. লাইভ সার্চ ফিল্টারিং লজিক (অপ্রয়োজনীয় রেন্ডার এড়াতে useMemo)
  const filteredPolice = useMemo(() => {
    return policeList.filter((police) => {
      if (police?.isDeleted) return false;
      if (!searchQuery) return true;

      const name = police?.thanaName?.toLowerCase() || "";
      const loc = police?.location?.toLowerCase() || "";
      const oc = police?.ocName?.toLowerCase() || "";
      const num = police?.ocNumber || "";
      const duty = police?.dutyOfficer || "";
      const control = police?.controlRoom || "";
      const query = searchQuery.toLowerCase();

      return (
        name.includes(query) ||
        loc.includes(query) ||
        oc.includes(query) ||
        num.includes(query) ||
        duty.includes(query) ||
        control.includes(query)
      );
    });
  }, [policeList, searchQuery]);

  // ৬. পেজিনেশন লজিক ক্যালকুলেশন
  const totalItems = filteredPolice.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const currentPoliceData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredPolice.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredPolice, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // সার্চ করলে রি-সেট হয়ে ১ম পেজে যাবে
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "মুছে ফেলার পর এই থানার তথ্য আর ফিরে পাওয়া যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // লাল রঙের ডিলিট বাটন
      cancelButtonColor: "#3085d6", // নীল রঙের ক্যানসেল বাটন
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "না, থাক",
      background: "#ffffff",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-4 py-2 text-sm font-semibold",
        cancelButton: "rounded-xl px-4 py-2 text-sm font-semibold",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePolice(id).unwrap();

          Swal.fire({
            title: "মুছে ফেলা হয়েছে!",
            text: "থানাটি সফলভাবে তালিকা থেকে বাদ দেওয়া হয়েছে।",
            icon: "success",
            confirmButtonColor: "#2563eb",
            customClass: {
              popup: "rounded-2xl",
              confirmButton: "rounded-xl px-4 py-2 text-sm font-semibold",
            },
          });
        } catch (err) {
          console.error("মুছে ফেলতে ব্যর্থ হয়েছে:", err);

          Swal.fire({
            title: "উফ! একটি সমস্যা হয়েছে",
            text: "থানাটি মুছে ফেলা যায়নি। আবার চেষ্টা করুন।",
            icon: "error",
            confirmButtonColor: "#2563eb",
            customClass: {
              popup: "rounded-2xl",
              confirmButton: "rounded-xl px-4 py-2 text-sm font-semibold",
            },
          });
        }
      }
    });
  };

  // ৮. ডাইনামিক এপিআই এরর মেসেজ হ্যান্ডলার (TS2322 টাইপ এরর ফিক্সড)
  const getErrorMessage = () => {
    if (!error) return "একটি অজানা সমস্যা দেখা দিয়েছে।";

    // FetchBaseQueryError টাইপ চেক
    if (typeof error === "object" && "status" in error) {
      if (error.status === "FETCH_ERROR")
        return "সার্ভারের সাথে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে আপনার ইন্টারনেট কানেকশন বা ব্যাকএন্ড চেক করুন।";
      if (error.status === 401)
        return "আপনার সেশন শেষ হয়ে গেছে। অনুগ্রহ করে আবার লগইন করুন।";
      if (error.status === 403)
        return "আপনার এই তথ্য অ্যাক্সেস করার অনুমতি নেই।";
      return `সার্ভার ত্রুটি কোড: ${error.status}`;
    }

    // SerializedError টাইপ চেক
    if (typeof error === "object" && "message" in error) {
      return (error as any).message || "নেটওয়ার্ক ত্রুটি ঘটেছে।";
    }

    return "নেটওয়ার্ক ত্রুটি ঘটেছে।";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 text-gray-800 antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* হেডার সেকশন */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
              <FiShield className="text-blue-600 fill-blue-50 flex-shrink-0" />
              থানা তালিকা {!isLoading && !isError && `(${totalItems})`}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              নাগরিক সুরক্ষায় বিভিন্ন থানা, ফাঁড়ি এবং দায়িত্বরত কর্মকর্তাদের
              যোগাযোগ নম্বর ব্যবস্থাপনা।
            </p>
          </div>
          <Link
            to="/dashboard/add-station"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-95 active:scale-95 transition-all shadow-md shadow-blue-100 no-underline whitespace-nowrap"
          >
            <FiPlus size={16} />
            নতুন স্টেশন যোগ করুন
          </Link>
        </div>

        {/* সার্চ বার */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="থানার নাম, ওসির নাম, অবস্থান বা যেকোনো ফোন নম্বর দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-50 text-gray-900 text-sm pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* মেইন ডাটা ভিউ রেন্ডারিং */}
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-red-100 p-6 shadow-sm text-center max-w-xl mx-auto">
            <div className="p-3 bg-red-50 text-red-500 rounded-full mb-3">
              <FiAlertCircle size={32} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">
              উফ! ডেটা লোড করা যায়নি
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-5 max-w-sm">
              {getErrorMessage()}
            </p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 active:scale-95 transition-all"
            >
              <FiRefreshCw size={14} /> আবার চেষ্টা করুন
            </button>
          </div>
        ) : currentPoliceData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center">
            <FiSearch size={40} className="text-gray-300 mb-2" />
            <h3 className="text-gray-600 font-bold text-base">
              কোনো তথ্য পাওয়া যায়নি
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              ভিন্ন কোনো কিওয়ার্ড ব্যবহার করে ট্রাই করুন।
            </p>
          </div>
        ) : (
          <>
            {/* ১. মোবাইল কার্ড ভিউ */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              <AnimatePresence mode="popLayout">
                {currentPoliceData.map((police, index) => (
                  <motion.div
                    key={police?._id || `card-${index}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                          <FiShield size={14} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base capitalize">
                          {police?.thanaName}
                        </h3>
                      </div>
                      <button
                        disabled={isDeleting}
                        onClick={() => handleDelete(police?._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-600 pt-1 border-t border-gray-50">
                      <div className="flex items-center gap-1.5">
                        <FiMapPin
                          className="text-gray-400 flex-shrink-0"
                          size={14}
                        />
                        <span>{police?.location || "ঠিকানা দেওয়া নেই"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiUser
                          className="text-gray-400 flex-shrink-0"
                          size={14}
                        />
                        <span>
                          OC:{" "}
                          <strong className="text-gray-800">
                            {police?.ocName || "নেই"}
                          </strong>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-dotted border-gray-100">
                        <div>
                          <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">
                            OC Number
                          </p>
                          <p className="font-mono font-bold text-gray-900 mt-0.5">
                            {police?.ocNumber || "নেই"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">
                            Control Room
                          </p>
                          <p className="font-mono font-bold text-blue-600 mt-0.5">
                            {police?.controlRoom || "নেই"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ২. ডেক্সটপ টেবিল ভিউ */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto min-h-[535px] flex flex-col justify-between">
                <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-4 px-6 w-[22%]">থানা / ফাঁড়ির নাম</th>
                      <th className="py-4 px-6 w-[26%]">অবস্থান</th>
                      <th className="py-4 px-6 w-[20%]">ওসি ও নম্বর</th>
                      <th className="py-4 px-6 w-[13%]">ডিউটি অফিসার</th>
                      <th className="py-4 px-6 w-[13%]">কন্ট্রোল রুম</th>
                      <th className="py-4 px-6 text-center w-[6%]">অ্যাকশন</th>
                    </tr>
                  </thead>

                  <motion.tbody
                    layout
                    className="divide-y divide-gray-50 text-sm text-gray-700"
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      {currentPoliceData.map((police, index) => (
                        <motion.tr
                          key={police?._id || `row-${index}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="hover:bg-gray-50/40 transition-colors h-[49px]"
                        >
                          {/* কলাম ১: থানা নাম */}
                          <td className="py-3 px-6 w-[22%] truncate">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shadow-inner flex-shrink-0">
                                <FiShield size={14} />
                              </div>
                              <p
                                className="font-bold text-gray-900 leading-none capitalize truncate"
                                title={police?.thanaName}
                              >
                                {police?.thanaName}
                              </p>
                            </div>
                          </td>

                          {/* কলাম ২: লোকেশন */}
                          <td className="py-3 px-6 w-[26%] truncate">
                            <span
                              className="flex items-center gap-1.5 text-gray-600 text-[13px] truncate"
                              title={police?.location}
                            >
                              <FiMapPin
                                className="text-gray-400 flex-shrink-0"
                                size={14}
                              />
                              <span className="truncate">
                                {police?.location}
                              </span>
                            </span>
                          </td>

                          {/* কলাম ৩: ওসি ইনফো */}
                          <td className="py-3 px-6 w-[20%] truncate">
                            <div className="flex flex-col justify-center overflow-hidden leading-tight">
                              {police?.ocName && (
                                <span
                                  className="text-[13px] font-semibold text-gray-700 flex items-center gap-1 truncate"
                                  title={police.ocName}
                                >
                                  <FiUser
                                    size={12}
                                    className="text-gray-400 flex-shrink-0"
                                  />
                                  <span className="truncate">
                                    {police.ocName}
                                  </span>
                                </span>
                              )}
                              <span className="flex items-center gap-1 font-mono font-medium text-gray-500 text-[12px] mt-0.5">
                                <FiPhone size={11} className="flex-shrink-0" />
                                {police?.ocNumber || "নেই"}
                              </span>
                            </div>
                          </td>

                          {/* কলাম ৪: ডিউটি অফিসার */}
                          <td className="py-3 px-6 w-[13%] font-mono font-medium text-gray-900 whitespace-nowrap truncate">
                            {police?.dutyOfficer ? (
                              <span className="flex items-center gap-1">
                                <FiPhone size={12} className="text-gray-400" />
                                {police.dutyOfficer}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">নেই</span>
                            )}
                          </td>

                          {/* কলাম ৫: কন্ট্রোল রুম */}
                          <td className="py-3 px-3 w-[13%] font-mono font-medium text-blue-600 whitespace-nowrap truncate">
                            {police?.controlRoom ? (
                              <span className="flex items-center gap-1">
                                <FiPhone size={12} className="text-blue-400" />
                                {police.controlRoom}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">নেই</span>
                            )}
                          </td>

                          {/* কলাম ৬: অ্যাকশন বাটন */}
                          <td className="py-3 px-6 w-[6%] text-center">
                            <button
                              disabled={isDeleting}
                              onClick={() => handleDelete(police?._id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </motion.tbody>
                </table>
              </div>
            </div>

            {/* পেজিনেশন কন্ট্রোল ইউআই */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs sm:text-sm text-gray-500 font-medium text-center sm:text-left">
                  মোট{" "}
                  <span className="text-gray-900 font-bold">{totalItems}</span>{" "}
                  টি ডাটার মধ্যে{" "}
                  <span className="text-gray-900 font-bold">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  -{" "}
                  <span className="text-gray-900 font-bold">
                    {currentPage * itemsPerPage > totalItems
                      ? totalItems
                      : currentPage * itemsPerPage}
                  </span>{" "}
                  দেখানো হচ্ছে
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-gray-200 transition-all text-gray-600 bg-white hover:bg-gray-50 disabled:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-1 max-w-[200px] sm:max-w-none overflow-x-auto">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 text-xs font-bold rounded-xl transition-all ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                              : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border border-gray-200 transition-all text-gray-600 bg-white hover:bg-gray-50 disabled:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllPolice;
