import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiTrash2,
  FiPlus,
  FiDroplet,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiAlertCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useGetAllDonorsQuery } from "../../Redux/features/admin/adminApi";
import { toast } from "sonner";

const AllDonors = () => {
  const {
    data: donorsRes,
    isLoading,
    isError,
  } = useGetAllDonorsQuery(undefined);
  //   const [deleteDonor] = useDeleteDonorMutation();
  console.log(donorsRes?.data);

  // ২. লোকাল ফিল্টারিং স্টেট
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("All");

  // ডোনারদের লিস্ট এক্সট্র্যাক্ট করা (ব্যাকএন্ড রেসপন্স স্ট্রাকচার অনুযায়ী)
  const donorsList = donorsRes?.data || donorsRes || [];

  // ব্লাড গ্রুপ অপশনস
  const bloodGroups = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  // ৩. ডিলিট হ্যান্ডলার লজিক
  //   const handleDelete = async (id: string) => {
  //     if (
  //       !window.confirm(
  //         "আপনি কি নিশ্চিতভাবে এই রক্তদাতার প্রোফাইলটি মুছে ফেলতে চান?",
  //       )
  //     )
  //       return;

  //     let toastId = "";
  //     try {
  //       toastId = toast.loading("রক্তদাতার ডাটা মোছা হচ্ছে...");
  //       await deleteDonor(id).unwrap();
  //       toast.success("সফলভাবে রক্তদাতার ডাটা মুছে ফেলা হয়েছে", { id: toastId });
  //     } catch (error: any) {
  //       toast.error(error?.data?.message || "ডাটা মুছতে ব্যর্থ হয়েছে", {
  //         id: toastId,
  //       });
  //     }
  //   };

  // ৪. সার্চ এবং ফিল্টারিং লজিক (লাইভ ফিল্টার)
  const filteredDonors = donorsList.filter((donor: any) => {
    // 💡 FIX: donor.phone যদি স্ট্রিং হয় তবে সরাসরি .includes ব্যবহার হবে, অ্যারে হলে .some
    const matchesSearch =
      donor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor?.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof donor?.phone === "string"
        ? donor?.phone.includes(searchQuery)
        : donor?.phone?.some((p: string) => p.includes(searchQuery)));

    const matchesGroup =
      selectedBloodGroup === "All" || donor?.bloodGroup === selectedBloodGroup;

    return matchesSearch && matchesGroup && !donor?.isDeleted;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* হেডার সেকশন */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <FiDroplet className="text-rose-500 fill-rose-50" /> রক্তদাতাদের
              তালিকা ({filteredDonors.length})
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              জরুরি মুহূর্তে রক্তদাতাদের বিবরণ, রক্তের গ্রুপ অনুসন্ধান এবং
              ডাটাবেজ আপডেট করার ড্যাশবোর্ড।
            </p>
          </div>
          <Link
            to="/dashboard/add-donor"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-rose-700 hover:to-red-700 transition-all shadow-md shadow-rose-100 no-underline whitespace-nowrap"
          >
            <FiPlus size={16} />
            নতুন দাতা যোগ করুন
          </Link>
        </div>

        {/* সার্চ এবং ফিল্টার কন্ট্রোল বার */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="নাম, এলাকা বা মোবাইল নম্বর দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 text-sm pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:bg-white focus:ring-1 focus:ring-rose-500 outline-none transition-all"
            />
          </div>

          {/* রক্তের গ্রুপ ভিত্তিক কুইক ফিল্টার বাটন */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 hidden sm:inline">
              গ্রুপ ফিল্টার:
            </span>
            {bloodGroups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedBloodGroup(group)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                  selectedBloodGroup === group
                    ? "bg-rose-500 border-rose-500 text-white shadow-sm shadow-rose-100"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* মেইন ডাটা ভিউ বা লজিক্যাল রেন্ডারিং */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            <p className="text-sm font-medium text-gray-500">
              ডোনার ডাটা লোড হচ্ছে...
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-rose-100 text-rose-600 p-6 shadow-sm text-center">
            <FiAlertCircle size={36} className="mb-2 text-rose-500" />
            <h3 className="font-bold">ডাটাবেজ কানেকশন সমস্যা!</h3>
            <p className="text-xs text-rose-400 mt-1">
              অনুগ্রহ করে আপনার ইন্টারনেট কানেকশন চেক করুন বা ব্যাকএন্ড রিফ্রেশ
              করুন।
            </p>
          </div>
        ) : filteredDonors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center">
            <FiSearch size={40} className="text-gray-300 mb-2" />
            <h3 className="text-gray-600 font-bold text-base">
              কোনো রক্তদাতার ডাটা পাওয়া যায়নি
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
                    <th className="py-4 px-6">রক্তদাতা</th>
                    <th className="py-4 px-4 text-center">গ্রুপ</th>
                    <th className="py-4 px-6">এলাকা</th>
                    <th className="py-4 px-6">যোগাযোগ</th>
                    <th className="py-4 px-6 text-center">রক্তদানের যোগ্যতা</th>
                    <th className="py-4 px-6 text-center">সর্বশেষ দান</th>
                    <th className="py-4 px-6 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                  <AnimatePresence>
                    {filteredDonors.map((donor: any) => (
                      <motion.tr
                        key={donor._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        {/* ডোনারের নাম */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                              {donor?.name?.substring(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 leading-none">
                                {donor?.name}
                              </p>
                              <span className="text-[10px] text-gray-400 mt-1 inline-block">
                                ID: ...{donor?._id?.substring(18)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* ব্লাড গ্রুপ ব্যাজ */}
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center justify-center bg-red-50 text-red-600 font-extrabold px-3 py-1 rounded-lg text-xs tracking-wider border border-red-100 min-w-[45px]">
                            {donor?.bloodGroup || "O+"}
                          </span>
                        </td>

                        {/* এলাকা */}
                        <td className="py-4 px-6">
                          <span className="flex items-center gap-1.5 text-gray-600 text-[13px]">
                            <FiMapPin className="text-gray-400" size={14} />
                            {donor?.area}
                          </span>
                        </td>

                        {/* ফোন নাম্বার (💡 FIX: Array এবং String দুইটার সেফ হ্যান্ডলিং) */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            {Array.isArray(donor?.phone) ? (
                              donor.phone.map((p: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="flex items-center gap-1.5 text-gray-900 text-[13px] font-medium font-mono"
                                >
                                  <FiPhone
                                    className="text-gray-400"
                                    size={13}
                                  />
                                  {p}
                                </span>
                              ))
                            ) : (
                              <span className="flex items-center gap-1.5 text-gray-900 text-[13px] font-medium font-mono">
                                <FiPhone className="text-gray-400" size={13} />
                                {donor?.phone}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* রক্তদানের যোগ্যতা (💡 নতুন ডাইনামিক স্ট্যাটাস ব্যাজ) */}
                        <td className="py-4 px-6 text-center">
                          {donor?.canDonate ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              প্রস্তুত (Available)
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              বাকি {donor?.daysRemaining || 0} দিন
                            </span>
                          )}
                        </td>

                        {/* সর্বশেষ রক্তদানের তারিখ */}
                        <td className="py-4 px-6 text-center">
                          <span className="flex items-center justify-center gap-1.5 text-gray-500 text-xs">
                            <FiCalendar className="text-gray-400" size={14} />
                            {donor?.lastDonationDate
                              ? new Date(
                                  donor.lastDonationDate,
                                ).toLocaleDateString("bn-BD")
                              : "정보 없음"}
                          </span>
                        </td>

                        {/* অ্যাকশন বাটন */}
                        <td className="py-4 px-6 text-center">
                          <button
                            // onClick={() => handleDelete(donor._id)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-all"
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

export default AllDonors;
