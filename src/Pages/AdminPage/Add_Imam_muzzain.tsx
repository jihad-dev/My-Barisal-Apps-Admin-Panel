import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiAlertCircle,
  FiSave,
  FiArrowLeft,
} from "react-icons/fi";
import { useAddImamMuzzainMutation } from "../../Redux/features/admin/adminApi";
import { Link } from "react-router-dom";

interface IImamMuazzinForm {
  name: string;
  role: "imam" | "muazzin" | "";
  phone: string;
  division: string;
  district: string;
  upazila: string;
  union: string;
  village: string;
  fullAddress: string;
  employmentStatus: "available" | "employed";
}

const Add_Imam_muzzain = () => {
  // RTK Query থেকে isLoading এবং error অবজেক্ট নিয়ে আসা হয়েছে
  const [addImamMuazzinMutation, { isLoading, error: apiError }] =
    useAddImamMuzzainMutation();

  const [formData, setFormData] = useState<IImamMuazzinForm>({
    name: "",
    role: "",
    phone: "",
    division: "",
    district: "",
    upazila: "",
    union: "",
    village: "",
    fullAddress: "",
    employmentStatus: "available",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof IImamMuazzinForm, string>>
  >({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof IImamMuazzinForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const tempErrors: Partial<Record<keyof IImamMuazzinForm, string>> = {};

    if (!formData.name.trim()) {
      tempErrors.name = "ইмам/মুয়াজ্জিনের নাম আবশ্যক";
    } else if (formData.name.trim().length < 3) {
      tempErrors.name = "নাম অন্তত ৩ অক্ষরের হতে হবে";
    }

    if (!formData.role) {
      tempErrors.role = "পদবী নির্বাচন করা আবশ্যক";
    }

    const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = "মোবাইল নম্বর আবশ্যক";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      tempErrors.phone = "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01711123456)";
    }

    if (!formData.division.trim()) tempErrors.division = "বিভাগ আবশ্যক";
    if (!formData.district.trim()) tempErrors.district = "জেলা আবশ্যক";
    if (!formData.upazila.trim()) tempErrors.upazila = "উপজেলা আবশ্যক";
    if (!formData.union.trim()) tempErrors.union = "ইউনিয়ন আবশ্যক";
    if (!formData.village.trim()) tempErrors.village = "গ্রামের নাম আবশ্যক";
    if (!formData.fullAddress.trim())
      tempErrors.fullAddress = "বিস্তারিত ঠিকানা আবশ্যক";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    if (validateForm()) {
      try {
        // RTK Query এপিআই কল
        await addImamMuazzinMutation(formData).unwrap();

        // সফল হলে স্টেট আপডেট ও ফর্ম ক্লিয়ার
        setSubmitSuccess(true);
        setFormData({
          name: "",
          role: "",
          phone: "",
          division: "",
          district: "",
          upazila: "",
          union: "",
          village: "",
          fullAddress: "",
          employmentStatus: "available",
        });

        // ৩ সেকেন্ড পর সাকসেস মেসেজ অটো হাইড করার জন্য
        setTimeout(() => setSubmitSuccess(false), 4000);
      } catch (err) {
        // এপিআই এরর কনসোলে ট্র্যাকিং
        console.error("Submission failed:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 font-sans antialiased text-slate-800">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* টপ ব্যাক ও হেডার পার্ট */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard/all-imam-muazzin">
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <FiArrowLeft /> তালিকায় ফিরে যান
            </button>
          </Link>
        </div>

        {/* মেইন ফর্ম কার্ড */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden p-6 sm:p-8"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />

          <div className="mb-8">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <FiUser className="text-emerald-500" /> নতুন ইমাম / মুয়াজ্জিন
              যুক্ত করুন
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              নিচের ফর্মে সঠিক তথ্য দিয়ে ডাটাবেজে নতুন সদস্য প্রোফাইল তৈরি
              করুন।
            </p>
          </div>

          {/* সাকসেস নোটিফিকেশন ব্যানার */}
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center gap-3 text-sm font-bold"
            >
              <FiCheckCircle size={20} className="text-emerald-600 shrink-0" />
              সফলভাবে নতুন সদস্য ডাটাবেজে যুক্ত করা হয়েছে!
            </motion.div>
          )}

          {/* সার্ভার/ব্যাকএন্ড এরর ব্যানার */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-800 flex items-center gap-3 text-sm font-bold"
            >
              <FiAlertCircle size={20} className="text-red-600 shrink-0" />
              {(apiError as any)?.data?.message ||
                "সার্ভারে সমস্যা হয়েছে! অনুগ্রহ করে আবার চেষ্টা করুন।"}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ১. বেসিক ইনফরমেশন সেকশন */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <FiUser size={14} /> প্রাথমিক তথ্য (Basic Info)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* নাম ইনপুট */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">
                    পূর্ণ নাম *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="যেমন: মো: হাসান"
                    className={`w-full px-4 py-2.5 bg-white border ${errors.name ? "border-red-400 focus:ring-red-500/5" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/5"} focus:ring-4 rounded-xl outline-none transition-all font-medium text-sm text-slate-900`}
                  />
                  {errors.name && (
                    <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                      <FiAlertCircle size={12} /> {errors.name}
                    </p>
                  )}
                </div>

                {/* পদবী নির্বাচন */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">
                    পদবী (Role) *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-white border ${errors.role ? "border-red-400 focus:ring-red-500/5" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/5"} focus:ring-4 rounded-xl outline-none transition-all font-bold text-sm text-slate-700 cursor-pointer`}
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="imam">ইмам (Imam)</option>
                    <option value="muazzin">মুয়াজ্জিন (Muazzin)</option>
                  </select>
                  {errors.role && (
                    <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                      <FiAlertCircle size={12} /> {errors.role}
                    </p>
                  )}
                </div>

                {/* ফোন নম্বর */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">
                    মো바일 নম্বর *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                      <FiPhone size={14} className="inline mr-1" />
                    </span>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01711XXXXXX"
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.phone ? "border-red-400 focus:ring-red-500/5" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/5"} focus:ring-4 rounded-xl outline-none transition-all font-mono font-medium text-sm text-slate-900`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                      <FiAlertCircle size={12} /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* কর্মসংস্থান স্ট্যাটাস */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">
                    কর্মসংস্থান স্ট্যাটাস
                  </label>
                  <select
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-xl outline-none transition-all font-bold text-sm text-slate-700 cursor-pointer"
                  >
                    <option value="available">
                      এভেইলেবল / ফ্রি আছেন (Available)
                    </option>
                    <option value="employed">কর্মরত আছেন (Employed)</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* ২. ঠিকানা ও অবস্থান সেকশন */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <FiMapPin size={14} /> ঠিকানা ও অবস্থান (Address & Location)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* বিভাগ */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">
                    বিভাগ *
                  </label>
                  <input
                    type="text"
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                    placeholder="যেমন: বরিশাল"
                    className={`w-full px-4 py-2.5 bg-white border ${errors.division ? "border-red-400" : "border-slate-200 focus:border-emerald-500"} rounded-xl outline-none transition-all font-medium text-sm`}
                  />
                  {errors.division && (
                    <p className="text-[11px] font-bold text-red-500 mt-0.5">
                      {errors.division}
                    </p>
                  )}
                </div>

                {/* জেলা */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">
                    জেলা *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="যেমন: বরিশাল"
                    className={`w-full px-4 py-2.5 bg-white border ${errors.district ? "border-red-400" : "border-slate-200 focus:border-emerald-500"} rounded-xl outline-none transition-all font-medium text-sm`}
                  />
                  {errors.district && (
                    <p className="text-[11px] font-bold text-red-500 mt-0.5">
                      {errors.district}
                    </p>
                  )}
                </div>

                {/* উপজেলা */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">
                    উপজেলা *
                  </label>
                  <input
                    type="text"
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleChange}
                    placeholder="যেমন: বাকেরগঞ্জ"
                    className={`w-full px-4 py-2.5 bg-white border ${errors.upazila ? "border-red-400" : "border-slate-200 focus:border-emerald-500"} rounded-xl outline-none transition-all font-medium text-sm`}
                  />
                  {errors.upazila && (
                    <p className="text-[11px] font-bold text-red-500 mt-0.5">
                      {errors.upazila}
                    </p>
                  )}
                </div>

                {/* ইউনিয়ন */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700">
                    ইউনিয়ন *
                  </label>
                  <input
                    type="text"
                    name="union"
                    value={formData.union}
                    onChange={handleChange}
                    placeholder="যেমন: দাড়িয়াল"
                    className={`w-full px-4 py-2.5 bg-white border ${errors.union ? "border-red-400" : "border-slate-200 focus:border-emerald-500"} rounded-xl outline-none transition-all font-medium text-sm`}
                  />
                  {errors.union && (
                    <p className="text-[11px] font-bold text-red-500 mt-0.5">
                      {errors.union}
                    </p>
                  )}
                </div>

                {/* গ্রাম */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-black text-slate-700">
                    গ্রাম *
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    placeholder="যেমন: উত্তর দাড়িয়াল"
                    className={`w-full px-4 py-2.5 bg-white border ${errors.village ? "border-red-400" : "border-slate-200 focus:border-emerald-500"} rounded-xl outline-none transition-all font-medium text-sm`}
                  />
                  {errors.village && (
                    <p className="text-[11px] font-bold text-red-500 mt-0.5">
                      {errors.village}
                    </p>
                  )}
                </div>
              </div>

              {/* বিস্তারিত/পূর্ণ ঠিকানা */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700">
                  পূর্ণাঙ্গ ঠিকানা *
                </label>
                <textarea
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  rows={2}
                  placeholder="গ্রাম, ইউনিয়ন, উপজেলা, জেলা সাজিয়ে লিখুন..."
                  className={`w-full px-4 py-2.5 bg-white border ${errors.fullAddress ? "border-red-400" : "border-slate-200 focus:border-emerald-500"} rounded-xl outline-none transition-all font-medium text-sm text-slate-900 resize-none`}
                />
                {errors.fullAddress && (
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-0.5">
                    <FiAlertCircle size={12} /> {errors.fullAddress}
                  </p>
                )}
              </div>
            </div>

            {/* সাবমিট অ্যাকশন বাটন সেকশন */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-900/10 active:scale-98 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
              >
                {isLoading ? (
                  <>ডাটা সেভ হচ্ছে...</>
                ) : (
                  <>
                    <FiSave size={16} /> সংরক্ষণ করুন (Save Profile)
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Add_Imam_muzzain;
