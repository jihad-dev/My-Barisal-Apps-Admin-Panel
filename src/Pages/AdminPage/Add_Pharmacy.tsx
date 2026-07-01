import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiTrash2,
  FiSave,
  FiArrowLeft,
  FiLoader,
  FiMapPin,
  FiPhone,
  FiUser,
  FiInfo,
  FiLink,
  FiTruck,
} from "react-icons/fi";
// আপনার প্রোজেক্টের সঠিক পাথ অনুযায়ী মিউটেশনটি ইমপোর্ট করুন
import { useAddPharmacyMutation } from "../../Redux/features/admin/adminApi";

interface IPharmacyInput {
  name: string;
  ownerName: string;
  description: string;
  area: string;
  address: string;
  phoneNumbers: { value: string }[];
  whatsapp: string;
  locationUrl: string;
  isHomeDelivery: boolean;
}

// কঠোরভাবে ১১ ডিজিটের এবং নির্দিষ্ট বাংলাদেশি অপারেটর কোড (০১৩-০১৯) চেক করার Regex
const EXACT_BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

// বাধ্যতামূলক https:// সহ গুগল ম্যাপস লিংকের Regex
const HTTPS_GOOGLE_MAPS_REGEX =
  /^https:\/\/(www\.)?(google\.[a-z.]+)\/maps\/|https:\/\/maps\.app\.goo\.gl\//;

const Add_Pharmacy = () => {
  const navigate = useNavigate();
  const [addPharmacy, { isLoading }] = useAddPharmacyMutation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IPharmacyInput>({
    defaultValues: {
      name: "",
      ownerName: "",
      description: "",
      area: "",
      address: "",
      phoneNumbers: [{ value: "" }],
      whatsapp: "",
      locationUrl: "",
      isHomeDelivery: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "phoneNumbers",
  });

  // সংখ্যা ছাড়া অন্য কিছু টাইপ লক করার হ্যান্ডলার
  const handleNumberOnlyKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];
    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const onSubmit = async (data: IPharmacyInput) => {
    setErrorMsg(null);

    const formattedPhone = data.phoneNumbers
      .map((p) => p.value.trim())
      .filter((p) => p !== "");

    const finalData = {
      name: data.name.trim(),
      ownerName: data.ownerName.trim(),
      description: data.description.trim(),
      area: data.area.trim(),
      address: data.address.trim(),
      phone: formattedPhone,
      whatsapp: data.whatsapp.trim() || undefined,
      locationUrl: data.locationUrl.trim(),
      status: "open",
      isHomeDelivery: data.isHomeDelivery,
      isDeleted: false,
    };

    try {
      await addPharmacy(finalData).unwrap();
      navigate("/dashboard/all-pharmacies");
    } catch (err: unknown) {

      const errorData = err as any;

      setErrorMsg(
        errorData?.data?.message ||
          "ফার্মেসি যুক্ত করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* টপ ব্যাক বার */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <FiArrowLeft size={18} /> পিছনে যান
          </button>
          <h1 className="text-base font-black text-gray-900">
            নতুন ফার্মেসি যুক্ত করুন
          </h1>
        </div>

        {/* মেইন ফর্ম */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 font-bold text-sm rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* ফার্মেসির নাম ও মালিকের নাম */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-2">
                  ফার্মেসির নাম *
                </label>
                <div className="relative">
                  <FiPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="উদা: লাইফ কেয়ার ফার্মেসি"
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.name ? "border-red-400 focus:ring-red-500/10" : "border-gray-200 focus:ring-emerald-500/20"} rounded-xl outline-none transition-all font-medium text-sm`}
                    {...register("name", { required: "ফার্মেসির নাম আবশ্যক" })}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 font-bold pl-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-2">
                  মালিকের নাম *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="উদা: মো: হাসিবুর রহমান"
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.ownerName ? "border-red-400 focus:ring-red-500/10" : "border-gray-200 focus:ring-emerald-500/20"} rounded-xl outline-none transition-all font-medium text-sm`}
                    {...register("ownerName", {
                      required: "মালিকের নাম আবশ্যক",
                    })}
                  />
                </div>
                {errors.ownerName && (
                  <p className="text-red-500 text-xs mt-1 font-bold pl-1">
                    {errors.ownerName.message}
                  </p>
                )}
              </div>
            </div>

            {/* এলাকা ও ঠিকানা */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-2">
                  এলাকা / থানা *
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="উদা: বরিশাল সদর"
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.area ? "border-red-400 focus:ring-red-500/10" : "border-gray-200 focus:ring-emerald-500/20"} rounded-xl outline-none transition-all font-medium text-sm`}
                    {...register("area", { required: "এলাকার নাম আবশ্যক" })}
                  />
                </div>
                {errors.area && (
                  <p className="text-red-500 text-xs mt-1 font-bold pl-1">
                    {errors.area.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-2">
                  পূর্ণাঙ্গ ঠিকানা *
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="উদা: সদর রোড, টাউন হল সংলগ্ন"
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.address ? "border-red-400 focus:ring-red-500/10" : "border-gray-200 focus:ring-emerald-500/20"} rounded-xl outline-none transition-all font-medium text-sm`}
                    {...register("address", {
                      required: "পূর্ণাঙ্গ ঠিকানা আবশ্যক",
                    })}
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1 font-bold pl-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            {/* বিবরণ */}
            <div>
              <label className="block text-xs font-black text-gray-700 mb-2">
                বিবরণ / ডেসক্রিপশন
              </label>
              <div className="relative">
                <FiInfo className="absolute left-4 top-4 text-gray-400" />
                <textarea
                  rows={3}
                  placeholder="উদা: অভিজ্ঞ ফার্মাসিস্ট দ্বারা পরিচালিত।"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium text-sm resize-none"
                  {...register("description")}
                />
              </div>
            </div>

            {/* ডাইনামিক ফোন নম্বর (সর্বোচ্চ ১১ ডিজিট লক করা হয়েছে) */}
            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-gray-700">
                  ফোন নম্বরসমূহ * (সর্বোচ্চ ১১টি সংখ্যা)
                </label>
                <button
                  type="button"
                  onClick={() => append({ value: "" })}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100 transition-all"
                >
                  <FiPlus size={14} /> নম্বর যোগ করুন
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={11} // ১১ ডিজিটের বেশি ইনপুট দেওয়া যাবে না
                          onKeyDown={handleNumberOnlyKeyPress}
                          placeholder={`উদা: 01711223344`}
                          className={`w-full pl-12 pr-4 py-2.5 bg-white border ${
                            errors.phoneNumbers?.[index]?.value
                              ? "border-red-400 focus:ring-red-500/10"
                              : "border-gray-200 focus:ring-emerald-500/20"
                          } rounded-xl outline-none transition-all font-mono font-bold text-sm`}
                          {...register(`phoneNumbers.${index}.value` as const, {
                            required: "নম্বর ফাঁকা রাখা যাবে না",
                            pattern: {
                              value: EXACT_BD_PHONE_REGEX,
                              message:
                                "ভুল নম্বর! অবশ্যই ১১ ডিজিটের সঠিক বিডি নম্বর (যেমন: 013, 017, 019) দিন",
                            },
                          })}
                        />
                      </div>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all flex-shrink-0"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                    {errors.phoneNumbers?.[index]?.value && (
                      <p className="text-red-500 text-xs font-bold pl-2">
                        {errors.phoneNumbers[index]?.value?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* হোয়াটসঅ্যাপ ও গুগল ম্যাপ ইউআরএল ভ্যালিডেশন (https:// ও ম্যাপস লিংক লক) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-2">
                  হোয়াটসঅ্যাপ নম্বর
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={11} // ১১ ডিজিটের বেশি ইনপুট দেওয়া যাবে না
                    onKeyDown={handleNumberOnlyKeyPress}
                    placeholder="উদা: 01311223344"
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${
                      errors.whatsapp
                        ? "border-red-400 focus:ring-red-500/10"
                        : "border-gray-200 focus:ring-emerald-500/20"
                    } rounded-xl outline-none transition-all font-mono font-bold text-sm`}
                    {...register("whatsapp", {
                      validate: (value) => {
                        if (!value) return true;
                        return (
                          EXACT_BD_PHONE_REGEX.test(value) ||
                          "ভুল হোয়াটসঅ্যাপ! ১১ ডিজিটের বিডি অপারেটর নম্বর দিন"
                        );
                      },
                    })}
                  />
                </div>
                {errors.whatsapp && (
                  <p className="text-red-500 text-xs mt-1 font-bold pl-1">
                    {errors.whatsapp.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-2">
                  গুগল ম্যাপ লোকেশন লিংক * (HTTPS সহ)
                </label>
                <div className="relative">
                  <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="https://maps.google.com/... অথবা https://maps.app.goo.gl/..."
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${
                      errors.locationUrl
                        ? "border-red-400 focus:ring-red-500/10"
                        : "border-gray-200 focus:ring-emerald-500/20"
                    } rounded-xl outline-none transition-all font-medium text-sm`}
                    {...register("locationUrl", {
                      required: "গুগল ম্যাপের লোকেশন লিংক দেওয়া আবশ্যিক",
                      validate: (value) => {
                        return (
                          HTTPS_GOOGLE_MAPS_REGEX.test(value.trim()) ||
                          "অবৈধ লিংক! শুরুতে অবশ্যই https:// সহ সঠিক গুগল ম্যাপস লিংক দিন"
                        );
                      },
                    })}
                  />
                </div>
                {errors.locationUrl && (
                  <p className="text-red-500 text-xs mt-1 font-bold pl-1">
                    {errors.locationUrl.message}
                  </p>
                )}
              </div>
            </div>

            {/* হোম ডেলিভারি টগল */}
            <div className="flex items-center justify-between p-4 bg-emerald-50/40 rounded-xl border border-emerald-100/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <FiTruck size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-800">
                    হোম ডেলিভারি সুবিধা
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    এই ফার্মেসি কি ওষুধ হোম ডেলিভারি দেয়?
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register("isHomeDelivery")}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <hr className="border-gray-100" />

            {/* অ্যাকশন বাটন */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-3 rounded-xl border border-gray-200 font-bold text-sm text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-700 disabled:opacity-50 transition-all min-w-[140px] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin" size={16} /> সংরক্ষণ
                    হচ্ছে...
                  </>
                ) : (
                  <>
                    <FiSave size={16} /> ফার্মেসি সংরক্ষণ করুন
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

export default Add_Pharmacy;
