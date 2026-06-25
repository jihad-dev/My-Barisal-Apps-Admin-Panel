import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiShield,
  FiPhone,
  FiMapPin,
  FiSearch,
  FiPlus,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import { useGetAllFireStationQuery } from "../../Redux/features/admin/adminApi";

// ফায়ার সার্ভিসের ইন্টারফেস
interface FireStation {
  _id: string;
  name: string;
  type: string;
  status: string;
  area: string;
  phone: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const All_Fire_Service_Station = () => {
  const {
    data: fireStationsData,
    isLoading,
    isError,
  } = useGetAllFireStationQuery(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-gray-500">
        <FiLoader size={35} className="animate-spin text-indigo-600" />
        <span className="text-sm font-bold">
          ফায়ার সার্ভিস স্টেশন ডেটা লোড হচ্ছে...
        </span>
      </div>
    );
  }

  if (isError || !fireStationsData) {
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

  const rawStations: FireStation[] =
    fireStationsData?.data || fireStationsData || [];
  const stations = rawStations.filter((station) => !station.isDeleted);

  // সার্চ ফিল্টারিং
  const filteredStations = stations.filter((station) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      station.name?.toLowerCase().includes(searchLower) ||
      station.area?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* হেডার প্যানেল */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
              <FiShield size={24} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                ফায়ার সার্ভিস স্টেশনসমূহ
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                বরিশাল বিভাগের সব একটিভ ফায়ার সার্ভিস ও সিভিল ডিফেন্স স্টেশনের
                তালিকা ও জরুরি কন্টাক্ট।
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/add-fire-station"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold text-xs shadow-md shadow-rose-600/10 hover:shadow-lg hover:shadow-rose-600/20 active:scale-[0.98] transition-all no-underline"
          >
            <FiPlus size={16} /> নতুন স্টেশন যুক্ত করুন
          </Link>
        </div>

        {/* সার্চ বার */}
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="স্টেশনের নাম বা এলাকা দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 outline-none transition-all font-medium shadow-sm"
          />
        </div>

        {/* গ্রিড ভিউ */}
        {filteredStations.length === 0 ? (
          <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 shadow-sm">
            <p className="text-sm font-bold text-gray-400">
              আপনার সার্চ করা নামের কোনো ফায়ার স্টেশন পাওয়া যায়নি!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStations.map((station, idx) => (
              <motion.div
                key={station._id || idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200/80 transition-all flex flex-col overflow-hidden group"
              >
                {/* কার্ড কন্টেন্ট */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="font-black text-gray-900 text-base group-hover:text-rose-600 transition-colors leading-tight">
                        {station.name}
                      </h3>
                      <p className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider">
                        {station.type}
                      </p>
                    </div>

                    {/* 🟢 লাইভ ব্লিংকিং অ্যাক্টিভ ইন্ডিকেটর ইন্ডিকেটর */}
                    <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/80 flex items-center gap-1.5 flex-shrink-0 shadow-sm select-none">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      {station.status === "active" ? "Active" : station.status}
                    </span>
                  </div>

                  {/* লোকেশন */}
                  <div className="space-y-2 text-xs font-bold text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <FiMapPin
                        size={13}
                        className="text-rose-500 flex-shrink-0"
                      />
                      <span>{station.area}</span>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* কন্টাক্ট লিস্ট */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      জরুরি যোগাযোগ মাধ্যম
                    </label>
                    <div className="space-y-1.5">
                      {station.phone?.map((num, pIdx) => {
                        const isHotline = num.length <= 5;
                        return (
                          <div
                            key={pIdx}
                            className="flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl text-xs font-mono font-bold text-gray-800 hover:bg-rose-50/30 hover:border-rose-100 transition-all"
                          >
                            <span className="flex items-center gap-2">
                              <FiPhone size={12} className="text-gray-400" />
                              {num}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 text-[9px] font-black rounded-md ${
                                isHotline
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
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

export default All_Fire_Service_Station;
