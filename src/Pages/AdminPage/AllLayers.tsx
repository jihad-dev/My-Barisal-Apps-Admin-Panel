import React, { useState } from "react";
import {
  Search,
  UserCheck,
  MapPin,
  Phone,
  Briefcase,
  SlidersHorizontal,
  Plus,
  Edit3,
  Trash2,
  AlertCircle,
} from "lucide-react";
// আপনার প্রোজেক্টের পাথ অনুযায়ী ইম্পোর্ট ঠিক করে নিন
import { useGetAllLawyersQuery } from "../../Redux/features/admin/adminApi";

// TypeScript Interface
interface Lawyer {
  _id: string;
  name: string;
  designation: string;
  specialty: string;
  chamberAddress: string;
  area: string;
  phone: string[];
}

export default function LawyersDashboardPage() {
  // RTK Query দিয়ে ডাটা ফেচিং
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAllLawyersQuery(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
console.log(apiResponse)
  // ১. এপিআই রেসপন্স হ্যান্ডলিং (ডাটা সরাসরি অ্যারে বা অবজেক্ট ডট ডাটা যেভাবেই আসুক তা সুরক্ষিত করা)
  const lawyers: Lawyer[] = Array.isArray(apiResponse)
    ? apiResponse
    : (apiResponse as any)?.data || [];

  // ২. ১০০% সুরক্ষিত ও কেস-ইনসেনসিটিভ সার্চ ফিল্টারিং লজিক
  const cleanSearchTerm = searchTerm.trim().toLowerCase();

  const filteredLawyers = lawyers.filter((lawyer) => {
    if (!cleanSearchTerm) return true; // সার্চ বার খালি থাকলে সব ডাটা দেখাবে

    // কোনো ফিল্ড ডাটাবেজে undefined বা null থাকলে কোড ক্র্যাশ হওয়া রোধ করতে ডিফেন্সিভ চেকিং
    const name = lawyer?.name ? String(lawyer.name).toLowerCase() : "";
    const specialty = lawyer?.specialty
      ? String(lawyer.specialty).toLowerCase()
      : "";
    const area = lawyer?.area ? String(lawyer.area).toLowerCase() : "";
    const designation = lawyer?.designation
      ? String(lawyer.designation).toLowerCase()
      : "";
    const chamber = lawyer?.chamberAddress
      ? String(lawyer.chamberAddress).toLowerCase()
      : "";

    return (
      name.includes(cleanSearchTerm) ||
      specialty.includes(cleanSearchTerm) ||
      area.includes(cleanSearchTerm) ||
      designation.includes(cleanSearchTerm) ||
      chamber.includes(cleanSearchTerm)
    );
  });

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

        <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition-all transform active:scale-95 w-full md:w-auto">
          <Plus className="w-4 h-4" /> নতুন আইনজীবী যোগ করুন
        </button>
      </div>

      {/* ─── SEARCH & FILTER BAR (HYPER LOOK) ─── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="নাম, পদবী, স্পেশালটি বা এলাকা দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // স্ট্যাট আপডেট হচ্ছে এখানে
            className="w-full pl-10 pr-4 py-3 bg-slate-50/70 text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto justify-end items-center">
          <button
            onClick={() => refetch()}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            রিফ্রেশ ডাটা
          </button>
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5" /> মোট রেকর্ড:{" "}
            {filteredLawyers.length}
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT AREA ─── */}
      {isLoading ? (
        // স্কেলিটন লোডার অ্যানিমেশন
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-20 bg-white border border-slate-100 rounded-xl animate-pulse flex items-center justify-between px-6"
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
        // এরর ভিউ
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
        // নো ডাটা ম্যাচিং ভিউ
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center max-w-md mx-auto mt-6">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">
            কোনো তথ্য পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            আপনার সার্চ কিওয়ার্ডটি চেক করুন অথবা সঠিক ভাষায় টাইপ করুন।
          </p>
        </div>
      ) : (
        <>
          {/* ডেস্কটপ ভিউ (টেবিল লেআউট) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">আইনজীবীর বিবরণ</th>
                  <th className="py-4 px-6">বিশেষজ্ঞতা</th>
                  <th className="py-4 px-6">এরিয়া ও চেম্বার</th>
                  <th className="py-4 px-6">যোগাযোগ (Phone)</th>
                  <th className="py-4 px-6 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredLawyers.map((lawyer) => (
                  <tr
                    key={lawyer._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-50 text-teal-700 font-bold rounded-xl flex items-center justify-center border border-teal-100/50 uppercase">
                          {lawyer.name ? lawyer.name.substring(0, 2) : "LW"}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">
                            {lawyer.name}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium block mt-0.5">
                            {lawyer.designation}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                        <UserCheck className="w-3 h-3" /> {lawyer.specialty}
                      </span>
                    </td>

                    <td className="py-4 px-6 max-w-[220px]">
                      <div className="flex items-start gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {lawyer.area}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {lawyer.chamberAddress}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {lawyer.phone &&
                          lawyer.phone.map((num, idx) => (
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
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg hover:text-slate-800 transition">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* মোবাইল ভিউ (কার্ড লেআউট) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredLawyers.map((lawyer) => (
              <div
                key={lawyer._id}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 text-teal-700 font-bold rounded-xl flex items-center justify-center border border-teal-100">
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
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-md border border-blue-100">
                    {lawyer.specialty}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <p>
                      <span className="font-semibold text-slate-800">
                        {lawyer.area}
                      </span>{" "}
                      - {lawyer.chamberAddress}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div className="font-mono">
                      {lawyer.phone ? lawyer.phone.join(", ") : ""}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">
                    <Edit3 className="w-3.5 h-3.5" /> এডিট
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition">
                    <Trash2 className="w-3.5 h-3.5" /> ডিলিট
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
