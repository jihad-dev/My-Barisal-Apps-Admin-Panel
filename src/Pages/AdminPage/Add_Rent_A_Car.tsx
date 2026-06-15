import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiTruck,
  FiTrash2,
  FiArrowLeft,
  FiUser,
  FiMapPin,
  FiPhone,
  FiDollarSign,
  FiLayers,
  FiFileText,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAddCarMutation } from "../../Redux/features/admin/adminApi";
import { toast } from "sonner";

// ১. টাইপস্ক্রিপ্ট এরর ফিক্স করার জন্য ইন্টারফেস ডিফাইন
interface CarFormData {
  serviceName: string;
  proprietorName: string;
  description: string;
  area: string;
  upazila: string;
  serviceArea: string;
  whatsapp: string;
  rentPerDay: string | number;
  rentPerTrip: string | number;
  status: string;
}

const AVAILABLE_CAR_TYPES = [
  { label: "Car", value: "car" },
  { label: "Hiace", value: "hiace" },
  { label: "Microbus", value: "microbus" },
  { label: "Noah", value: "noah" },
  { label: "Ambulance", value: "ambulance" },
  { label: "Pickup", value: "pickup" },
];

const Add_Rent_A_Car = () => {
  const [addCar, { isLoading }] = useAddCarMutation();
  const navigate = useNavigate();

  // ২. ইন্টারফেস অনুযায়ী স্টেট ডিক্লেয়ারেশন
  const [formData, setFormData] = useState<CarFormData>({
    serviceName: "",
    proprietorName: "",
    description: "",
    area: "",
    upazila: "",
    serviceArea: "",
    whatsapp: "",
    rentPerDay: "",
    rentPerTrip: "",
    status: "available",
  });

  const [phones, setPhones] = useState<string[]>([""]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ৩. ইনপুট চেঞ্জ হ্যান্ডলার (টাইপস্ক্রিপ্ট সেফ)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name as keyof CarFormData]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // ৪. হোয়াটসঅ্যাপ নম্বর ইনপুট ও লক মেকানিজম
  const handleWhatsappChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 11);
    setFormData((prev) => ({ ...prev, whatsapp: cleanValue }));

    if (cleanValue.length > 0 && cleanValue.length < 11) {
      setErrors((prev) => ({
        ...prev,
        whatsapp: "হোয়াটসঅ্যাপ নম্বরটি ১১ ডিজিটের হতে হবে!",
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.whatsapp;
        return newErrors;
      });
    }
  };

  // ৫. ডাইনামিক মোবাইল নম্বর ইনপুট ও লক মেকানিজম
  const handlePhoneChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 11);
    const updatedPhones = [...phones];
    updatedPhones[index] = cleanValue;
    setPhones(updatedPhones);

    const errorKey = `phone_${index}`;
    if (cleanValue.length === 11) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    } else if (cleanValue.length > 0 && cleanValue.length < 11) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে!",
      }));
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

  const handleTypeChange = (value: string) => {
    if (selectedTypes.includes(value)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== value));
    } else {
      setSelectedTypes([...selectedTypes, value]);
    }
  };

  // ৬. ফর্ম সাবমিট ভ্যালিডেশন
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.serviceName.trim())
      newErrors.serviceName = "সার্ভিসের নাম আবশ্যিক!";
    if (!formData.proprietorName.trim())
      newErrors.proprietorName = "প্রোপ্রাইটর নাম আবশ্যিক!";
    if (!formData.description.trim()) newErrors.description = "বিবরণ আবশ্যিক!";
    if (!formData.area.trim()) newErrors.area = "এلاকা উল্লেখ করুন!";
    if (!formData.upazila.trim()) newErrors.upazila = "উপজেলা উল্লেখ করুন!";
    if (!formData.serviceArea.trim())
      newErrors.serviceArea = "সার্ভিস কাভারেজ এরিয়া আবশ্যিক!";
    if (!formData.rentPerDay)
      newErrors.rentPerDay = "প্রতিদিনের ভাড়া উল্লেখ করুন!";
    if (!formData.rentPerTrip)
      newErrors.rentPerTrip = "প্রতি ট্রিপের ন্যূনতম ভাড়া উল্লেখ করুন!";
    if (formData.whatsapp && formData.whatsapp.length !== 11) {
      newErrors.whatsapp = "হোয়াটসঅ্যাপ নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে!";
    }

    phones.forEach((phone, index) => {
      if (!phone.trim()) {
        newErrors[`phone_${index}`] = "মোবাইল নম্বর দেওয়া আবশ্যিক!";
      } else if (phone.length !== 11) {
        newErrors[`phone_${index}`] =
          "মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে!";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (selectedTypes.length === 0) {
      return toast.error("অনুগ্রহ করে কমপক্ষে একটি গাড়ির ধরন সিলেক্ট করুন!");
    }

    const finalData = {
      ...formData,
      phone: phones,
      carTypes: selectedTypes,
      rentPerDay: Number(formData.rentPerDay),
      rentPerTrip: Number(formData.rentPerTrip),
    };

    let toastId = "";
    try {
      toastId = toast.loading("নতুন সার্ভিস ডাটাবেজে যুক্ত করা হচ্ছে...");
      await addCar(finalData).unwrap();

      toast.success("নতুন রেন্ট-এ-কার সার্ভিস সফলভাবে যুক্ত হয়েছে!", {
        id: toastId,
      });
      navigate("/dashboard/all-cars");
    } catch (error: any) {
      const errorMsg =
        error?.data?.issues?.[0]?.message ||
        error?.data?.message ||
        "সার্ভিসটি যোগ করতে ব্যর্থ হয়েছে!";
      toast.error(errorMsg, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* টপ হেডার */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <FiTruck size={22} className="animate-bounce" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                নতুন গাড়ি এন্ট্রি করুন
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                ডিরেক্টরিতে নতুন রেন্ট-এ-কার বা স্পেশাল অ্যাম্বুলেন্স সার্ভিস
                যোগ করুন।
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/all-cars"
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
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>{" "}
              বেসিক ইনফরমেশন
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <FiTruck size={13} className="text-gray-400" /> সার্ভিসের নাম{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  placeholder="উদাঃ বরিশাল রেন্ট-এ-কার সার্ভিস"
                  className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                />
                {errors.serviceName && (
                  <span className="text-xs font-bold text-rose-500">
                    {errors.serviceName}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <FiUser size={13} className="text-gray-400" /> প্রোপ্রাইটর নাম{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="proprietorName"
                  value={formData.proprietorName}
                  onChange={handleInputChange}
                  placeholder="উদাঃ মোঃ জিহাদ ইসলাম"
                  className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                />
                {errors.proprietorName && (
                  <span className="text-xs font-bold text-rose-500">
                    {errors.proprietorName}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5 mt-5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <FiFileText size={13} className="text-gray-400" /> সার্ভিসের
                বিবরণ <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="সার্ভিস সম্পর্কে বিস্তারিত বিবরণ লিখুন..."
                className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium"
              />
              {errors.description && (
                <span className="text-xs font-bold text-rose-500">
                  {errors.description}
                </span>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* সেকশন ২: লোকেশন ও কাভারেজ */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>{" "}
              লোকেশন ও কাভারেজ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <FiMapPin size={13} className="text-gray-400" />{" "}
                  এলাকা/স্ট্যান্ড <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="উদাঃ নথুল্লাবাদ"
                  className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                />
                {errors.area && (
                  <span className="text-xs font-bold text-rose-500">
                    {errors.area}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <FiMapPin size={13} className="text-gray-400" /> উপজেলা{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="upazila"
                  value={formData.upazila}
                  onChange={handleInputChange}
                  placeholder="উদাঃ বরিশাল সদর"
                  className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                />
                {errors.upazila && (
                  <span className="text-xs font-bold text-rose-500">
                    {errors.upazila}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <FiLayers size={13} className="text-gray-400" /> কাভারেজ
                  এরিয়া <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleInputChange}
                  placeholder="উদাঃ বরিশাল বিভাগ"
                  className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                />
                {errors.serviceArea && (
                  <span className="text-xs font-bold text-rose-500">
                    {errors.serviceArea}
                  </span>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* সেকশন ৩: যোগাযোগ মাধ্যম */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>{" "}
              যোগাযোগ মাধ্যম
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* মোবাইল নম্বরসমূহ */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <FiPhone size={13} className="text-gray-400" /> মোবাইল
                    নম্বরসমূহ <span className="text-rose-500">*</span>
                  </span>
                  <button
                    type="button"
                    onClick={addPhoneField}
                    className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                  >
                    + আরও নম্বর যোগ করুন
                  </button>
                </label>

                {phones.map((phone, index) => {
                  const phoneError = errors[`phone_${index}`];
                  return (
                    <div key={index} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 relative">
                        <div className="relative w-full flex items-center">
                          <input
                            type="text"
                            value={phone}
                            placeholder="উদাঃ 017XXXXXXXX"
                            onChange={(e) =>
                              handlePhoneChange(index, e.target.value)
                            }
                            className={`w-full bg-gray-50 text-gray-900 text-sm pl-4 pr-16 py-2.5 rounded-xl border focus:bg-white focus:ring-2 outline-none transition-all font-mono font-semibold ${
                              phoneError
                                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                                : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                            }`}
                          />
                          {/* 11/11 কাউন্টার ব্যাজ */}
                          <span
                            className={`absolute right-3 px-1.5 py-0.5 text-[10px] font-black rounded-md font-mono ${
                              phone.length === 11
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : "bg-rose-50 text-rose-500 border border-rose-100"
                            }`}
                          >
                            {phone.length}/11
                          </span>
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

              {/* হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক) */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <FiPhone size={13} className="text-emerald-500" />{" "}
                  হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)
                </label>
                <div className="flex flex-col gap-1">
                  <div className="relative w-full flex items-center">
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => handleWhatsappChange(e.target.value)}
                      placeholder="উদাঃ 017XXXXXXXX"
                      className={`w-full bg-gray-50 text-gray-900 text-sm pl-4 pr-16 py-2.5 rounded-xl border focus:bg-white focus:ring-2 outline-none transition-all font-mono font-semibold ${
                        errors.whatsapp
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                      }`}
                    />
                    {formData.whatsapp.length > 0 && (
                      <span
                        className={`absolute right-3 px-1.5 py-0.5 text-[10px] font-black rounded-md font-mono ${
                          formData.whatsapp.length === 11
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-rose-50 text-rose-500 border border-rose-100"
                        }`}
                      >
                        {formData.whatsapp.length}/11
                      </span>
                    )}
                  </div>
                  {errors.whatsapp && (
                    <span className="text-[11px] font-bold text-rose-500 px-1">
                      {errors.whatsapp}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* সেকশন ৪: গাড়ির ধরন */}
          <div>
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1 mb-3">
              <FiLayers size={13} className="text-gray-400" /> গাড়ির ধরন বা
              ক্যাটাগরি <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AVAILABLE_CAR_TYPES.map((type) => {
                const isChecked = selectedTypes.includes(type.value);
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                      isChecked
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 font-extrabold scale-[1.01]"
                        : "bg-gray-50 border-gray-200 text-gray-600 font-bold hover:bg-gray-100/70"
                    }`}
                  >
                    <span className="text-xs uppercase tracking-wide">
                      {type.label}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                        isChecked
                          ? "bg-white border-white text-indigo-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {isChecked && "✓"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* সেকশন ৫: ভাড়া কাঠামো */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>{" "}
              ভাড়া কাঠামো (টাকা)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <FiDollarSign size={13} className="text-emerald-500" />{" "}
                  প্রতিদিনের ভাড়া (৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="rentPerDay"
                  value={formData.rentPerDay}
                  onChange={handleInputChange}
                  placeholder="উদাঃ 3500"
                  className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-mono font-semibold"
                />
                {errors.rentPerDay && (
                  <span className="text-xs font-bold text-rose-500">
                    {errors.rentPerDay}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <FiDollarSign size={13} className="text-emerald-500" />{" "}
                  আনুমানিক প্রতি ট্রিপ ভাড়া (৳){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="rentPerTrip"
                  value={formData.rentPerTrip}
                  onChange={handleInputChange}
                  placeholder="উদাঃ 1500"
                  className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-mono font-semibold"
                />
                {errors.rentPerTrip && (
                  <span className="text-xs font-bold text-rose-500">
                    {errors.rentPerTrip}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* সাবমিট প্যানেল */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <Link
              to="/dashboard/cars"
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all no-underline cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer border border-white/10"
            >
              {isLoading ? "সংরক্ষণ করা হচ্ছে..." : "নতুন গাড়ি সেভ করুন"}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Add_Rent_A_Car;
