import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiShield,
  FiTrash2,
  FiArrowLeft,
  FiMapPin,
  FiPhone,
  FiLayers,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAddFireStationMutation } from "../../Redux/features/admin/adminApi";
import { toast } from "sonner";

interface FireStationFormData {
  name: string;
  type: "government" | "volunteer";
  status: "active" | "inactive";
  area: string;
}

const STATION_TYPES = [
  { label: "Government (সরকারি)", value: "government" },
  { label: "Volunteer (স্বেচ্ছাসেবী)", value: "volunteer" },
];

const Add_Fire_Service = () => {
  const [addFireStation, { isLoading }] = useAddFireStationMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FireStationFormData>({
    name: "",
    type: "government",
    area: "",
    status: "active",
  });

  const [phones, setPhones] = useState<string[]>([""]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof FireStationFormData]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 📞 ১. রিয়েল-টাইম টাইপিং ভেরিফিকেশন (১১ ডিজিট লক)
  const handlePhoneChange = (index: number, value: string) => {
    // শুধু সংখ্যা ইনপুট নেওয়ার লক (স্পেস বা টেক্সট রিমুভ করবে)
    const cleanValue = value.replace(/[^0-9]/g, "");

    const updatedPhones = [...phones];
    updatedPhones[index] = cleanValue;
    setPhones(updatedPhones);

    const errorKey = `phone_${index}`;

    // রিয়েল-টাইম এরর চেক
    if (cleanValue.length > 5 && cleanValue.length < 11) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে!",
      }));
    } else if (cleanValue.length > 11) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "১১ ডিজিটের বেশি নম্বর নেওয়া যাবে না!",
      }));
    } else {
      // যদি শর্টকোড (<=5) হয় অথবা একদম ১১ ডিজিট হয়, তবে এরর মুছে যাবে
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addPhoneField = () => setPhones([...phones, ""]);

  const removePhoneField = (index: number) => {
    const updatedPhones = phones.filter((_, i) => i !== index);
    setPhones(updatedPhones);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`phone_${index}`];
      return newErrors;
    });
  };

  // 🛠️ ২. সাবমিট করার সময় ১১ ডিজিট ফাইনাল ভেরিফিকেশন
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "নাম দিন";
    if (!formData.area.trim()) newErrors.area = "এلاকা দিন";

    phones.forEach((phone, index) => {
      const cleanPhone = phone.trim();
      if (!cleanPhone) {
        newErrors[`phone_${index}`] = "কমপক্ষে একটি নম্বর দিন";
      } else if (cleanPhone.length > 5 && cleanPhone.length !== 11) {
        // ৫ ডিজিটের বেশি হলে সেটা অবশ্যই ১১ ডিজিট হতে হবে
        newErrors[`phone_${index}`] =
          "মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে!";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return toast.error("অনুগ্রহ করে ফর্মের ভুলগুলো ঠিক করুন!");
    }

    const finalData = {
      name: formData.name,
      type: formData.type,
      status: formData.status,
      area: formData.area,
      phone: phones.filter((p) => p.trim() !== ""),
    };

    let toastId = "";
    try {
      toastId = toast.loading("নতুন ফায়ার স্টেশন যুক্ত করা হচ্ছে...");
      await addFireStation(finalData).unwrap();

      toast.success("নতুন ফায়ার স্টেশন সফলভাবে যুক্ত হয়েছে!", { id: toastId });
      navigate("/dashboard/fire-stations");
    } catch (error: any) {
      const errorMsg =
        error?.data?.issues?.[0]?.message ||
        error?.data?.message ||
        "স্টেশনটি যোগ করতে ব্যর্থ হয়েছে!";
      toast.error(errorMsg, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* টপ হেডার */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
              <FiShield size={22} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                নতুন ফায়ার স্টেশন যুক্ত করুন
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                My Barisal অ্যাপ ডিরেক্টরিতে ১১ ডিজিট ভেরিফাইড নম্বর সহ নতুন
                স্টেশন এন্ট্রি দিন।
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/fire-stations"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-100 transition-all no-underline"
          >
            <FiArrowLeft size={14} /> ফিরে যান
          </Link>
        </div>

        {/* মেইন ফর্ম */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6"
        >
          {/* সেকশন ১: বেসিক ইনফরমেশন */}
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <FiShield size={13} className="text-gray-400" /> ফায়ার স্টেশনের
                নাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="উদাঃ বরিশাল ফায়ার সার্ভিস ও সিভিল ডিফেন্স"
                className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/10 outline-none transition-all font-medium"
              />
              {errors.name && (
                <span className="text-xs font-bold text-rose-500">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <FiLayers size={13} className="text-gray-400" /> স্টেশনের ধরন{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/10 outline-none transition-all font-medium cursor-pointer"
                >
                  {STATION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <FiMapPin size={13} className="text-gray-400" /> এলাকা/উপজেলা{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="উদাঃ বরিশাল সদর"
                  className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/10 outline-none transition-all font-medium"
                />
                {errors.area && (
                  <span className="text-xs font-bold text-rose-500">
                    {errors.area}
                  </span>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 📞 সেকশন ২: ফোন নম্বরসমূহ (১১ ডিজিট ভেরিফিকেশন ব্যাজ সহ) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <FiPhone size={13} className="text-gray-400" /> কন্টাক্ট
                নম্বরসমূহ (হটলাইন বা মোবাইল){" "}
                <span className="text-rose-500">*</span>
              </span>
              <button
                type="button"
                onClick={addPhoneField}
                className="text-[10px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md border border-rose-100 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
              >
                + আরও নম্বর যোগ করুন
              </button>
            </label>

            <div className="grid grid-cols-1 gap-3">
              {phones.map((phone, index) => {
                const phoneError = errors[`phone_${index}`];
                const isHotline = phone.length > 0 && phone.length <= 5;
                const isFullyValid = phone.length === 11;

                return (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 relative">
                      <div className="relative w-full flex items-center">
                        <input
                          type="text"
                          value={phone}
                          maxLength={11} // ১১ ডিজিটের বেশি টাইপ করা লক করে দেওয়া হলো
                          placeholder="উদাঃ 199 বা 017XXXXXXXX"
                          onChange={(e) =>
                            handlePhoneChange(index, e.target.value)
                          }
                          className={`w-full bg-gray-50 text-gray-900 text-sm pl-4 pr-20 py-2.5 rounded-xl border focus:bg-white focus:ring-2 outline-none transition-all font-mono font-semibold ${
                            phoneError
                              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                              : "border-gray-200 focus:border-rose-500 focus:ring-rose-500/10"
                          }`}
                        />
                        {/* 🟢 ডাইনামিক রিয়েল-টাইম ১১ ডিজিট কাউন্টার */}
                        {phone.length > 0 && (
                          <span
                            className={`absolute right-3 px-1.5 py-0.5 text-[9px] font-black rounded-md font-sans select-none ${
                              isHotline
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : isFullyValid
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : "bg-rose-50 text-rose-500 border border-rose-100"
                            }`}
                          >
                            {isHotline ? "Hotline" : `${phone.length}/11`}
                          </span>
                        )}
                      </div>
                      {phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePhoneField(index)}
                          className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100 cursor-pointer flex-shrink-0"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      )}
                    </div>
                    {phoneError && (
                      <span className="text-[11px] font-bold text-rose-500 px-1">
                        {phoneError}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* সাবমিট প্যানেল */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <Link
              to="/dashboard/fire-stations"
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all no-underline cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-600 via-orange-600 to-red-600 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/10 hover:shadow-lg hover:shadow-rose-600/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer border border-white/10"
            >
              {isLoading ? "সংরক্ষণ করা হচ্ছে..." : "নতুন স্টেশন সেভ করুন"}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Add_Fire_Service;
