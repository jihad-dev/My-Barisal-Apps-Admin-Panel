
import React, { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiPlus,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiSliders,
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiInbox,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useGetAllDoctorsQuery } from "../../Redux/features/admin/adminApi";

// Type Definitions
interface TDoctor {
  _id: string;
  name: string;
  speciality: string;
  degree: string;
  experience: string;
  area?: string;
  chamberAddress: string;
  visitingHours: string;
  phone: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Static Data Constants
const THANAS = [
  { name: "বরিশাল সদর (Barisal Sadar)", value: "Barisal Sadar" },
  { name: "বাকেরগঞ্জ (Bakerganj)", value: "Bakerganj" },
  { name: "উজিরপুর (Wazirpur)", value: "Wazirpur" },
  { name: "বাবুগঞ্জ (Babuganj)", value: "Babuganj" },
  { name: "বানারীপাড়া (Banaripara)", value: "Banaripara" },
  { name: "গৌরনদী (Gournadi)", value: "Gournadi" },
  { name: "আগৈলঝারা (Agailjhara)", value: "Agailjhara" },
  { name: "মেহেন্দিগঞ্জ (Mehendiganj)", value: "Mehendiganj" },
  { name: "মুলাদী (Muladi)", value: "Muladi" },
  { name: "হিজলা (Hizla)", value: "Hizla" },
] as const;

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Skeleton Table Loader Component
const TableSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="p-4 bg-gray-50/50 border-b border-gray-100">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="p-4 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-1 h-4 bg-gray-200 rounded mx-auto w-6"></div>
          <div className="col-span-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/3"></div>
          </div>
          <div className="col-span-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-100 rounded w-5/6"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
          <div className="col-span-2 space-y-1">
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-100 rounded w-24"></div>
          </div>
          <div className="col-span-1 flex justify-center gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AllDoctors = () => {
  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedThana, setSelectedThana] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // RTK Query Data Fetching
  const {
    data: doctorsData,
    isLoading,
    isError,
  } = useGetAllDoctorsQuery(undefined);

  // Extract raw list
  const rawDoctors: TDoctor[] = doctorsData?.data || [];

  // Extract unique specialties efficiently using useMemo
  const specialties = useMemo(() => {
    return Array.from(
      new Set(rawDoctors.map((d) => d.speciality).filter(Boolean)),
    );
  }, [rawDoctors]);

  // Safe Filter Logic using useMemo
  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return rawDoctors.filter((doctor) => {
      if (doctor.isDeleted) return false;

      const matchesSearch =
        !query ||
        doctor.name?.toLowerCase().includes(query) ||
        doctor.degree?.toLowerCase().includes(query) ||
        doctor.speciality?.toLowerCase().includes(query) ||
        doctor.phone?.some((p) => p.includes(query));

      const matchesSpecialty =
        !selectedSpecialty || doctor.speciality === selectedSpecialty;

      const matchesThana =
        !selectedThana ||
        doctor.area?.toLowerCase() === selectedThana.toLowerCase();

      return matchesSearch && matchesSpecialty && matchesThana;
    });
  }, [rawDoctors, searchTerm, selectedSpecialty, selectedThana]);

  // Pagination Logic
  const totalItems = filteredDoctors.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm("আপনি কি নিশ্চিতভাবে এই ডাক্তারের তথ্য মুছে ফেলতে চান?")
    ) {
      // deleteDoctor(id);
      console.log("Deleted doctor ID:", id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="max-w-7xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              ডাক্তার তালিকা{" "}
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full ml-1">
                {filteredDoctors.length}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              প্যানেলের সকল নিবন্ধিত ডাক্তারদের তথ্য পরিচালনা ও পর্যবেক্ষণ করুন
            </p>
          </div>
          <Link
            to="/dashboard/add-doctor"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-200 active:scale-95 no-underline self-start sm:self-center"
          >
            <FiPlus size={18} />
            নতুন ডাক্তার যোগ করুন
          </Link>
        </motion.div>

        {/* Filter and Search Bar */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
        >
          {/* Search Input */}
          <div className="relative col-span-1 md:col-span-2">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
            <input
              type="text"
              placeholder="নাম, ডিগ্রি, বিশেষজ্ঞতা বা ফোন নাম্বার দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Thana Filter */}
          <div className="relative">
            <FiMapPin
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
            <select
              value={selectedThana}
              onChange={(e) => {
                setSelectedThana(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 text-gray-900 text-sm pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">সব থানা (All Thanas)</option>
              {THANAS.map((thana) => (
                <option key={thana.value} value={thana.value}>
                  {thana.name}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty Filter */}
          <div className="relative">
            <FiFilter
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
            <select
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 text-gray-900 text-sm pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">সব বিশেষজ্ঞ (All Specialties)</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Dynamic Table Loading or Data view */}
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-red-100 shadow-sm">
            <p className="text-red-500 font-medium text-sm">
              ডাটা লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-100">
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-14">
                      #
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      ডাক্তারের বিবরণ
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      চেম্বার ও সময়
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      যোগাযোগ
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-28">
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentDoctors.length > 0 ? (
                    currentDoctors.map((doctor, index) => (
                      <tr
                        key={doctor._id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        {/* Row Index */}
                        <td className="p-4 text-xs text-gray-400 text-center font-medium">
                          {indexOfFirstItem + index + 1}
                        </td>

                        {/* Doctor Profile Details */}
                        <td className="p-4 max-w-xs">
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm font-bold text-gray-900 leading-tight">
                              {doctor.name}
                            </span>
                            <span className="text-xs text-gray-500 line-clamp-2">
                              {doctor.degree}
                            </span>
                            {doctor.experience && (
                              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md w-max border border-emerald-100/60 mt-1">
                                <FiBriefcase size={11} />
                                {doctor.experience}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Chamber and Time Info */}
                        <td className="p-4 max-w-sm">
                          <div className="flex flex-col space-y-1.5 text-xs text-gray-600">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md text-[11px]">
                                <FiSliders size={11} />
                                {doctor.speciality}
                              </span>
                              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                                <FiMapPin size={10} /> {doctor.area || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-start gap-1 text-gray-600">
                              <FiMapPin
                                className="text-gray-400 mt-0.5 flex-shrink-0"
                                size={12}
                              />
                              <span className="line-clamp-2">
                                {doctor.chamberAddress}
                              </span>
                            </div>
                            {doctor.visitingHours && (
                              <div className="flex items-center gap-1 text-amber-700 font-medium">
                                <FiClock className="flex-shrink-0" size={12} />
                                <span>{doctor.visitingHours}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Contact Numbers */}
                        <td className="p-4">
                          <div className="flex flex-col text-xs space-y-1">
                            {doctor.phone?.map((num, i) => (
                              <span
                                key={i}
                                className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded w-max border border-slate-200/50"
                              >
                                {num}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              to={`/dashboard/doctors/view/${doctor._id}`}
                              onClick={handleLinkClick}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="বিস্তারিত দেখুন"
                              aria-label="View Details"
                            >
                              <FiEye size={16} />
                            </Link>
                            <Link
                              to={`/dashboard/doctors/edit/${doctor._id}`}
                              onClick={handleLinkClick}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                              title="এডিট করুন"
                              aria-label="Edit Doctor"
                            >
                              <FiEdit2 size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(doctor._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="মুছে ফেলুন"
                              aria-label="Delete Doctor"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2 text-gray-400">
                          <FiInbox size={32} strokeWidth={1.5} />
                          <p className="text-sm font-medium text-gray-500">
                            কোনো ডাক্তারের তথ্য পাওয়া যায়নি।
                          </p>
                          <p className="text-xs text-gray-400">
                            সার্চ বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Bar */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50/80 border-t border-gray-100">
                <span className="text-xs text-gray-500 font-medium">
                  মোট {totalItems} জনের মধ্যে {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, totalItems)} দেখান হচ্ছে
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    aria-label="Previous Page"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 text-xs font-semibold rounded-lg transition-all ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-sm"
                            : "border border-gray-200 bg-white text-gray-600 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    aria-label="Next Page"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AllDoctors;
