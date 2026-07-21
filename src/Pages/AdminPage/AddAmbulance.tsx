/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiTruck,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiTrash2,
  FiSave,
  FiArrowLeft,
  FiLayers,
  FiHome,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAddAmbulanceMutation } from "../../Redux/features/admin/adminApi";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ডাটাবেজের TAmbulanceType ইন্টারফেসের সাথে সামঞ্জস্যপূর্ণ অপশনসমূহ
const AMBULANCE_TYPES = [
  { value: "government", label: "সরকারি (Government)" },
  { value: "private", label: "বেসরকারি (Private / ICU / Freezer)" },
  { value: "volunteer", label: "স্বেচ্ছাসেবী (Volunteer)" },
];

// আপনার অল অ্যাম্বুলেন্স লিস্টের সাথে হুবহু মিল রাখা থানার তালিকা
const THANAS = [
  { key: "barisal sadar", label: "বরিশাল সদর" },
  { key: "bakerganj", label: "বাকেরগঞ্জ" },
  { key: "wazirpur", label: "উজিরপুর" },
  { key: "babuganj", label: "বাবুগঞ্জ" },
  { key: "banaripara", label: "বানারীপাড়া" },
  { key: "gournadi", label: "গৌরনদী" },
  { key: "agailjhara", label: "আগৈলঝারা" },
  { key: "mehendiganj", label: "মেহেন্দিগঞ্জ" },
  { key: "muladi", label: "মুলাদী" },
  { key: "hizla", label: "হিজলা" },
];

const AddAmbulance = () => {
  const navigate = useNavigate();
  const [addAmbulance, { isLoading }] = useAddAmbulanceMutation();

  // মেইন স্টেট (থানা এবং পূর্ণ ঠিকানা যুক্ত করা হয়েছে)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    thana: "",
    area: "",
    address: "",
  });

  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (index: number, value: string) => {
    const filteredValue = value.replace(/\D/g, "");
    if (filteredValue.length <= 11) {
      const updatedPhones = [...phoneNumbers];
      updatedPhones[index] = filteredValue;
      setPhoneNumbers(updatedPhones);
    }
  };

  const addPhoneField = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const removePhoneField = (index: number) => {
    if (phoneNumbers.length > 1) {
      const updatedPhones = phoneNumbers.filter((_, i) => i !== index);
      setPhoneNumbers(updatedPhones);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type) {
      toast.error("অনুগ্রহ করে অ্যাম্বুলেন্সের টাইপ সিলেক্ট করুন");
      return;
    }

    if (!formData.thana) {
      toast.error("অনুগ্রহ করে নির্দিষ্ট থানা সিলেক্ট করুন");
      return;
    }

    const validPhones = phoneNumbers.filter((phone) => phone.trim() !== "");

    if (validPhones.length === 0) {
      toast.error("কমপক্ষে একটি সচল ফোন নম্বর দিন");
      return;
    }

    const isAnyPhoneInvalid = validPhones.some((phone) => phone.length !== 11);
    if (isAnyPhoneInvalid) {
      toast.error("ফোন নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে (উদাঃ 017XXXXXXXX)");
      return;
    }

    const submitData = {
      ...formData,
      phone: validPhones,
      isDeleted: false,
    };

    let toastId: string | number = "";
    try {
      toastId = toast.loading("অ্যাম্বুলেন্স যোগ করা হচ্ছে...");
      const res = await addAmbulance(submitData as any).unwrap();

      if (res?.success || res) {
        toast.success("নতুন অ্যাম্বুলেন্স সফলভাবে যোগ করা হয়েছে!", {
          id: toastId,
        });
        navigate("/dashboard/all-ambulances");
      }
    } catch (error: any) {
      console.error("Failed to add ambulance:", error);
      toast.error(
        error?.data?.message ||
          "অ্যাম্বুলেন্স যোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        { id: toastId },
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
            to="/dashboard/all-ambulances"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors no-underline"
          >
            <FiArrowLeft size={16} />
            তালিকায় ফিরে যান
          </Link>
        </div>

        {/* মেইন ফর্ম কার্ড */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* কার্ড হেডার */}
          <div className="bg-gradient-to-r from-red-500 to-amber-600 p-6 text-white">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <FiTruck /> নতুন অ্যাম্বুলেন্স যোগ করুন
            </h1>
            <p className="text-red-100 text-xs sm:text-sm mt-1">
              জরুরি সেবার জন্য অ্যাম্বুলেন্সের নাম, সঠিক থানা, এলাকা এবং ২৪
              ঘণ্টা সচল যোগাযোগের নম্বর প্রদান করুন।
            </p>
          </div>

          {/* ফর্ম শুরু */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* সেকশন ১: অ্যাম্বুলেন্স বিবরণ */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                ১. অ্যাম্বুলেন্সের সাধারণ বিবরণ
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* নাম ফিল্ড */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700">
                    অ্যাম্বুলেন্স / সার্ভিস এর নাম{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiTruck
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="উদাঃ বরিশাল সদর জেনারেল এম্বুল্যান্স সার্ভিস"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* টাইপ ড্রপডাউন মেনু */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    অ্যাম্বুলেন্স টাইপ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiLayers
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <select
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        -- টাইপ সিলেক্ট করুন --
                      </option>
                      {AMBULANCE_TYPES.map((typeObj) => (
                        <option key={typeObj.value} value={typeObj.value}>
                          {typeObj.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* থানা ড্রপডাউন মেনু (নতুন যুক্ত করা হলো) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    থানা সিলেক্ট করুন <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMapPin
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <select
                      name="thana"
                      required
                      value={formData.thana}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        -- থানা সিলেক্ট করুন --
                      </option>
                      {THANAS.map((thanaObj) => (
                        <option key={thanaObj.key} value={thanaObj.key}>
                          {thanaObj.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* এরিয়া / সুনির্দিষ্ট এলাকা ফিল্ড */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    সার্ভিস এরিয়া / সুনির্দিষ্ট এলাকা{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMapPin
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      name="area"
                      required
                      placeholder="উদাঃ বান্দ রোড, চাঁদমারী, ইচলাদী"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* পূর্ণ ঠিকানা ফিল্ড (নতুন যুক্ত করা হলো) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    পূর্ণ ঠিকানা (Full Address){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiHome
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="উদাঃ জেনারেল হাসপাতাল প্রাঙ্গণ, সদর রোড, বরিশাল"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* সেকশন ২: ডাইনামিক ফোন নম্বরসমূহ */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  ২. জরুরি কন্টাক্ট নম্বরসমূহ (Phone Array)
                </h3>
                <button
                  type="button"
                  onClick={addPhoneField}
                  className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
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
                        placeholder={`মোবাইল নম্বর ${index + 1}`}
                        value={phone}
                        onChange={(e) =>
                          handlePhoneChange(index, e.target.value)
                        }
                        className="w-full bg-gray-50 text-gray-900 text-sm pl-10 pr-16 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 outline-none transition-all"
                      />
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
                onClick={() => navigate("/dashboard/all-ambulances")}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                বাতিল করুন
              </button>

              <motion.div
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-red-100"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>সংরক্ষণ করা হচ্ছে...</span>
                    </div>
                  ) : (
                    <>
                      <FiSave size={16} />
                      <span>অ্যাম্বুলেন্স সংরক্ষণ করুন</span>
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddAmbulance;
