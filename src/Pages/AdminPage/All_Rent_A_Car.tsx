import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiTrash2,
  FiPlus,
  FiTruck,
  FiPhone,
  FiMapPin,
  FiAlertCircle,
  FiMessageSquare,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useGetAllCarsQuery, useDeleteCarMutation } from "../../Redux/features/admin/adminApi";
import Swal from "sweetalert2";

// কাস্টম কালার থিম ম্যাপিং (গাড়ি টাইপ ব্যাজ)
const getCarTypeStyles = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("ambulance")) return "bg-rose-50 text-rose-600 border-rose-100/60";
  if (t.includes("microbus") || t.includes("hiace")) return "bg-purple-50 text-purple-600 border-purple-100/60";
  if (t.includes("car")) return "bg-sky-50 text-sky-600 border-sky-100/60";
  if (t.includes("noah")) return "bg-amber-50 text-amber-700 border-amber-100/60";
  return "bg-indigo-50 text-indigo-600 border-indigo-100/60";
};

// 💡 আপনার দেওয়া ডিজাইন ও বুটস্ট্র্যাপ বাটনের কনফিগারেশন (Tailwind CSS দিয়ে প্রিমিয়াম লুক দেওয়া)
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-rose-100 cursor-pointer ml-3",
    cancelButton: "px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all cursor-pointer"
  },
  buttonsStyling: false
});

const All_Rent_A_Car = () => {
  // আরটিকে কুয়েরি এবং ডিলিট মিউটেশন হুক
  const { data: carsRes, isLoading, isError } = useGetAllCarsQuery(undefined);
  const [deleteCar] = useDeleteCarMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCarType, setSelectedCarType] = useState("All");

  // transformResponse-এ response?.data হ্যান্ডেল করা থাকলে সরাসরি রেসপন্স বসবে, নাহলে ব্যাকআপ স্ট্রাকচার
  const carsList = carsRes?.data || carsRes || [];
  
  const carTypes = ["All", "Car", "Hiace", "Microbus", "Noah", "Ambulance", "Pickup"];

  // 💡 ডিলিট অ্যাকশন হ্যান্ডলার (সুইটঅ্যালার্ট ও আরটিকে মিউটেশন কানেকশন)
  const handleDeleteAlert = (id: string) => {
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // আরটিকে মিউটেশন ফায়ার
          await deleteCar(id).unwrap();
          
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        } catch (error: any) {
          Swal.fire({
            title: "Error!",
            text: error?.data?.message || "Something went wrong while deleting.",
            icon: "error"
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    });
  };

  // সার্চ এবং লাইভ ফিল্টারিং ম্যাচিং
  const filteredCars = carsList.filter((car: any) => {
    const matchesSearch =
      car?.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car?.proprietorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car?.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car?.upazila?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof car?.phone === "string"
        ? car?.phone.includes(searchQuery)
        : car?.phone?.some((p: string) => p.includes(searchQuery)));

    const matchesType =
      selectedCarType === "All" ||
      car?.carTypes?.some(
        (type: string) => type.toLowerCase() === selectedCarType.toLowerCase()
      );

    return matchesSearch && matchesType && !car?.isDeleted;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* হেডার সেকশন */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100/80 shadow-sm backdrop-blur-md">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2.5 tracking-tight">
              <FiTruck className="text-indigo-600 fill-indigo-50 animate-pulse" size={26} />
              রেন্ট-এ-কার ডিরেক্টরি
              <span className="text-sm font-bold bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {filteredCars.length} টি লাইভ
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
              সকল নিবন্ধিত রেন্ট-এ-কার, গাড়ি, মাইক্রোবাস এবং প্রোপরাইটরদের বিবরণ ও বুকিং স্ট্যাটাস ম্যানেজমেন্ট।
            </p>
          </div>
          <Link
            to="/dashboard/cars/add"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-600/15 hover:scale-[1.01] active:scale-[0.99] transition-all no-underline whitespace-nowrap cursor-pointer border border-white/10"
          >
            <FiPlus size={18} className="stroke-[3]" />
            নতুন গাড়ি যোগ করুন
          </Link>
        </div>

        {/* সার্চ এবং ফিল্টার কন্ট্রোল বার */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3.5">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="সার্ভিসের নাম, প্রোপ্রাইটর, এলাকা বা মোবাইল নম্বর দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 text-sm pl-12 pr-4 py-3 rounded-xl border border-gray-200/80 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all placeholder-gray-400 font-medium"
            />
          </div>

          {/* ক্যাটাগরি ফিল্টার বাটন */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">
              ক্যাটাগরি ফিল্টার:
            </span>
            {carTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedCarType(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                  selectedCarType === type
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50/80"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* মেইন ডাটা ভিউ কার্ড */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="text-sm font-semibold text-gray-400">ডিরেক্টরি ডাটা লোড হচ্ছে...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-rose-100 text-rose-600 p-6 shadow-sm text-center">
            <FiAlertCircle size={36} className="mb-2 text-rose-500" />
            <h3 className="font-bold">ডাটাবেজ কানেকশন সমস্যা!</h3>
            <p className="text-xs text-rose-400 mt-1">অনুগ্রহ করে আপনার ব্যাকএন্ড কানেকশন রিফ্রেশ করুন।</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-center">
            <FiSearch size={40} className="text-gray-300 mb-2" />
            <h3 className="text-gray-500 font-bold text-base">কোনো গাড়ি বা সার্ভিসের তথ্য পাওয়া যায়নি</h3>
            <p className="text-xs text-gray-400 mt-1">আপনার সার্চ কোয়েরি পরিবর্তন করুন অথবা নতুন ডাটা এন্ট্রি করুন।</p>
          </div>
        ) : (
          /* রেসপন্সিভ ডাটা টেবিল কার্ড */
          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-4 px-6">সার্ভিস ও প্রোপরাইটর</th>
                    <th className="py-4 px-4">অ্যাভেলেবল গাড়ি</th>
                    <th className="py-4 px-6">এলাকা/উপজেলা</th>
                    <th className="py-4 px-6">যোগাযোগ</th>
                    <th className="py-4 px-6 text-center">ভাড়া (প্রতিদিন/ট্রিপ)</th>
                    <th className="py-4 px-6 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                  <AnimatePresence>
                    {filteredCars.map((car: any) => (
                      <motion.tr
                        key={car?._id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-indigo-50/20 transition-all group"
                      >
                        {/* সার্ভিসের নাম ও প্রোপরাইটর */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 flex items-center justify-center font-black text-xs border border-indigo-100/50 shadow-sm group-hover:scale-105 transition-transform">
                              {car?.serviceName?.substring(0, 2) || "🚗"}
                            </div>
                            <div className="max-w-[240px]">
                              <p className="font-extrabold text-gray-900 truncate leading-tight group-hover:text-indigo-600 transition-colors" title={car?.serviceName}>
                                {car?.serviceName}
                              </p>
                              <span className="text-[11px] text-gray-400 font-medium mt-1 inline-block truncate">
                                প্রোপ্রাইটর: {car?.proprietorName || "তথ্য নেই"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* গাড়ি টাইপ ব্যাজসমূহ */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                            {car?.carTypes?.map((type: string, idx: number) => (
                              <span
                                key={idx}
                                className={`inline-flex items-center justify-center font-black px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-wider border shadow-2xs ${getCarTypeStyles(type)}`}
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* এলাকা / উপজেলা */}
                        <td className="py-4 px-6">
                          <div>
                            <span className="flex items-center gap-1.5 text-gray-800 text-[13px] font-bold">
                              <FiMapPin className="text-indigo-500/80" size={14} />
                              {car?.area}
                            </span>
                            <span className="text-[10px] font-medium text-gray-400 block ml-5 mt-0.5">
                              {car?.serviceArea}
                            </span>
                          </div>
                        </td>

                        {/* ফোন নম্বর ও হোয়াটস্যাপ কানেক্ট */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-between gap-2">
                            <div className="space-y-1">
                              {Array.isArray(car?.phone) ? (
                                car.phone.map((p: string, idx: number) => (
                                  <span key={idx} className="flex items-center gap-1.5 text-gray-900 text-[13px] font-semibold font-mono">
                                    <FiPhone className="text-gray-400" size={13} />
                                    {p}
                                  </span>
                                ))
                              ) : (
                                <span className="flex items-center gap-1.5 text-gray-900 text-[13px] font-semibold font-mono">
                                  <FiPhone className="text-gray-400" size={13} />
                                  {car?.phone}
                                </span>
                              )}
                            </div>

                            {car?.whatsapp && (
                              <a
                                href={`https://wa.me/${car.whatsapp.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-emerald-500 bg-emerald-50 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs hidden md:inline-block"
                                title="হোয়াটসঅ্যাপ চ্যাট শুরু করুন"
                              >
                                <FiMessageSquare size={14} />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* প্রতিদিনের ভাড়া ও পার ট্রিপ ভাড়া */}
                        <td className="py-4 px-6 text-center font-mono text-[12px]">
                          <div className="text-emerald-600 font-extrabold text-[13px]">৳{car?.rentPerDay}/দিন</div>
                          <div className="text-[10px] font-bold text-gray-400 mt-0.5 bg-gray-50 px-1 py-0.5 rounded-md border border-gray-100">
                            ট্রিপ: ৳{car?.rentPerTrip}
                          </div>
                        </td>

                        {/* ডিলিট অ্যাকশন বাটন */}
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleDeleteAlert(car?._id)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl cursor-pointer transition-all group-hover:scale-105"
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

export default All_Rent_A_Car;