// import { useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiSearch,
//   FiPlus,
//   FiUser,
//   FiPhone,
//   FiMapPin,
//   FiTrash2,
//   FiEdit3,
//   FiLoader,
//   FiChevronLeft,
//   FiChevronRight,
//   FiCheckCircle,
//   FiXCircle,
//   FiFilter,
// } from "react-icons/fi";
// import { useGetAllImamMuzzainQuery } from "../../Redux/features/admin/adminApi";
// import { Link } from "react-router-dom";

// // ১. আপনার প্রোভাইড করা থানার ফিক্সড অ্যারে
// const THANAS = [
//   { name: "বরিশাল সদর (Barisal Sadar)", value: "Barisal Sadar" },
//   { name: "বাকেরগঞ্জ (Bakerganj)", value: "Bakerganj" },
//   { name: "উজিরপুর (Wazirpur)", value: "Wazirpur" },
//   { name: "বাবুগঞ্জ (Babuganj)", value: "Babuganj" },
//   { name: "বানারীপাড়া (Banaripara)", value: "Banaripara" },
//   { name: "গৌরনদী (Gournadi)", value: "Gournadi" },
//   { name: "আগৈলঝারা (Agailjhara)", value: "Agailjhara" },
//   { name: "মেহেন্দিগঞ্জ (Mehendiganj)", value: "Mehendiganj" },
//   { name: "মুলাদী (Muladi)", value: "Muladi" },
//   { name: "হিজলা (Hizla)", value: "Hizla" },
// ];

// interface IImamMuazzin {
//   _id: string;
//   name: string;
//   role: "imam" | "muazzin" | string;
//   phone: string;
//   district: string;
//   thana: string;
//   union?: string;
//   village?: string;
//   employmentStatus: "available" | "employed" | string;
//   isDeleted: boolean;
// }

// const All_Imam = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [thanaFilter, setThanaFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // RTK Query হুক কল
//   const {
//     data: responseData,
//     isLoading,
//     isError,
//   } = useGetAllImamMuzzainQuery(undefined);

//   // ব্যাকএন্ড ডাটা সেফলি এক্সট্র্যাক্ট করা
//   const rawData: IImamMuazzin[] = useMemo(() => {
//     if (!responseData) return [];
//     return Array.isArray(responseData.data)
//       ? responseData.data
//       : Array.isArray(responseData)
//         ? responseData
//         : [];
//   }, [responseData]);

//   // ২. মেমরাইজড ফিল্টারিং (সার্চ, রোল এবং থানা ট্রিপল কম্বো ফিল্টার)
//   const filteredData = useMemo(() => {
//     return rawData.filter((item) => {
//       if (item?.isDeleted) return false;

//       // সার্চ ফিল্টার লজিক (রিয়েল ডাটার অবজেক্ট কেস হ্যান্ডেল করার জন্য lowercase করা হয়েছে)
//       const nameMatch =
//         item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
//       const phoneMatch = item?.phone?.includes(searchTerm) || false;
//       const villageMatch =
//         item?.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         false;
//       const thanaMatch =
//         item?.thana?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
//       const districtMatch =
//         item?.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         false;
//       const matchesSearch =
//         nameMatch || phoneMatch || villageMatch || thanaMatch || districtMatch;

//       // রোল ফিল্টার লজিক
//       const matchesRole = roleFilter === "all" || item?.role === roleFilter;

//       // থানা ফিল্টার লজিক (সার্ভারের ডাটার সাথে সেফলি তুলনা করার জন্য লোয়ারকেস ম্যাচ করা হলো)
//       const matchesThana =
//         thanaFilter === "all" ||
//         item?.thana?.toLowerCase() === thanaFilter.toLowerCase();

//       return matchesSearch && matchesRole && matchesThana;
//     });
//   }, [rawData, searchTerm, roleFilter, thanaFilter]);

//   // ৩. পেজিনেশন ক্যালকুলেশন
//   const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredData.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredData, currentPage]);

//   const handleDelete = (id: string) => {
//     if (window.confirm("আপনি কি নিশ্চিত যে এই রেকর্ডটি মুছে ফেলতে চান?")) {
//       console.log("Deleted ID:", id);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 font-sans antialiased text-slate-800">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* টপ প্রিমিয়াম হেডার কার্ড */}
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
//           <div>
//             <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
//               <FiUser className="text-emerald-500" /> ইমাম ও মুয়াজ্জিন
//               ম্যানেজমেন্ট
//             </h1>
//             <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
//               সর্বমোট নিবন্ধিত:{" "}
//               <span className="text-emerald-600 font-bold font-mono">
//                 {filteredData.length}
//               </span>{" "}
//               জন
//             </p>
//           </div>

//           <Link to="/dashboard/imam-muazzin/add" className="w-full md:w-auto">
//             <button
//               type="button"
//               className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer w-full md:w-auto justify-center"
//             >
//               <FiPlus size={16} /> নতুন সদস্য যুক্ত করুন
//             </button>
//           </Link>
//         </div>

//         {/* ফিল্টার ও সার্চ প্যানেল */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//           {/* সার্চ ইনপুট */}
//           <div className="relative lg:col-span-2 shadow-sm rounded-xl">
//             <FiSearch
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//               size={18}
//             />
//             <input
//               type="text"
//               placeholder="নাম, ফোন নম্বর, থানা বা গ্রাম লিখে খুঁজুন..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-xl outline-none transition-all font-medium text-sm text-slate-900"
//             />
//           </div>

//           {/* রোল ফিল্টার */}
//           <div className="relative shadow-sm rounded-xl">
//             <FiFilter
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//               size={16}
//             />
//             <select
//               value={roleFilter}
//               onChange={(e) => {
//                 setRoleFilter(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-xl outline-none transition-all font-bold text-sm text-slate-700 appearance-none cursor-pointer"
//             >
//               <option value="all">সকল পদ (Role)</option>
//               <option value="imam">ইмам (Imam)</option>
//               <option value="muazzin">মুয়াজ্জিন (Muazzin)</option>
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-slate-400">
//               ▼
//             </div>
//           </div>

//           {/* আপনার THANAS অ্যারে ভিত্তিক থানা ফিল্টার ড্রপডাউন */}
//           <div className="relative shadow-sm rounded-xl">
//             <FiMapPin
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//               size={16}
//             />
//             <select
//               value={thanaFilter}
//               onChange={(e) => {
//                 setThanaFilter(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-xl outline-none transition-all font-bold text-sm text-slate-700 appearance-none cursor-pointer"
//             >
//               <option value="all">সকল থানা (All Thana)</option>
//               {THANAS.map((thana) => (
//                 <option key={thana.value} value={thana.value}>
//                   {thana.name}
//                 </option>
//               ))}
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-slate-400">
//               ▼
//             </div>
//           </div>
//         </div>

//         {/* মেইন ডাটা টেবিল */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
//         >
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse whitespace-nowrap">
//               <thead>
//                 <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 text-[11px] font-black uppercase tracking-wider">
//                   <th className="py-4 px-6">বেসিক প্রোফাইল</th>
//                   <th className="py-4 px-6">পদবী / Role</th>
//                   <th className="py-4 px-6">ঠিকানা ও অবস্থান</th>
//                   <th className="py-4 px-6">কর্মসংস্থান স্ট্যাটাস</th>
//                   <th className="py-4 px-6 text-center">অ্যাকশন</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 font-medium text-sm text-slate-700">
//                 <AnimatePresence mode="wait">
//                   {isLoading ? (
//                     <tr>
//                       <td colSpan={5} className="py-20 text-center">
//                         <div className="flex flex-col items-center justify-center gap-3">
//                           <FiLoader
//                             className="animate-spin text-emerald-500"
//                             size={28}
//                           />
//                           <span className="font-bold text-slate-500 text-sm">
//                             ডাটাবেজ থেকে তথ্য লোড হচ্ছে...
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : isError ? (
//                     <tr>
//                       <td
//                         colSpan={5}
//                         className="py-16 text-center text-red-500 font-bold"
//                       >
//                         সার্ভার রেসপন্স করছে না। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।
//                       </td>
//                     </tr>
//                   ) : paginatedData.length > 0 ? (
//                     paginatedData.map((item) => (
//                       <tr
//                         key={item._id}
//                         className="hover:bg-slate-50/50 transition-colors group"
//                       >
//                         <td className="py-4 px-6">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black border border-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all">
//                               {item.name ? item.name.charAt(0) : "U"}
//                             </div>
//                             <div className="space-y-0.5">
//                               <p className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
//                                 {item.name || "নামহীন"}
//                               </p>
//                               <p className="text-xs text-slate-500 flex items-center gap-1 font-mono tracking-tight">
//                                 <FiPhone size={12} className="text-slate-400" />{" "}
//                                 {item.phone || "N/A"}
//                               </p>
//                             </div>
//                           </div>
//                         </td>

//                         <td className="py-4 px-6">
//                           {item.role === "imam" ? (
//                             <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
//                               ইмам
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
//                               মুয়াজ্জিন
//                             </span>
//                           )}
//                         </td>

//                         <td className="py-4 px-6">
//                           <div className="max-w-[280px] space-y-0.5">
//                             <p
//                               className="text-xs font-black text-slate-800 truncate"
//                               title={item.village}
//                             >
//                               {item.village
//                                 ? `গ্রাম: ${item.village}`
//                                 : "গ্রাম নির্দিষ্ট নেই"}
//                             </p>
//                             <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
//                               <FiMapPin size={11} className="text-slate-300" />
//                               {item.union ? `${item.union}, ` : ""}
//                               {item.thana}, {item.district}
//                             </p>
//                           </div>
//                         </td>

//                         <td className="py-4 px-6">
//                           {item.employmentStatus === "available" ? (
//                             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
//                               <FiCheckCircle size={12} /> এভেইলেবল (ফ্রি)
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
//                               <FiXCircle size={12} /> নিয়োজিত আছেন
//                             </span>
//                           )}
//                         </td>

//                         <td className="py-4 px-6 text-center">
//                           <div className="flex items-center justify-center gap-1">
//                             <button
//                               title="সম্পাদনা"
//                               className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
//                             >
//                               <FiEdit3 size={16} />
//                             </button>
//                             <button
//                               title="মুছে ফেলুন"
//                               onClick={() => handleDelete(item._id)}
//                               className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
//                             >
//                               <FiTrash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={5}
//                         className="py-16 text-center text-slate-400 font-bold"
//                       >
//                         কোনো ডাটা পাওয়া যায়নি।
//                       </td>
//                     </tr>
//                   )}
//                 </AnimatePresence>
//               </tbody>
//             </table>
//           </div>

//           {/* পেজ নেশন প্যানেল */}
//           {totalPages > 1 && (
//             <div className="bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
//               <span className="text-xs font-bold text-slate-500">
//                 পৃষ্ঠা নং{" "}
//                 <span className="text-slate-800 font-mono">{currentPage}</span>{" "}
//                 / <span className="text-slate-800 font-mono">{totalPages}</span>{" "}
//                 (মোট ডাটা: {filteredData.length})
//               </span>

//               <div className="flex items-center gap-1">
//                 <button
//                   type="button"
//                   disabled={currentPage === 1}
//                   onClick={() =>
//                     setCurrentPage((prev) => Math.max(prev - 1, 1))
//                   }
//                   className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
//                 >
//                   <FiChevronLeft size={16} />
//                 </button>

//                 {Array.from({ length: totalPages }, (_, index) => {
//                   const pageNum = index + 1;
//                   if (
//                     pageNum === 1 ||
//                     pageNum === totalPages ||
//                     Math.abs(currentPage - pageNum) <= 1
//                   ) {
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
//                           currentPage === pageNum
//                             ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
//                             : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   }
//                   if (pageNum === 2 || pageNum === totalPages - 1) {
//                     return (
//                       <span
//                         key={pageNum}
//                         className="px-1 text-slate-400 font-mono text-xs"
//                       >
//                         ...
//                       </span>
//                     );
//                   }
//                   return null;
//                 })}

//                 <button
//                   type="button"
//                   disabled={currentPage === totalPages}
//                   onClick={() =>
//                     setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                   }
//                   className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
//                 >
//                   <FiChevronRight size={16} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default All_Imam;

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
import { useGetAllImamMuzzainQuery } from "../../Redux/features/admin/adminApi";
import { Link } from "react-router-dom";

// ১. বরিশালের ফিক্সড থানা অ্যারে
const THANAS = [
  { name: "বরিশাল সদর (Barisal Sadar)", value: "Barisal Sadar" },
  { name: "বাকেরগঞ্জ (Bakerganj)", value: "Bakerganj" },
  { name: "উজিরপুর (Wazirpur)", value: "Wazirpur" },
  { name: "بابوগঞ্জ (Babuganj)", value: "Babuganj" },
  { name: "বানারীপাড়া (Banaripara)", value: "Banaripara" },
  { name: "গৌরনদী (Gournadi)", value: "Gournadi" },
  { name: "আগৈলঝারা (Agailjhara)", value: "Agailjhara" },
  { name: "মেহেন্দিগঞ্জ (Mehendiganj)", value: "Mehendiganj" },
  { name: "মুলাদী (Muladi)", value: "Muladi" },
  { name: "হিজলা (Hizla)", value: "Hizla" },
];

interface IImamMuazzin {
  _id: string;
  name: string;
  role: "imam" | "muazzin" | "both"; // 'both' যুক্ত করা হলো
  phone: string;
  district: string;
  thana: string;
  union?: string;
  village?: string;
  employmentStatus: "available" | "hired"; // 'employed' পরিবর্তন করে 'hired' করা হলো
  isDeleted: boolean;
}

const All_Imam = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [thanaFilter, setThanaFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // RTK Query হুক কল
  const {
    data: responseData,
    isLoading,
    isError,
  } = useGetAllImamMuzzainQuery(undefined);

  // ব্যাকএন্ড ডাটা সেফলি এক্সট্র্যাক্ট করা
  const rawData: IImamMuazzin[] = useMemo(() => {
    if (!responseData) return [];
    return Array.isArray(responseData.data)
      ? responseData.data
      : Array.isArray(responseData)
        ? responseData
        : [];
  }, [responseData]);

  // ২. মেমরাইজড ফিল্টারিং (সার্চ, রোল এবং থানা ট্রিপল কম্বো ফিল্টার)
  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      if (item?.isDeleted) return false;

      // সার্চ ফিল্টার লজিক
      const nameMatch =
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const phoneMatch = item?.phone?.includes(searchTerm) || false;
      const villageMatch =
        item?.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;
      const thanaMatch =
        item?.thana?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const districtMatch =
        item?.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;
      const matchesSearch =
        nameMatch || phoneMatch || villageMatch || thanaMatch || districtMatch;

      // রোল ফিল্টার লজিক
      const matchesRole = roleFilter === "all" || item?.role === roleFilter;

      // থানা ফিল্টার লজিক
      const matchesThana =
        thanaFilter === "all" ||
        item?.thana?.toLowerCase() === thanaFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesThana;
    });
  }, [rawData, searchTerm, roleFilter, thanaFilter]);

  // ৩. পেজিনেশন ক্যালকুলেশন
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleDelete = (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত যে এই রেকর্ডটি মুছে ফেলতে চান?")) {
      console.log("Deleted ID:", id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 font-sans antialiased text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* টপ প্রিমিয়াম হেডার কার্ড */}
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

          <Link to="/dashboard/imam-muazzin/add" className="w-full md:w-auto">
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer w-full md:w-auto justify-center"
            >
              <FiPlus size={16} /> নতুন সদস্য যুক্ত করুন
            </button>
          </Link>
        </div>

        {/* ফিল্টার ও সার্চ প্যানেল */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* সার্চ ইনপুট */}
          <div className="relative lg:col-span-2 shadow-sm rounded-xl">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="নাম, ফোন নম্বর, থানা বা গ্রাম লিখে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-xl outline-none transition-all font-medium text-sm text-slate-900"
            />
          </div>

          {/* রোল ফিল্টার (FIXED: added both) */}
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
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-xl outline-none transition-all font-bold text-sm text-slate-700 appearance-none cursor-pointer"
            >
              <option value="all">সকল পদ (Role)</option>
              <option value="imam">ইмам (Imam)</option>
              <option value="muazzin">মুয়াজ্জিন (Muazzin)</option>
              <option value="both">উভয়ই (Both)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-slate-400">
              ▼
            </div>
          </div>

          {/* থানা ফিল্টার ড্রপডাউন */}
          <div className="relative shadow-sm rounded-xl">
            <FiMapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <select
              value={thanaFilter}
              onChange={(e) => {
                setThanaFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-xl outline-none transition-all font-bold text-sm text-slate-700 appearance-none cursor-pointer"
            >
              <option value="all">সকল থানা (All Thana)</option>
              {THANAS.map((thana) => (
                <option key={thana.value} value={thana.value}>
                  {thana.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-slate-400">
              ▼
            </div>
          </div>
        </div>

        {/* মেইন ডাটা টেবিল */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                  <th className="py-4 px-6">বেসিক প্রোফাইল</th>
                  <th className="py-4 px-6">পদবী / Role</th>
                  <th className="py-4 px-6">ঠিকানা ও অবস্থান</th>
                  <th className="py-4 px-6">কর্মসংস্থান স্ট্যাটাস</th>
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
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
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

                        {/* রোল ব্যাজ রেন্ডারিং (FIXED: added both badge) */}
                        <td className="py-4 px-6">
                          {item.role === "imam" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                              ইмам
                            </span>
                          ) : item.role === "muazzin" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                              মুয়াজ্জিন
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                              ইমাম ও মুয়াজ্জিন
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6">
                          <div className="max-w-[280px] space-y-0.5">
                            <p
                              className="text-xs font-black text-slate-800 truncate"
                              title={item.village}
                            >
                              {item.village
                                ? `গ্রাম: ${item.village}`
                                : "গ্রাম নির্দিষ্ট নেই"}
                            </p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                              <FiMapPin size={11} className="text-slate-300" />
                              {item.union ? `${item.union}, ` : ""}
                              {item.thana}, {item.district}
                            </p>
                          </div>
                        </td>

                        {/* স্ট্যাটাস কন্ডিশন (FIXED: employed থেকে hired করা হলো) */}
                        <td className="py-4 px-6">
                          {item.employmentStatus === "available" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <FiCheckCircle size={12} /> এভেইলেবল (ফ্রি)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              <FiXCircle size={12} /> নিয়োগপ্রাপ্ত / কর্মরত
                            </span>
                          )}
                        </td>

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

          {/* পেজ নেশন প্যানেল */}
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
                      <span
                        key={pageNum}
                        className="px-1 text-slate-400 font-mono text-xs"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
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
