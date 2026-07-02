import { useState } from "react";
import { motion } from "framer-motion";
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
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useGetAllDoctorsQuery } from "../../Redux/features/admin/adminApi";
import Loader from "../../utils/Loader";

// টাইপ ডেফিনিশন (TypeScript Error দূর করার জন্য area যুক্ত করা হয়েছে)
interface TDoctor {
  _id: string;
  name: string;
  speciality: string;
  degree: string;
  experience: string;
  area: string; // 💡 নতুন ফিল্ড যুক্ত করা হলো
  chamberAddress: string;
  visitingHours: string;
  phone: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Framer Motion Animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const AllDoctors = () => {
  // স্টেট ম্যানেজমেন্ট (সার্চ, ফিল্টার এবং পেজিনেশন)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedThana, setSelectedThana] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  console.log(selectedThana);
  // RTK Query দিয়ে ডাটা ফেচিং
  const { data: doctorsData, isLoading } = useGetAllDoctorsQuery(undefined);
  console.log(doctorsData?.data)
  // const [deleteDoctor] = useDeleteDoctorMutation();

  // বরিশালের সবগুলো থানা (যা ড্রপডাউনে থাকবে)
  const thanas = [
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
  ];

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm("আপনি কি নিশ্চিতভাবে এই ডাক্তারের তথ্য মুছে ফেলতে চান?")
    ) {
      // deleteDoctor(id);
      console.log("Deleted doctor with id:", id);
    }
  };

  // লোডিং স্টেট হ্যান্ডলার
  if (isLoading) {
    return <Loader />;
  }

  // API থেকে ডাটা অ্যারে ডিফাইন করা
  const doctors: TDoctor[] = doctorsData?.data || [];

  // ১. সার্চ, বিশেষজ্ঞ এবং থানা ভিত্তিক ফিল্টারিং লজিক
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.phone.some((p) => p.includes(searchTerm));

    const matchesSpecialty =
      selectedSpecialty === "" || doctor.speciality === selectedSpecialty;

    // 💡 থানা ম্যাচিং লজিক (ডাটাবেজের area এর সাথে ড্রপডাউন ভ্যালু চেক)
    const matchesThana =
      selectedThana === "" ||
      doctor.area?.toLowerCase() === selectedThana.toLowerCase();

    return (
      matchesSearch && matchesSpecialty && matchesThana && !doctor.isDeleted
    );
  });

  // ২. পেজিনেশন লজিক
  const totalItems = filteredDoctors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // ফিল্টার ড্রপডাউনের জন্য ইউনিক স্পেশালিটি লিস্ট বের করা
  const specialties = Array.from(new Set(doctors.map((d) => d.speciality)));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <motion.div
        className="max-w-7xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* উপরের হেডার সেকশন */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              ডাক্তার তালিকা ({filteredDoctors.length})
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              প্যানেলের সকল নিবন্ধিত ডাক্তারদের তথ্য পরিচালনা করুন
            </p>
          </div>
          <Link
            to="/dashboard/add-doctor"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm no-underline self-start sm:self-center"
          >
            <FiPlus size={16} />
            নতুন ডাক্তার যোগ করুন
          </Link>
        </motion.div>

        {/* 🛠️ সার্চ এবং ফিল্টার বার (থানা ড্রপডাউনসহ ৩টি কলামে বিন্যস্ত) */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
        >
          {/* সার্চ ইনপুট */}
          <div className="relative col-span-1 md:col-span-2">
            <FiSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
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
              className="w-full bg-gray-50 text-gray-900 text-sm pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* 💡 থানা ফিল্টার ড্রপডাউন */}
          <div className="relative">
            <FiMapPin
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <select
              value={selectedThana}
              onChange={(e) => {
                setSelectedThana(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">সব থানা (All Thanas)</option>
              {thanas.map((thana) => (
                <option key={thana.value} value={thana.value}>
                  {thana.name}
                </option>
              ))}
            </select>
          </div>

          {/* স্পেশালিটি ফিল্টার */}
          <div className="relative">
            <FiFilter
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <select
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">সব বিশেষজ্ঞ (All)</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* ডাক্তারদের ডাটা টেবিল */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center w-16">
                    #
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    ডাক্তারের বিবরণ
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    চেম্বার ও সময়
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    যোগাযোগ
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center w-32">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentDoctors.length > 0 ? (
                  currentDoctors.map((doctor, index) => (
                    <tr
                      key={doctor._id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* ইনডেক্স */}
                      <td className="p-4 text-sm text-gray-500 text-center font-medium">
                        {indexOfFirstItem + index + 1}
                      </td>

                      {/* নাম, ডিগ্রি এবং অভিজ্ঞতা */}
                      <td className="p-4 max-w-xs">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-bold text-gray-900">
                            {doctor.name}
                          </span>
                          <span className="text-xs text-gray-500 leading-relaxed">
                            {doctor.degree}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded w-max">
                            <FiBriefcase size={12} />
                            {doctor.experience}
                          </div>
                        </div>
                      </td>

                      {/* চেম্বার এড্রেস, থানা ও ভিজিটিং আওয়ার */}
                      <td className="p-4 max-w-sm">
                        <div className="flex flex-col space-y-1.5 text-xs text-gray-600">
                          {/* স্পেশালিটি ট্যাগ */}
                          <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg w-max">
                              <FiSliders size={12} />
                              {doctor.speciality}
                            </div>
                            {/* 💡 এলাকা/থানা ব্যাজ */}
                            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg font-medium text-[11px]">
                              <FiMapPin size={11} /> {doctor.area || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-start gap-1">
                            <FiMapPin
                              className="text-gray-400 mt-0.5 flex-shrink-0"
                              size={13}
                            />
                            <span className="truncate-2-lines">
                              {doctor.chamberAddress}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-600">
                            <FiClock className="flex-shrink-0" size={13} />
                            <span>{doctor.visitingHours}</span>
                          </div>
                        </div>
                      </td>

                      {/* কন্টাক্ট ইনফো (ফোন অ্যারে হ্যান্ডেল্ড) */}
                      <td className="p-4">
                        <div className="flex flex-col text-xs space-y-1">
                          {doctor.phone.map((num, i) => (
                            <span
                              key={i}
                              className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded w-max"
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* অ্যাকশন বাটনসমূহ */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            to={`/dashboard/doctors/view/${doctor._id}`}
                            onClick={handleLinkClick}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="বিস্তারিত দেখুন"
                          >
                            <FiEye size={16} />
                          </Link>
                          <Link
                            to={`/dashboard/doctors/edit/${doctor._id}`}
                            onClick={handleLinkClick}
                            className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="এডিট করুন"
                          >
                            <FiEdit2 size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(doctor._id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="মুছে ফেলুন"
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
                      className="p-8 text-center text-sm text-gray-400"
                    >
                      নির্বাচিত থানা বা ক্যাটাগরিতে কোনো ডাক্তারের তথ্য পাওয়া
                      যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* পেজিনেশন কন্ট্রোলবার */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                মোট {totalItems} জনের মধ্যে {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, totalItems)} নম্বর ডাক্তার দেখাচ্ছেন
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 text-xs font-semibold rounded-xl transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-sm"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
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
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AllDoctors;
