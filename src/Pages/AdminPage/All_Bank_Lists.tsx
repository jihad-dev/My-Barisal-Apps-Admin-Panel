import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiPhone,
  FiMapPin,
  FiSearch,
  FiPlus,
  FiLayers,
  FiLoader,
  FiAlertCircle,
  FiCreditCard,
  FiHash,
} from "react-icons/fi";
import { useGetAllBanksQuery } from "../../Redux/features/admin/adminApi";

// ১. আপনার রিয়েল ডাটা অবজেক্ট অনুযায়ী ইন্টারফেস আপডেট
interface BankData {
  _id: string;
  name: string;
  branch: string;
  routingNumber: string;
  address: string;
  phone: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const All_Bank_Lists = () => {
  // Redux API থেকে ব্যাংক ডেটা ফেচিং
  const {
    data: banksData,
    isLoading,
    isError,
  } = useGetAllBanksQuery(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-gray-500">
        <FiLoader size={35} className="animate-spin text-indigo-600" />
        <span className="text-sm font-bold">
          ব্যাংক সমূহের তালিকা লোড হচ্ছে...
        </span>
      </div>
    );
  }

  if (isError || !banksData) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2 text-rose-500 bg-rose-50/50 rounded-2xl border border-rose-100 p-6 max-w-xl mx-auto mt-10">
        <FiAlertCircle size={40} />
        <h3 className="font-black text-base">ডেটা লোড করতে সমস্যা হয়েছে!</h3>
        <p className="text-xs text-gray-500 text-center">
          অনুগ্রহ করে পেজটি রিফ্রেশ করুন অথবা সার্ভার কানেকশন চেক করুন।
        </p>
      </div>
    );
  }

  // ডেটা এক্সট্র্যাক্ট এবং ডিলিট হওয়া ডেটা এক্সক্লুড করা
  const rawBanks: BankData[] = banksData?.data || banksData || [];
  const banks = rawBanks.filter((bank) => !bank.isDeleted);

  // ২. রিয়েল-টাইম সার্চ ফিল্টারিং লজিক (ব্যাংকের নাম, ব্রাঞ্চ বা রাউটিং নম্বর দিয়ে)
  const filteredBanks = banks.filter((bank) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      bank.name?.toLowerCase().includes(searchLower) ||
      bank.branch?.toLowerCase().includes(searchLower) ||
      bank.routingNumber?.includes(searchLower)
    );
  });

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
                My Barisal ডিরেক্টরির সব ব্যাংক, রাউটিং নম্বর ও অফিসিয়াল যোগাযোগ
                মাধ্যম।
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

        {/* সার্চ বার ফিল্টার সেকশন */}
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="ব্যাংক, ব্রাঞ্চ বা রাউটিং নম্বর দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium shadow-sm"
          />
        </div>

        {/* ব্যাংক কার্ড গ্রিড ভিউ */}
        {filteredBanks.length === 0 ? (
          <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 shadow-sm">
            <p className="text-sm font-bold text-gray-400">
              আপনার সার্চ করা তথ্যের কোনো ব্যাংক পাওয়া যায়নি!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBanks.map((bank, idx) => (
              <motion.div
                key={bank._id || idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200/80 transition-all flex flex-col overflow-hidden group"
              >
                {/* কার্ড কন্টেন্ট */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="font-black text-gray-900 text-base group-hover:text-indigo-600 transition-colors leading-tight">
                        {bank.name}
                      </h3>
                      <p className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider">
                        {bank.branch}
                      </p>
                    </div>

                    {/* 🟢 লাইভ ব্লিংকিং অ্যাক্টিভ ইন্ডিকেটর */}
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
                              <FiPhone size={12} className="text-gray-400" />
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
          </div>
        )}
      </div>
    </div>
  );
};

export default All_Bank_Lists;
