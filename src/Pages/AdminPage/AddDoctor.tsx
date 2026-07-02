
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiAward,
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiPhone,
  FiPlus,
  FiTrash2,
  FiSave,
  FiArrowLeft,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAddDoctorMutation } from "../../Redux/features/admin/adminApi";
import { toast } from "sonner";

// ফ্রেমার মোশন অ্যানিমেশন ভ্যারিয়েন্ট
const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// স্পেশালিটি ড্রপডাউনের অপশনসমূহ
const SPECIALITIES = [
  "Cardiologist (Heart Specialist)",
  "Dermatologist (Skin Specialist)",
  "Neurologist (Brain Specialist)",
  "Pediatrician (Child Specialist)",
  "Gynecologist",
  "General Physician",
  "Orthopedic Surgeon",
  "Dentist",
];

// 💡 বরিশালের থানা সমূহের লিস্ট (ড্রপডাউনের জন্য)
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
];

// অভিজ্ঞতা ড্রপডাউনের জন্য ১ থেকে ৫০ বছরের অ্যারে জেনারেটর
const EXPERIENCE_YEARS = Array.from(
  { length: 20 },
  (_, i) => `${i + 1} Year${i > 0 ? "s" : ""} Experience`,
);

const AddDoctor = () => {
  const navigate = useNavigate();
  const [addDoctor, { isLoading }] = useAddDoctorMutation();

  // ফর্ম মেইন স্টেট (area যুক্ত করা হয়েছে)
  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    degree: "",
    experience: "",
    area: "", // 💡 নতুন এরিয়া/থানা স্টেট
    chamberAddress: "",
    visitingHours: "",
  });

  // ফোন নাম্বারের জন্য ডায়নামিক অ্যারে স্টেট
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);

  // সাধারণ ইনপুট ও ড্রপডাউন চেঞ্জ হ্যান্ডলার
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ফোন ইনপুট হ্যান্ডলার (শুধুমাত্র সংখ্যা এবং সর্বোচ্চ ১১ ডিজিট রেস্ট্রিকশন)
  const handlePhoneChange = (index: number, value: string) => {
    const filteredValue = value.replace(/\D/g, "");

    if (filteredValue.length <= 11) {
      const updatedPhones = [...phoneNumbers];
      updatedPhones[index] = filteredValue;
      setPhoneNumbers(updatedPhones);
    }
  };

  // নতুন ফোন নম্বর ফিল্ড যুক্ত করা
  const addPhoneField = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  // ফোন নম্বর ফিল্ড রিমুভ করা
  const removePhoneField = (index: number) => {
    if (phoneNumbers.length > 1) {
      const updatedPhones = phoneNumbers.filter((_, i) => i !== index);
      setPhoneNumbers(updatedPhones);
    }
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // স্পেশালিটি ভ্যালিডেশন
    if (!formData.speciality) {
      toast.error("অনুগ্রহ করে ডাক্তারের বিশেষজ্ঞতা (Speciality) সিলেক্ট করুন");
      return;
    }

    // এরিয়া/থানা ভ্যালিডেশন
    if (!formData.area) {
      toast.error("অনুগ্রহ করে ডাক্তারের এলাকা বা উপজেলা নির্বাচন করুন");
      return;
    }

    // অভিজ্ঞতা ড্রপডাউন ভ্যালিডেশন
    if (!formData.experience) {
      toast.error("অনুগ্রহ করে ডাক্তারের অভিজ্ঞতা (Experience) সিলেক্ট করুন");
      return;
    }

    // খালি ফিল্ডগুলো বাদ দিয়ে ভ্যালিড ফোন ফিল্টার করা
    const validPhones = phoneNumbers.filter((phone) => phone.trim() !== "");

    if (validPhones.length === 0) {
      toast.error("কমপক্ষে একটি সচল ফোন নম্বর দিন");
      return;
    }

    // ১১ ডিজিট পূর্ণ হয়েছে কিনা তা চেক করা
    const isAnyPhoneInvalid = validPhones.some((phone) => phone.length !== 11);
    if (isAnyPhoneInvalid) {
      toast.error("ফোন নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে (উদাঃ 017XXXXXXXX)");
      return;
    }

    // ব্যাকএন্ডে পাঠানোর চূড়ান্ত অবজেক্ট (Zod schema বডি স্ট্রাকচার অনুয়ায়ী)
    const submitData = {
      body: {
        ...formData,
        phone: validPhones,
        isDeleted: false,
      },
    };

    try {
      const res = await addDoctor(submitData.body).unwrap();
      if (res?.success || res) {
        toast.success("নতুন ডাক্তার সফলভাবে যোগ করা হয়েছে!");
        navigate("/dashboard/all-doctors");
      }
    } catch (error: any) {
      console.error("Failed to add doctor:", error);
      toast.error(
        error?.data?.message ||
          "ডাক্তার যোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* টপ বার / ব্যাক বাটন */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard/all-doctors"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors no-underline"
          >
            <FiArrowLeft size={16} />
            তালিকায় ফিরে যান
          </Link>
        </div>

        {/* মেইন ফর্ম কার্ড */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* কার্ড হেডার */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-xl sm:text-2xl font-bold">
              নতুন ডাক্তার যোগ করুন
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">
              ডাক্তারের সঠিক বিবরণ, চেম্বারের ঠিকানা এবং যোগাযোগের তথ্য প্রদান
              করুন।
            </p>
          </div>

          {/* ফর্ম শুরু */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* সেকশন ১: বেসিক প্রোফাইল */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                ১. ব্যক্তিগত ও পেশাগত তথ্য
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* নাম ফিল্ড */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    ডাক্তারের নাম <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="উদাঃ Dr. Sakib Ahmed"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* স্পেশালিটি ড্রপডাউন মেনু */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    বিশেষজ্ঞতা (Speciality){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiAward
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <select
                      name="speciality"
                      required
                      value={formData.speciality}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        -- স্পেশালিটি সিলেক্ট করুন --
                      </option>
                      {SPECIALITIES.map((spec, idx) => (
                        <option key={idx} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* 💡 নতুন এরিয়া / থানা ড্রপডাউন ফিল্ড */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    এলাকা / উপজেলা (Thana){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMapPin
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <select
                      name="area"
                      required
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        -- এলাকা বা থানা সিলেক্ট করুন --
                      </option>
                      {THANAS.map((thana, idx) => (
                        <option key={idx} value={thana.value}>
                          {thana.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* নতুন অভিজ্ঞতা (Experience) ড্রপডাউন ফিল্ড */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    অভিজ্ঞতা (Experience){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiBriefcase
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <select
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        -- অভিজ্ঞতার বছর সিলেক্ট করুন --
                      </option>
                      {EXPERIENCE_YEARS.map((year, idx) => (
                        <option key={idx} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* ডিগ্রি ফিল্ড */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700">
                    ডিগ্রি / শিক্ষাগত যোগ্যতা{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiAward
                      className="absolute left-3.5 top-3 text-gray-400"
                      size={16}
                    />
                    <textarea
                      name="degree"
                      required
                      rows={2}
                      placeholder="উদাঃ MBBS, BCS, FCPS (Medicine)"
                      value={formData.degree}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* সেকশন ২: চেম্বার ও সময়সূচী */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                ২. চেম্বার ও সময়সূচী
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {/* চেম্বার এড্রেস */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    চেম্বারের ঠিকানা <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMapPin
                      className="absolute left-3.5 top-3 text-gray-400"
                      size={16}
                    />
                    <textarea
                      name="chamberAddress"
                      required
                      rows={2}
                      placeholder="উদাঃ Rahat Anwar Hospital, Band Road, Barisal"
                      value={formData.chamberAddress}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                {/* ভিজিটিং আওয়ার */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    রোগী দেখার সময় <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiClock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      name="visitingHours"
                      required
                      placeholder="উদাঃ 5:00 PM - 9:00 PM (Friday Closed)"
                      value={formData.visitingHours}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* সেকশন ৩: ডাইনামিক কন্টাক্ট নম্বরসমূহ ও লাইভ কাউন্টার */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  ৩. যোগাযোগ নম্বর (Phone Array)
                </h3>
                <button
                  type="button"
                  onClick={addPhoneField}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <FiPlus size={14} />
                  নম্বর যোগ করুন
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {phoneNumbers.map((phone, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <FiPhone
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        required={index === 0}
                        placeholder={`ফোন নম্বর ${index + 1}`}
                        value={phone}
                        onChange={(e) =>
                          handlePhoneChange(index, e.target.value)
                        }
                        className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-16 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />

                      {/* ডাইনামিক ডিজিট কাউন্টার */}
                      <span
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium tracking-wider px-1.5 py-0.5 rounded ${
                          phone.length === 11
                            ? "text-green-600 font-bold bg-green-50"
                            : "text-gray-400"
                        }`}
                      >
                        {phone.length}/11
                      </span>
                    </div>

                    {phoneNumbers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePhoneField(index)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="মুছে ফেলুন"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* সাবমিট বাটন অ্যাকশন বার */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard/all-doctors")}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100"
              >
                <FiSave size={16} />
                {isLoading ? "সংরক্ষণ করা হচ্ছে..." : "ডাক্তার সংরক্ষণ করুন"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddDoctor;
