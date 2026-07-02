
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
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useGetAllDonorsQuery } from "../../Redux/features/admin/adminApi";

const AllDonors = () => {
  // ১. Redux API থেকে ডাটা ফেচ করা
  const {
    data: donorsRes,
    isLoading,
    isError,
  } = useGetAllDonorsQuery(undefined);

  // ২. লোকাল ফিল্টারিং স্টেটসমূহ
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("All");
  const [selectedThana, setSelectedThana] = useState<string>("All");

  // 📄 পেজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12; // প্রতি পেজে ১২টি ডাটা

  // ডোনারদের লিস্ট এক্সট্র্যাক্ট করা
  const donorsList = donorsRes?.data || donorsRes || [];

  // ফিল্টার অপশনস
  const bloodGroups = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const thanas = [
    { name: "সব থানা (All Thanas)", value: "All" },
    { name: "বরিশাল সদর (Barisal Sadar)", value: "sadar|সদর" },
    { name: "বাকেরগঞ্জ (Bakerganj)", value: "bakerganj|বাকেরগঞ্জ" },
    { name: "উজিরপুর (Wazirpur)", value: "wazirpur|উজিরপুর" },
    { name: "বাবুগঞ্জ (Babuganj)", value: "babuganj|বাবুগঞ্জ" },
    { name: "বানারীপাড়া (Banaripara)", value: "banaripara|বানারীপাড়া" },
    { name: "গৌরনদী (Gournadi)", value: "gournadi|গৌরনদী" },
    { name: "আগৈলঝারা (Agailjhara)", value: "agailjhara|আগৈলঝারা" },
    { name: "মেহেন্দিগঞ্জ (Mehendiganj)", value: "mehendiganj|মেহেন্দিগঞ্জ" },
    { name: "মুলাদী (Muladi)", value: "muladi|মুলাদী" },
    { name: "হিজলা (Hizla)", value: "hizla|হিজলা" },
  ];

  // ৪. লাইভ সার্চ, ব্লাড গ্রুপ এবং থানা ফিল্টারিং লজিক
  const filteredDonors = donorsList.filter((donor: any) => {
    const matchesSearch =
      donor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor?.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof donor?.phone === "string"
        ? donor?.phone.includes(searchQuery)
        : donor?.phone?.some((p: string) => p.includes(searchQuery)));

    const matchesGroup =
      selectedBloodGroup === "All" || donor?.bloodGroup === selectedBloodGroup;

    const matchesThana =
      selectedThana === "All" ||
      selectedThana
        .split("|")
        .some((val) => donor?.area?.toLowerCase().includes(val.toLowerCase()));

    return matchesSearch && matchesGroup && matchesThana && !donor?.isDeleted;
  });

  // 🧮 পেজিনেশন লজিক (ফিল্টার করা ডাটার ওপর ভিত্তি করে)
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);

  // কারেন্ট পেজের জন্য ডাটা স্লাইস (Slice) করা
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDonors = filteredDonors.slice(indexOfFirstItem, indexOfLastItem);

  // ফিল্টার চেঞ্জ হলে পেজ নম্বর ১-এ রিসেট করার ফাংশন
  const handleThanaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedThana(e.target.value);
    setCurrentPage(1);
  };

  const handleBloodGroupChange = (group: string) => {
    setSelectedBloodGroup(group);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

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
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* লাইভ সার্চ ইনপুট */}
            <div className="relative md:col-span-2">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="নাম, এলাকা বা মোবাইল নম্বর দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-gray-50 text-gray-900 text-sm pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:bg-white focus:ring-1 focus:ring-rose-500 outline-none transition-all"
              />
            </div>

            {/* থানা ফিল্টার ড্রপডাউন */}
            <div className="relative">
              <FiFilter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <select
                value={selectedThana}
                onChange={handleThanaChange}
                className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:bg-white focus:ring-1 focus:ring-rose-500 outline-none transition-all appearance-none cursor-pointer font-medium"
              >
                {thanas.map((thana) => (
                  <option key={thana.value} value={thana.value}>
                    {thana.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* রক্তের গ্রুপ ভিত্তিক কুইক ফিল্টার বাটন */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar border-t border-gray-100/70">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 hidden sm:inline">
              গ্রুপ ফিল্টার:
            </span>
            {bloodGroups.map((group) => (
              <button
                key={group}
                onClick={() => handleBloodGroupChange(group)}
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

        {/* ৫. মেইন ডাটা ভিউ এবং লজিক্যাল রেন্ডারিং */}
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
              অনুগ্রহ করে আপনার internet কানেকশন চেক করুন।
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
          <>
            {/* রেসপন্সিভ ডাটা টেবিল */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-4 px-6">রক্তদাতা</th>
                      <th className="py-4 px-4 text-center">গ্রুপ</th>
                      <th className="py-4 px-6">এলাকা</th>
                      <th className="py-4 px-6">যোগাযোগ</th>
                      <th className="py-4 px-6 text-center">
                        রক্তদানের যোগ্যতা
                      </th>
                      <th className="py-4 px-6 text-center">সর্বশেষ দান</th>
                      <th className="py-4 px-6 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                    <AnimatePresence mode="popLayout">
                      {currentDonors.map((donor: any) => (
                        <motion.tr
                          key={donor._id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                                {donor?.name?.substring(0, 2)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 leading-none">
                                  {donor?.name}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center justify-center bg-red-50 text-red-600 font-extrabold px-3 py-1 rounded-lg text-xs tracking-wider border border-red-100 min-w-[45px]">
                              {donor?.bloodGroup || "O+"}
                            </span>
                          </td>

                          <td className="py-4 px-6">
                            <span className="flex items-center gap-1.5 text-gray-600 text-[13px] capitalize">
                              <FiMapPin className="text-gray-400" size={14} />
                              {donor?.area}
                            </span>
                          </td>

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
                                  <FiPhone
                                    className="text-gray-400"
                                    size={13}
                                  />
                                  {donor?.phone}
                                </span>
                              )}
                            </div>
                          </td>

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

                          <td className="py-4 px-6 text-center">
                            <span className="flex items-center justify-center gap-1.5 text-gray-500 text-xs">
                              <FiCalendar className="text-gray-400" size={14} />
                              {donor?.lastDonationDate
                                ? new Date(
                                    donor.lastDonationDate,
                                  ).toLocaleDateString("bn-BD")
                                : "কোনো তথ্য নেই"}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-center">
                            <button
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

            {/* 🎯 পেজিনেশন কন্ট্রোল UI */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-sm text-gray-500">
                  মোট{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredDonors.length}
                  </span>{" "}
                  জনের মধ্যে{" "}
                  <span className="font-semibold text-gray-900">
                    {indexOfFirstItem + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-semibold text-gray-900">
                    {indexOfLastItem > filteredDonors.length
                      ? filteredDonors.length
                      : indexOfLastItem}
                  </span>{" "}
                  দেখানো হচ্ছে
                </div>

                <div className="flex items-center gap-2">
                  {/* আগের পেজ বাটন */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  >
                    <FiChevronLeft size={18} />
                  </button>

                  {/* পেজ নাম্বার বাটনসমূহ */}
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        currentPage === page
                          ? "bg-rose-500 text-white shadow-sm shadow-rose-100"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* পরের পেজ বাটন */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  >
                    <FiChevronRight size={18} />
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

export default AllDonors;
