import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiDroplet,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiPlusCircle,
  FiArrowLeft,
  FiLoader,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "sonner";
import { useRegisterDonarMutation } from "../../Redux/features/admin/adminApi";

// অ্যানিমেশন ভ্যারিয়েন্ট
const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// বাংলাদেশের ১১ ডিজিটের মোবাইল নম্বর ভ্যালিডেশন Regex
const bdPhoneRegex = /^(01[3-9]\d{8})$/;

const RegisterDonor = () => {
  const navigate = useNavigate();
  const [addDonor, { isLoading }] = useRegisterDonarMutation();

  // ১. ফর্ম স্টেট
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    area: "",
    phone: "",
    lastDonationDate: "",
  });

  // সাধারণ ইনপুট হ্যান্ডলার
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ফোন নম্বর ইনপুট রেস্ট্রিকশন হ্যান্ডলার
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const filteredValue = value.replace(/\D/g, ""); // সংখ্যা ছাড়া বাকি সব বাদ

    if (filteredValue.length <= 11) {
      setFormData((prev) => ({ ...prev, phone: filteredValue }));
    }
  };

  // ২. ফর্ম সাবমিট এবং ভ্যালিডেশন লজিক
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ফ্রন্টএন্ড ট্রিম ও রিকোয়ার্ড ফিল্ড ভ্যালিডেশন
    if (!formData.name.trim()) {
      toast.error("রক্তদাতার নাম প্রয়োজন");
      return;
    }
    if (!formData.bloodGroup) {
      toast.error("রক্তের গ্রুপ নির্বাচন করুন");
      return;
    }
    if (!formData.area.trim()) {
      toast.error("এলাকা বা উপজেলার নাম প্রয়োজন");
      return;
    }
    if (!bdPhoneRegex.test(formData.phone)) {
      toast.error(
        "সদস্যের সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (উদাঃ 018XXXXXXXX)",
      );
      return;
    }

    // ব্যাকএন্ড স্কিমা অনুযায়ী পে-লোড অবজেক্ট তৈরি
    const submitData = {
      name: formData.name.trim(),
      bloodGroup: formData.bloodGroup,
      area: formData.area.trim(),
      phone: formData.phone, // ব্যাকএন্ড যদি স্ট্রিং এক্সপেক্ট করে তবে সরাসরি স্ট্রিং যাবে
      lastDonationDate: formData.lastDonationDate || undefined, // ফাঁকা থাকলে পাঠানো হবে না
      isAvailable: true, // নতুন ডোনার বাই-ডিফল্ট প্রস্তুত
    };

    let toastId: string | number = "";
    try {
      toastId = toast.loading(
        "নতুন রক্তদাতার তথ্য ডাটাবেজে সংরক্ষণ করা হচ্ছে...",
      );

      // আরটিকে কুয়েরি মিউটেশন ট্রিগার
      await addDonor(submitData).unwrap();

      toast.success("সফলভাবে নতুন রক্তদাতা নিবন্ধিত হয়েছে!", { id: toastId });

      // ফর্ম রিসেট
      setFormData({
        name: "",
        bloodGroup: "",
        area: "",
        phone: "",
        lastDonationDate: "",
      });

      navigate("/dashboard/blood-donors");
    } catch (error: any) {
      console.error("Donor Submit Error: ", error);
      toast.error(error?.data?.message || "রক্তদাতা যুক্ত করতে ব্যর্থ হয়েছে!", {
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
        {/* ব্যাক বাটন */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard/all-donors"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-600 no-underline transition-colors font-medium"
          >
            <FiArrowLeft size={16} /> তালিকায় ফিরে যান
          </Link>
        </div>

        {/* মেইন ফর্ম কার্ড */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* কার্ড হেডার ব্যানার */}
          <div className="bg-gradient-to-r from-rose-600 to-red-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <FiDroplet size={24} className="fill-white/20" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  নতুন রক্তদাতা নিবন্ধন করুন
                </h2>
                <p className="text-xs text-rose-100 mt-0.5">
                  জরুরি মুহূর্তে জীবন বাঁচাতে রক্তদাতার সঠিক প্রোফাইল বিবরণ ও
                  রক্তের গ্রুপ এন্ট্রি করুন।
                </p>
              </div>
            </div>
          </div>

          {/* ফর্ম শুরু */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* ইনপুট গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* রক্তদাতার নাম */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  রক্তদাতার নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="উদা: কাউছার আহমেদ"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-500 focus:bg-white focus:ring-1 focus:ring-rose-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* রক্তের গ্রুপ সিলেকশন ড্রপডাউন */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  রক্তের গ্রুপ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiDroplet className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    name="bloodGroup"
                    required
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-500 focus:bg-white focus:ring-1 focus:ring-rose-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      গ্রুপ সিলেক্ট করুন
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* মোবাইল নম্বর ও লাইভ কাউন্টার */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    required
                    inputMode="numeric"
                    placeholder="উদা: 01855667769"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full bg-gray-50/50 text-gray-900 text-sm font-mono pl-10 pr-16 py-2.5 rounded-xl border border-gray-200 focus:border-rose-500 focus:bg-white focus:ring-1 focus:ring-rose-500 outline-none transition-all"
                  />
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium tracking-wider px-1.5 py-0.5 rounded ${
                      formData.phone.length === 11
                        ? "text-green-600 font-bold bg-green-50"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.phone.length}/11
                  </span>
                </div>
              </div>

              {/* এলাকা / উপজেলা */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  এলাকা / উপজেলা <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="area"
                    required
                    placeholder="উদা: বাকেরগঞ্জ"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-500 focus:bg-white focus:ring-1 focus:ring-rose-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* সর্বশেষ রক্তদানের তারিখ (ঐচ্ছিক) */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  সর্বশেষ রক্তদানের তারিখ (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="lastDonationDate"
                    value={formData.lastDonationDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-500 focus:bg-white focus:ring-1 focus:ring-rose-500 outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* অ্যাকশন বাটন এরিয়া */}
            <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard/all-donors")}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-rose-700 hover:to-red-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md shadow-rose-100 cursor-pointer w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin" size={16} />
                    ডাটা সেভ হচ্ছে...
                  </>
                ) : (
                  <>
                    <FiPlusCircle size={16} />
                    নিবন্ধন সম্পন্ন করুন
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

export default RegisterDonor;
