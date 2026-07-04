import React, { useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  Briefcase,
  SlidersHorizontal,
  Plus,
  Edit3,
  Trash2,
  AlertCircle,
  Scale,
  Award,
  ChevronLeft,
  ChevronRight,
  RefreshCw, // রিফ্রেশ অ্যানিমেশনের জন্য আইকন যুক্ত করা হয়েছে
} from "lucide-react";
// আপনার প্রজেক্টের পাথ অনুযায়ী ইম্পোর্ট ঠিক করে নিন
import { useGetAllLawyersQuery } from "../../Redux/features/admin/adminApi";
import { Link } from "react-router-dom";

// নতুন ডাটা স্ট্রাকচার অনুযায়ী টাইপস
export type TLawyerType =
  | "civil"
  | "criminal"
  | "family"
  | "corporate"
  | "general";
export type TCourtType =
  | "supreme"
  | "high"
  | "district"
  | "magistrate"
  | "labor"
  | "other";

interface Lawyer {
  _id: string;
  name: string;
  designation: string;
  lawyerType: TLawyerType;
  courtType: TCourtType;
  barCouncilId?: string;
  area: string;
  address: string;
  phone: string[];
  experience: number;
  isDeleted: boolean;
}

// ম্যাপিং অবজেক্ট
const lawyerTypeMap: Record<TLawyerType, string> = {
  civil: "দেওয়ানি (Civil)",
  criminal: "ফৌজদারি (Criminal)",
  family: "পারিবারিক (Family)",
  corporate: "করপোরেট (Corporate)",
  general: "সাধারণ (General)",
};

const courtTypeMap: Record<TCourtType, string> = {
  supreme: "সুপ্রিম কোর্ট",
  high: "হাইকোর্ট",
  district: "জেলা আদালত",
  magistrate: "ম্যাজিস্ট্রেট কোর্ট",
  labor: "শ্রম আদালত",
  other: "অন্যান্য ট্রাইব্যুনাল",
};

export default function LawyersDashboardPage() {
  // 🔄 এখানে isFetching যুক্ত করা হয়েছে যা refetch এর লোডিং ট্র্যাক করবে
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllLawyersQuery(undefined);

  const [searchTerm, setSearchTerm] = useState<string>("");

  // পেজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // ১. ডাটা সেফলি এক্সট্র্যাক্ট করা
  const lawyers: Lawyer[] = Array.isArray(apiResponse)
    ? apiResponse
    : (apiResponse as any)?.data || [];

  // ২. সার্চ ফিল্টারিং লজিক
  const cleanSearchTerm = searchTerm.trim().toLowerCase();

  const filteredLawyers = lawyers.filter((lawyer) => {
    if (!cleanSearchTerm) return true;

    const name = lawyer?.name ? String(lawyer.name).toLowerCase() : "";
    const designation = lawyer?.designation
      ? String(lawyer.designation).toLowerCase()
      : "";
    const area = lawyer?.area ? String(lawyer.area).toLowerCase() : "";
    const address = lawyer?.address ? String(lawyer.address).toLowerCase() : "";
    const barId = lawyer?.barCouncilId
      ? String(lawyer.barCouncilId).toLowerCase()
      : "";

    const lType = lawyer?.lawyerType
      ? lawyerTypeMap[lawyer.lawyerType].toLowerCase()
      : "";
    const cType = lawyer?.courtType
      ? courtTypeMap[lawyer.courtType].toLowerCase()
      : "";

    const matchesPhone = Array.isArray(lawyer?.phone)
      ? lawyer.phone.some((num) =>
          String(num).toLowerCase().includes(cleanSearchTerm),
        )
      : false;

    return (
      name.includes(cleanSearchTerm) ||
      designation.includes(cleanSearchTerm) ||
      area.includes(cleanSearchTerm) ||
      address.includes(cleanSearchTerm) ||
      barId.includes(cleanSearchTerm) ||
      lType.includes(cleanSearchTerm) ||
      cType.includes(cleanSearchTerm) ||
      matchesPhone
    );
  });

  // ৩. পেজিনেশন লজিক
  const totalItems = filteredLawyers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLawyers = filteredLawyers.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // ⚡ হ্যান্ডেল রিফ্রেশ ফাংশন
  const handleForceRefetch = async () => {
    await refetch();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      {/* ─── TOP HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            আইনজীবী ডাটাবেজ
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            সিস্টেমের সকল নিবন্ধিত আইনজীবীদের তালিকা ও প্রোফাইল ম্যানেজমেন্ট
          </p>
        </div>

        <Link to="/dashboard/add-lawyer">
          <button className="flex items-center cursor-pointer justify-center gap-2 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition-all transform active:scale-95 w-full md:w-auto">
            <Plus className="w-4 h-4" /> নতুন আইনজীবী যোগ করুন
          </button>
        </Link>
      </div>

      {/* ─── SEARCH & FILTER BAR ─── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="নাম, পদবী, মোবাইল নম্বর, আইডি বা এলাকা দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 bg-slate-50/70 text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto justify-end items-center">
          {/* 🔄 আপগ্রেডেড রিফ্রেশ বাটন (অ্যানিমেশন এবং স্ট্যাটাস সহ) */}
          <button
            onClick={handleForceRefetch}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 rounded-xl transition cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-indigo-600" : ""}`}
            />
            {isFetching ? "লোডিং..." : "রিফ্রেশ ডাটা"}
          </button>

          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5" /> মোট রেকর্ড:{" "}
            {totalItems}
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT AREA ─── */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-24 bg-white border border-slate-100 rounded-xl animate-pulse flex items-center justify-between px-6"
            >
              <div className="flex gap-4 items-center w-1/3">
                <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-8 bg-slate-200 rounded w-20" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center max-w-md mx-auto mt-12">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            ডাটা লোড করা যায়নি
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            সার্ভার রেসপন্স করছে না। অনুগ্রহ করে নেটওয়ার্ক বা API এন্ডপয়েন্ট চেক
            করুন।
          </p>
        </div>
      ) : filteredLawyers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center max-w-md mx-auto mt-6">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">
            কোনো তথ্য পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            আপনার সার্চ কিওয়ার্ডটি আবার চেক করুন।
          </p>
        </div>
      ) : (
        <>
          {/* 💻 ডেস্কটপ ভিউ */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">আইনজীবীর বিবরণ</th>
                  <th className="py-4 px-6">আইনজীবী ও কোর্ট টাইপ</th>
                  <th className="py-4 px-6">বার কাউন্সিল আইডি / অভিজ্ঞতা</th>
                  <th className="py-4 px-6">চেম্বার ও এলাকা</th>
                  <th className="py-4 px-6">যোগাযোগ (Phone)</th>
                  <th className="py-4 px-6 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {currentLawyers.map((lawyer) => (
                  <tr
                    key={lawyer._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-700 font-bold rounded-xl flex items-center justify-center border border-indigo-100/50 uppercase">
                          {lawyer.name ? lawyer.name.substring(0, 2) : "LW"}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {lawyer.name}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium block mt-0.5">
                            {lawyer.designation}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                          <Scale className="w-3 h-3" />{" "}
                          {lawyerTypeMap[lawyer.lawyerType] ||
                            lawyer.lawyerType}
                        </span>
                        <span className="inline-flex items-center gap-1 w-fit px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-semibold rounded-lg border border-teal-100">
                          <Briefcase className="w-3 h-3" />{" "}
                          {courtTypeMap[lawyer.courtType] || lawyer.courtType}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-600 font-mono flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-slate-400" />{" "}
                          {lawyer.barCouncilId || "N/A"}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          অভিজ্ঞতা:{" "}
                          <span className="text-slate-800 font-bold">
                            {lawyer.experience} বছর
                          </span>
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-6 max-w-[200px]">
                      <div className="flex items-start gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {lawyer.area}
                          </p>
                          <p
                            className="text-xs text-slate-400 mt-0.5 truncate"
                            title={lawyer.address}
                          >
                            {lawyer.address}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {lawyer.phone?.map((num, idx) => (
                          <span
                            key={idx}
                            className="flex items-center gap-1 text-xs text-slate-600 font-mono"
                          >
                            <Phone className="w-3 h-3 text-slate-400" /> {num}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg hover:text-slate-800 transition cursor-pointer">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 মোবাইল ভিউ */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {currentLawyers.map((lawyer) => (
              <div
                key={lawyer._id}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-700 font-bold rounded-xl flex items-center justify-center border border-indigo-100">
                      {lawyer.name ? lawyer.name.substring(0, 2) : "LW"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {lawyer.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {lawyer.designation}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-100">
                      {lawyerTypeMap[lawyer.lawyerType] || lawyer.lawyerType}
                    </span>
                    <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-md border border-teal-100">
                      {courtTypeMap[lawyer.courtType] || lawyer.courtType}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 space-y-2.5 text-xs">
                  <div className="flex gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p>
                      <span className="font-semibold text-slate-800">
                        {lawyer.area}
                      </span>{" "}
                      - {lawyer.address}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 text-slate-500">
                    <div>
                      বার আইডি:{" "}
                      <span className="text-slate-800 font-mono font-medium">
                        {lawyer.barCouncilId || "N/A"}
                      </span>
                    </div>
                    <div>
                      অভিজ্ঞতা:{" "}
                      <span className="text-slate-800 font-bold">
                        {lawyer.experience} বছর
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-1 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div className="font-mono text-slate-700">
                      {lawyer.phone ? lawyer.phone.join(", ") : ""}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition cursor-pointer">
                    <Edit3 className="w-3.5 h-3.5" /> এডিট
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" /> ডিলিট
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 🔢 পেজিনেশন UI */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-xs font-medium text-slate-500">
                রেকর্ড দেখছেন{" "}
                <span className="text-slate-800 font-bold">
                  {indexOfFirstItem + 1}
                </span>{" "}
                থেকে{" "}
                <span className="text-slate-800 font-bold">
                  {indexOfLastItem > totalItems ? totalItems : indexOfLastItem}
                </span>{" "}
                (মোট{" "}
                <span className="text-slate-800 font-bold">{totalItems}</span>{" "}
                জনের মধ্যে)
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 text-slate-500 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-9 h-9 text-xs font-bold rounded-xl transition cursor-pointer ${
                        currentPage === pageNumber
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 text-slate-500 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
