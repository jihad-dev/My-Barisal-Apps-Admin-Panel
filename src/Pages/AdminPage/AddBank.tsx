import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBriefcase, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAddBankMutation } from "../../Redux/features/admin/adminApi";
import { toast } from "sonner";

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

interface BankFormData {
  name: string;
  thana: string;
  branch: string;
  routingNumber: string;
  address: string;
}

const AddBank = () => {
  const [addBank, { isLoading }] = useAddBankMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BankFormData>({
    name: "",
    thana: "",
    branch: "",
    routingNumber: "",
    address: "",
  });

  const [phones, setPhones] = useState<string[]>([""]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

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
    } else {
      // 🛠️ ফিক্স: এখানে এলস (else) ব্লকের ভেতর অবজেক্ট স্টেট আপডেট করা হয়েছে যেন থানা ইনপুট মিস না হয়
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handlePhoneChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    const updatedPhones = [...phones];
    updatedPhones[index] = cleanValue;
    setPhones(updatedPhones);

    const errorKey = `phone_${index}`;

    if (cleanValue.length > 0 && !cleanValue.startsWith("01")) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "সঠিক বাংলাদেশি মোবাইল নম্বর দিন (০১ দিয়ে শুরু করুন)",
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
      const newErrors: Record<string, string> = {};
      Object.keys(prev).forEach((key) => {
        if (!key.startsWith("phone_")) {
          newErrors[key] = prev[key];
        }
      });
      updatedPhones.forEach((_, idx) => {
        const oldErrorKey = `phone_${idx >= index ? idx + 1 : idx}`;
        if (prev[oldErrorKey]) {
          newErrors[`phone_${idx}`] = prev[oldErrorKey];
        }
      });
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "ব্যাংকের নাম আবশ্যিক!";
    if (!formData.thana) newErrors.thana = "একটি থানা নির্বাচন করুন!";
    if (!formData.branch.trim()) newErrors.branch = "ব্রাঞ্চের নাম দিন!";

    if (formData.routingNumber.length !== 9) {
      newErrors.routingNumber = "রাউটিং নম্বর অবশ্যই ৯ ডিজিটের হতে হবে";
    }

    if (!formData.address.trim()) newErrors.address = "ঠিকানা দিন!";

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

    // 🛠️ ডাটাবেজে সাবমিট করার মূল অবজেক্ট
    const finalData = {
      name: formData.name,
      thana: formData.thana, // 👈 নিশ্চিত করা হলো যে ডাটা রিকোয়েস্টে থানা যাচ্ছে
      branch: formData.branch,
      routingNumber: formData.routingNumber,
      address: formData.address,
      phone: phones,
    };

    let toastId;
    try {
      toastId = toast.loading("নতুন ব্যাংক যুক্ত করা হচ্ছে...");
      await addBank(finalData).unwrap();

      toast.success("নতুন ব্যাংক সফলভাবে যুক্ত হয়েছে!", { id: toastId });
      navigate("/dashboard/all-banks");
    } catch (error: any) {
      const backendMessage =
        error?.data?.issues?.[0]?.message ||
        error?.data?.message ||
        "ব্যাংকটি যোগ করতে ব্যর্থ হয়েছে!";
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5 sm:col-span-2">
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

              {/* থানা ড্রপডাউন */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  থানা নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="thana"
                    value={formData.thana}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 text-gray-900 text-sm pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-semibold cursor-pointer appearance-none"
                  >
                    <option value="">থানা সিলেক্ট করুন</option>
                    {THANAS.map((thana) => (
                      <option key={thana.value} value={thana.value}>
                        {thana.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 text-[10px]">
                    ▼
                  </span>
                </div>
                {errors.thana && (
                  <span className="text-xs font-bold text-rose-500">
                    {errors.thana}
                  </span>
                )}
              </div>
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
                  placeholder="৯ ডিজিটের নম্বর"
                  className="w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-mono font-semibold"
                />
                {errors.routingNumber && (
                  <span className="text-xs font-bold text-rose-500">
                    {errors.routingNumber}
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

          {/* মোবাইল নম্বর */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
              <span>
                মোবাইল নম্বরসমূহ <span className="text-rose-500">*</span>
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
                return (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 relative">
                      <input
                        type="text"
                        value={phone}
                        maxLength={11}
                        placeholder="উদাঃ 017XXXXXXXX"
                        onChange={(e) =>
                          handlePhoneChange(index, e.target.value)
                        }
                        className={`w-full bg-gray-50 text-gray-900 text-sm px-4 py-2.5 rounded-xl border focus:bg-white focus:ring-2 outline-none transition-all font-mono font-semibold ${
                          phoneError ? "border-rose-400" : "border-gray-200"
                        }`}
                      />
                      {phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePhoneField(index)}
                          className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
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
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
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
