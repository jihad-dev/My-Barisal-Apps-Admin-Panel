
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiShield,
  FiMapPin,
  FiUser,
  FiPhone,
  FiPlusCircle,
  FiArrowLeft,
  FiLoader,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAddPoliceStationMutation} from "../../Redux/features/admin/adminApi";
import { toast } from "sonner";

// ফ্রেমার মোশন অ্যানিমেশন ভ্যারিয়েন্ট
const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// বাংলাদেশের মোবাইল নম্বর ভ্যালিডেশন Regex (১১ ডিজিট)
const bdPhoneRegex = /^(01[3-9]\d{8})$/;

const AddPoliceStation = () => {
  const navigate = useNavigate();
  const [addPoliceStation, { isLoading }] = useAddPoliceStationMutation();

  // ১. ফর্ম মেইন স্টেট (React Hook Form ছাড়া ম্যানুয়াল স্টেট)
  const [formData, setFormData] = useState({
    thanaName: "",
    location: "",
    ocName: "",
    ocNumber: "",
    dutyOfficer: "",
    controlRoom: "",
  });

  // সাধারণ টেক্সট ইনপুট চেঞ্জ হ্যান্ডলার
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ফোন ইনপুট হ্যান্ডলার (শুধুমাত্র সংখ্যা এবং সর্বোচ্চ ১১ ডিজিট রেস্ট্রিকশন)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/\D/g, ""); // সংখ্যা ছাড়া বাকি সব বাদ

    if (filteredValue.length <= 11) {
      setFormData((prev) => ({ ...prev, [name]: filteredValue }));
    }
  };

  // ২. সাবমিট এবং Zod স্কিমা ম্যাচিং হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ফ্রন্টএন্ড ট্রিম (Trim) ভ্যালিডেশন ফিক্সড
    if (!formData.thanaName.trim()) {
      toast.error("থানার নাম প্রয়োজন");
      return;
    }
    if (!formData.ocName.trim()) {
      toast.error("ওসির নাম প্রয়োজন");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("ঠিকানা/লোকেশন প্রয়োজন");
      return;
    }

    // ওসি নম্বর ভ্যালিডেশন
    if (!bdPhoneRegex.test(formData.ocNumber)) {
      toast.error("সঠিক ১১ ডিজিটের ওসি নম্বর দিন (উদাঃ 013XXXXXXXX)");
      return;
    }

    // ডিউটি অফিসার নম্বর ভ্যালিডেশন
    if (!bdPhoneRegex.test(formData.dutyOfficer)) {
      toast.error("সঠিক ১১ ডিজিটের ডিউটি অফিসার নম্বর দিন (উদাঃ 013XXXXXXXX)");
      return;
    }

    // সাবমিট ডাটা অবজেক্ট তৈরি
    const submitData = {
      thanaName: formData.thanaName.trim(),
      location: formData.location.trim(),
      ocName: formData.ocName.trim(),
      ocNumber: formData.ocNumber,
      dutyOfficer: formData.dutyOfficer,
      controlRoom: formData.controlRoom.trim() || undefined, // ফাঁকা থাকলে ব্যাকএন্ডে পাঠানো হবে না
    };

    let toastId: string | number = "";
    try {
      toastId = toast.loading("নতুন পুলিশ স্টেশন যোগ করা হচ্ছে...");

      // রিডাক্স মিউটেশন ট্রিগার
      await addPoliceStation(submitData).unwrap();

      toast.success("সফলভাবে নতুন পুলিশ স্টেশন যুক্ত হয়েছে!", { id: toastId });

      // স্টেট ক্লিন করা
      setFormData({
        thanaName: "",
        location: "",
        ocName: "",
        ocNumber: "",
        dutyOfficer: "",
        controlRoom: "",
      });

      navigate("/dashboard/all-police");
    } catch (error: any) {
      console.error("Redux Submit Error: ", error);
      toast.error(error?.data?.message || "স্টেশন যোগ করতে ব্যর্থ হয়েছে!", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex justify-center items-start">
      <motion.div
        className="w-full max-w-3xl space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* টপ বার / ব্যাক বাটন */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard/all-police"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 no-underline transition-colors font-medium"
          >
            <FiArrowLeft size={16} /> তালিকায় ফিরে যান
          </Link>
        </div>

        {/* মেইন ফর্ম কার্ড */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* কার্ড হেডার ব্যানার */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <FiShield size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  নতুন থানা/স্টেশন যুক্ত করুন
                </h2>
                <p className="text-xs text-blue-100 mt-0.5">
                  প্রশাসনিক এলাকার সঠিক বিবরণ, দ্বায়িত্বরত কর্মকর্তা এবং
                  যোগাযোগ নম্বর এন্ট্রি করুন।
                </p>
              </div>
            </div>
          </div>

          {/* ফর্ম শুরু */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* সেকশন: তথ্য ইনপুট গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* থানার নাম */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  থানা / ফাঁড়ির নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="thanaName"
                    required
                    placeholder="উদা: Kotwali Model Thana"
                    value={formData.thanaName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* ওসির নাম */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  দ্বায়িত্বরত কর্মকর্তা (OC) নাম{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="ocName"
                    required
                    placeholder="উদা: Md. Rafiqul Islam"
                    value={formData.ocName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* ওসির নম্বর ও লাইভ কাউন্টার */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  ওসি (OC) মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="ocNumber"
                    required
                    inputMode="numeric"
                    placeholder="উদা: 01320150000"
                    value={formData.ocNumber}
                    onChange={handlePhoneChange}
                    className="w-full bg-gray-50/50 text-gray-900 text-sm font-mono pl-10 pr-16 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium tracking-wider px-1.5 py-0.5 rounded ${
                      formData.ocNumber.length === 11
                        ? "text-green-600 font-bold bg-green-50"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.ocNumber.length}/11
                  </span>
                </div>
              </div>

              {/* ডিউটি অফিসার নম্বর ও লাইভ কাউন্টার */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  ডিউটি অফিসার নম্বর <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="dutyOfficer"
                    required
                    inputMode="numeric"
                    placeholder="উদা: 01320150001"
                    value={formData.dutyOfficer}
                    onChange={handlePhoneChange}
                    className="w-full bg-gray-50/50 text-gray-900 text-sm font-mono pl-10 pr-16 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium tracking-wider px-1.5 py-0.5 rounded ${
                      formData.dutyOfficer.length === 11
                        ? "text-green-600 font-bold bg-green-50"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.dutyOfficer.length}/11
                  </span>
                </div>
              </div>

              {/* কন্ট্রোল রুম নম্বর (ঐচ্ছিক) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  কন্তট্রোল রুম নম্বর (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="controlRoom"
                    placeholder="উদা: 0431-64444"
                    value={formData.controlRoom}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 text-gray-900 text-sm font-mono pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* লোকেশন / ঠিকানা */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  লোকেশন / ঠিকানা <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="উদা: Bibi Pukur Par, Barisal"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* অ্যাকশন বাটন এরিয়া */}
            <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard/all-police")}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100 cursor-pointer w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin" size={16} />
                    ডাটাবেজে সেভ হচ্ছে...
                  </>
                ) : (
                  <>
                    <FiPlusCircle size={16} />
                    স্টেশন যুক্ত করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddPoliceStation;
