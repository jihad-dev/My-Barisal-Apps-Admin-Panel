import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiTrash2,
  FiArrowLeft,
 
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAddBankMutation } from "../../Redux/features/admin/adminApi";
import { toast } from "sonner";

interface BankFormData {
  name: string;
  branch: string;
  routingNumber: string;
  address: string;
}

const AddBank = () => {
  const [addBank, { isLoading }] = useAddBankMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BankFormData>({
    name: "",
    branch: "",
    routingNumber: "",
    address: "",
  });

  const [phones, setPhones] = useState<string[]>([""]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // 🔢 রাউটিং নম্বর শুধুমাত্র সংখ্যা এবং সর্বোচ্চ ৯ ডিজিট লক
    if (name === "routingNumber") {
      const cleanRouting = value.replace(/[^0-9]/g, "").slice(0, 9);
      setFormData((prev) => ({ ...prev, [name]: cleanRouting }));

      if (cleanRouting.length < 9) {
        setErrors((prev) => ({
          ...prev,
          routingNumber: "রাউটিং নম্বর অবশ্যই ৯ ডিজিটের হতে হবে",
        }));
      } else {
        setErrors((prev) => {
          const err = { ...prev };
          delete err.routingNumber;
          return err;
        });
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 🇧🇩 রিয়েল-টাইম বাংলাদেশি মোবাইল নম্বর ভ্যালিডেশন
  const handlePhoneChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, ""); // শুধু সংখ্যা
    const updatedPhones = [...phones];
    updatedPhones[index] = cleanValue;
    setPhones(updatedPhones);

    const errorKey = `phone_${index}`;

    if (cleanValue.length > 0 && !cleanValue.startsWith("01")) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "সঠিক বাংলাদেশি মোবাইল নম্বর দিন (০১ দিয়ে শুরু করুন)",
      }));
    } else if (cleanValue.length > 0 && cleanValue.length !== 11) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে",
      }));
    } else {
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

  // 🛠️ সাবমিট করার আগের ফাইনাল ভ্যালিডেশন (ব্যাকএন্ড Zod মেসেজের সাথে মিল রেখে)
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "ব্যাংকের নাম আবশ্যিক!";
    if (!formData.branch.trim()) newErrors.branch = "ব্রাঞ্চের নাম দিন!";

    // ৯ ডিজিট রাউটিং নম্বর বাধ্যতামুলক চেক
    if (formData.routingNumber.length !== 9) {
      newErrors.routingNumber = "রাউটিং নম্বর অবশ্যই ৯ ডিজিটের হতে হবে";
    }

    if (!formData.address.trim()) newErrors.address = "ঠিকানা দিন!";

    // বাংলাদেশি নম্বর ফরম্যাট চেক (১১ ডিজিট এবং ০১ দিয়ে শুরু)
    phones.forEach((phone, index) => {
      const cleanPhone = phone.trim();
      if (!cleanPhone) {
        newErrors[`phone_${index}`] = "কমপক্ষে একটি নম্বর দিন";
      } else if (cleanPhone.length !== 11 || !cleanPhone.startsWith("01")) {
        newErrors[`phone_${index}`] = "সঠিক বাংলাদেশি মোবাইল নম্বর দিন";
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
      branch: formData.branch,
      routingNumber: formData.routingNumber,
      address: formData.address,
      phone: phones,
    };

    let toastId = "";
    try {
      toastId = toast.loading("নতুন ব্যাংক যুক্ত করা হচ্ছে...");
      await addBank(finalData).unwrap();

      toast.success("নতুন ব্যাংক সফলভাবে যুক্ত হয়েছে!", { id: toastId });
      navigate("/dashboard/banks");
    } catch (error: any) {
      // ব্যাকএন্ডের Zod অ্যারে এরর হ্যান্ডলিং
      const backendMessage =
        error?.data?.issues?.[0]?.message ||
        error?.data?.message ||
        "ব্যাংকটি যোগ করতে ব্যর্থ হয়েছে!";
      toast.error(backendMessage, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* হেডার */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <FiBriefcase size={22} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                নতুন ব্যাংক যুক্ত করুন
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                ৯ ডিজিট রাউটিং ও ভ্যালিড বাংলাদেশি মোবাইল নম্বর সহ ডেটা এন্ট্রি
                দিন।
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/all-banks"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-100 transition-all no-underline"
          >
            <FiArrowLeft size={14} /> ফিরে যান
          </Link>
        </div>

        {/* ফর্ম */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                ব্যাংকের নাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="উদাঃ Dutch-Bangla Bank PLC"
                className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium"
              />
              {errors.name && (
                <span className="text-xs font-bold text-rose-500">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  শাখা বা ব্রাঞ্চ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  placeholder="উদাঃ Barisal Main Branch"
                  className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                />
                {errors.branch && (
                  <span className="text-xs font-bold text-rose-500">
                    {errors.branch}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  রাউটিং নম্বর (Routing Number){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="routingNumber"
                  value={formData.routingNumber}
                  onChange={handleInputChange}
                  placeholder="৯ ডিজিটের নম্বর (উদাঃ 015896358)"
                  className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-mono font-semibold"
                />
                {errors.routingNumber ? (
                  <span className="text-xs font-bold text-rose-500">
                    {errors.routingNumber}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400 block font-medium">
                    ডিজিট কাউন্ট: {formData.routingNumber.length}/9
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                সম্পূর্ণ ঠিকানা <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleInputChange}
                placeholder="উদাঃ Sadar Road, Barisal - 8200"
                className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium resize-none"
              />
              {errors.address && (
                <span className="text-xs font-bold text-rose-500">
                  {errors.address}
                </span>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 📞 কন্টাক্ট নম্বরসমূহ */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
              <span>
                মোবাইল নম্বরসমূহ (বাংলাদেশি ফরম্যাট){" "}
                <span className="text-rose-500">*</span>
              </span>
              <button
                type="button"
                onClick={addPhoneField}
                className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
              >
                + আরও নম্বর যোগ করুন
              </button>
            </label>

            <div className="grid grid-cols-1 gap-3">
              {phones.map((phone, index) => {
                const phoneError = errors[`phone_${index}`];
                const isValidBD = phone.length === 11 && phone.startsWith("01");

                return (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 relative">
                      <div className="relative w-full flex items-center">
                        <input
                          type="text"
                          value={phone}
                          maxLength={11}
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
                        {phone.length > 0 && (
                          <span
                            className={`absolute right-3 px-1.5 py-0.5 text-[9px] font-black rounded-md font-sans select-none ${
                              isValidBD
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-rose-50 text-rose-500 border border-rose-100"
                            }`}
                          >
                            {phone.length}/11
                          </span>
                        )}
                      </div>
                      {phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePhoneField(index)}
                          className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer flex-shrink-0"
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

          {/* বাটনসমূহ */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <Link
              to="/dashboard/all-banks"
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all no-underline"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer border border-white/10"
            >
              {isLoading ? "সংরক্ষণ করা হচ্ছে..." : "নতুন ব্যাংক সেভ করুন"}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AddBank;
