import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiTrash2,
  FiPlus,
  FiShield,
  FiPhone,
  FiMapPin,
  FiAlertCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  useGetAllPoliceQuery,

} from "../../Redux/features/admin/adminApi";
import { toast } from "sonner";

const AllPolice = () => {
  // ১. রিডাক্স কুয়েরি এবং মিউটেশন হুক
  const { data: policeRes, isLoading, isError } = useGetAllPoliceQuery();
//   const [deletePolice] = useDeletePoliceMutation();

  // ২. সার্চ ফিল্টারিং স্টেট
  const [searchQuery, setSearchQuery] = useState("");

  // ডাটা এক্সট্র্যাক্ট করা (রেসপন্স স্ট্রাকচার অনুযায়ী)
  const policeList = policeRes?.data || policeRes || [];

  // ৩. ডিলিট হ্যান্ডলার লজিক
//   const handleDelete = async (id: string) => {
//     if (
//       !window.confirm(
//         "আপনি কি নিশ্চিতভাবে এই পুলিশ স্টেশনের ডাটাটি মুছে ফেলতে চান?",
//       )
//     )
//       return;

//     let toastId = "";
//     try {
//       toastId = toast.loading("থানা/স্টেশনের ডাটা মোছা হচ্ছে...");
//       await deletePolice(id).unwrap();
//       toast.success("সফলভাবে পুলিশ স্টেশনের ডাটা মুছে ফেলা হয়েছে", {
//         id: toastId,
//       });
//     } catch (error: any) {
//       toast.error(error?.data?.message || "ডাটা মুছতে ব্যর্থ হয়েছে", {
//         id: toastId,
//       });
//     }
//   };

  // ৪. লাইভ সার্চ ফিল্টারিং লজিক (আপনার নতুন ডাটা স্কিমা অনুযায়ী আপডেট করা)
  const filteredPolice = policeList?.filter((police: any) => {
    const matchesSearch =
      police?.thanaName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      police?.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      police?.ocNumber?.includes(searchQuery) ||
      police?.dutyOfficer?.includes(searchQuery) ||
      police?.controlRoom?.includes(searchQuery);

    return matchesSearch && !police?.isDeleted;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* হেডার সেকশন */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <FiShield className="text-blue-600 fill-blue-50" /> পুলিশ
              স্টেশন/থানা তালিকা ({filteredPolice?.length || 0})
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              নাগরিক সুরক্ষায় বিভিন্ন থানা, ফাঁড়ি, দ্বায়িত্বরত কর্মকর্তা এবং
              জরুরি যোগাযোগ নম্বর ব্যবস্থাপনার ড্যাশবোর্ড।
            </p>
          </div>
          <Link
            to="/dashboard/add-station"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-100 no-underline whitespace-nowrap"
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
              placeholder="থানার নাম, অবস্থান বা যেকোনো ফোন নম্বর দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 text-sm pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* ডাটা ভিউ বা লজিক্যাল রেন্ডারিং */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm font-medium text-gray-500">
              ডাটা লোড হচ্ছে...
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-blue-100 text-blue-600 p-6 shadow-sm text-center">
            <FiAlertCircle size={36} className="mb-2 text-blue-500" />
            <h3 className="font-bold">ডাটাবেজ কানেকশন সমস্যা!</h3>
            <p className="text-xs text-blue-400 mt-1">
              অনুগ্রহ করে আপনার ইন্টারনেট কানেকশন চেক করুন বা ব্যাকএন্ড রিফ্রেশ
              করুন।
            </p>
          </div>
        ) : filteredPolice.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center">
            <FiSearch size={40} className="text-gray-300 mb-2" />
            <h3 className="text-gray-600 font-bold text-base">
              কোনো পুলিশ স্টেশনের ডাটা পাওয়া যায়নি
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              আপনার সার্চ কোয়েরি পরিবর্তন করুন অথবা নতুন ডাটা এন্ট্রি করুন।
            </p>
          </div>
        ) : (
          /* রেসপন্সিভ ডাটা টেবিল */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-4 px-6">থানা / ফাঁড়ির নাম</th>
                    <th className="py-4 px-6">অবস্থান</th>
                    <th className="py-4 px-6">ওসি নম্বর</th>
                    <th className="py-4 px-6">ডিউটি অফিসার</th>
                    <th className="py-4 px-6">কন্ট্রোল রুম</th>
                    <th className="py-4 px-6 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                  <AnimatePresence>
                    {filteredPolice?.map((police: any) => (
                      <motion.tr
                        key={police?._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        {/* থানার নাম */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shadow-inner flex-shrink-0">
                              <FiShield size={16} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 leading-none">
                                {police?.thanaName}
                              </p>
                              <span className="text-[10px] text-gray-400 mt-1 inline-block">
                                ID: ...{police?._id?.substring(18)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* অবস্থান */}
                        <td className="py-4 px-6">
                          <span className="flex items-center gap-1.5 text-gray-600 text-[13px]">
                            <FiMapPin
                              className="text-gray-400 flex-shrink-0"
                              size={14}
                            />
                            {police?.location}
                          </span>
                        </td>

                        {/* ওসি নম্বর */}
                        <td className="py-4 px-6 font-mono font-medium text-gray-900">
                          {police?.ocNumber ? (
                            <span className="flex items-center gap-1">
                              <FiPhone size={12} className="text-gray-400" />{" "}
                              {police.ocNumber}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">নেই</span>
                          )}
                        </td>

                        {/* ডিউটি অফিসার নম্বর */}
                        <td className="py-4 px-6 font-mono font-medium text-gray-900">
                          {police?.dutyOfficer ? (
                            <span className="flex items-center gap-1">
                              <FiPhone size={12} className="text-gray-400" />{" "}
                              {police.dutyOfficer}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">নেই</span>
                          )}
                        </td>

                        {/* কন্ট্রোল রুম নম্বর */}
                        <td className="py-4 px-6 font-mono font-medium text-blue-600">
                          {police?.controlRoom ? (
                            <span className="flex items-center gap-1">
                              <FiPhone size={12} className="text-blue-400" />{" "}
                              {police.controlRoom}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">নেই</span>
                          )}
                        </td>

                        {/* অ্যাকশন বাটন */}
                        <td className="py-4 px-6 text-center">
                          <button
                            // onClick={() => handleDelete(police?._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-all"
                            title="মুছে ফেলুন"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPolice;
