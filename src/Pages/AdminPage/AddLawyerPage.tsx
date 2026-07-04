

import { useState, ChangeEvent, FormEvent } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Briefcase,
  MapPin,
  Phone,
  Scale,
  Award,
  Calendar,
} from "lucide-react";
import { useCreateLawyerMutation } from "../../Redux/features/admin/adminApi";

// আপনার আপডেট করা নিখুঁত টাইপ ডেফিনিশন
export type TLawyerType =
  | "civil"
  | "criminal"
  | "family"
  | "corporate"
  | "general";
export type TCourtType =
  | "supreme"
  | "high"
  | "district"
  | "magistrate"
  | "labor"
  | "other";

export interface ILawyer {
  name: string;
  designation: string;
  lawyerType: TLawyerType;
  courtType: TCourtType;
  barCouncilId?: string;
  area: string;
  address: string;
  phone: string[];
  experience: number;
  isDeleted: boolean;
}

export default function AddLawyerPage() {
  // RTK Query Mutation Hook
  const [createLawyer, { isLoading, error: apiError, isSuccess }] =
    useCreateLawyerMutation();

  // মূল ফর্ম স্টেট (নতুন অপশন টাইপ কাস্টিং সহ)
  const [formData, setFormData] = useState({
    name: "",
    designation: "এডভোকেট",
    lawyerType: "civil" as TLawyerType, // নতুন ডিফল্ট ভ্যালু
    courtType: "district" as TCourtType,
    barCouncilId: "",
    experience: "",
    address: "",
    area: "",
  });

  // ফোন নম্বর ও ইন-লাইন লাল এরর স্টেট
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);
  const [phoneErrors, setPhoneErrors] = useState<Record<number, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ফোন নম্বর চেঞ্জ ও রিয়েল-টাইম এরর রিমুভাল
  const handlePhoneChange = (index: number, value: string): void => {
    const cleanValue = value.replace(/[^0-9]/g, ""); // শুধু ০-৯ এর সংখ্যা নিবে

    if (cleanValue.length <= 11) {
      const updatedPhones = [...phoneNumbers];
      updatedPhones[index] = cleanValue;
      setPhoneNumbers(updatedPhones);

      // ইউজার সঠিক ১১ ডিজিট টাইপ করলে বা একদম খালি করলে লাল এরর চলে যাবে
      if (cleanValue.length === 11 || cleanValue.length === 0) {
        setPhoneErrors((prev) => {
          const errors = { ...prev };
          delete errors[index];
          return errors;
        });
      }
    }
  };

  const addPhoneField = (): void => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const removePhoneField = (index: number): void => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
      setPhoneErrors((prev) => {
        const errors = { ...prev };
        delete errors[index];
        // ইনডেক্স ডিলিট হওয়ার পর এরর অবজেক্ট রি-অ্যালাইন করা
        const newErrors: Record<number, string> = {};
        Object.keys(errors).forEach((key) => {
          const k = Number(key);
          if (k > index) newErrors[k - 1] = errors[k];
          else if (k < index) newErrors[k] = errors[k];
        });
        return newErrors;
      });
    }
  };

  // এপিআই এরর মেসেজ হ্যান্ডলিং
  const getErrorMessage = (): string => {
    if (validationError) return validationError;

    if (apiError) {
      const errorObj = apiError as Record<string, unknown>;

      if ("status" in errorObj) {
        if (errorObj.status === 403)
          return "আপনার এই আইনজীবী প্রোফাইলটি যুক্ত করার অ্যাডমিন পারমিশন নেই।";
        if (errorObj.status === 401)
          return "টোকেন পাওয়া যায়নি! দয়া করে আবার লগইন করুন।";

        const data = errorObj.data as { message?: string } | undefined;
        if (data?.message) return data.message;
      } else if ("message" in errorObj) {
        return String(errorObj.message) || "ডাটা সংরক্ষণ করা সম্ভব হয়নি।";
      }
      return "ডাটা সংরক্ষণ করা সম্ভব হয়নি।";
    }

    return "";
  };
  const errorMessage = getErrorMessage();

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setValidationError(null);
    const errors: Record<number, string> = {};

    // নিখুঁত ফোন নম্বর ভ্যালিডেশন চেকিং
    phoneNumbers.forEach((phone, index) => {
      const trimmedPhone = phone.trim();
      if (trimmedPhone.length === 0) {
        errors[index] = "মোবাইল নম্বরটি খালি রাখা যাবে না।";
      } else if (trimmedPhone.length !== 11) {
        errors[index] = "মোবাইল নম্বরটি অবশ্যই ঠিক ১১ ডিজিটের হতে হবে।";
      }
    });

    // কোনো ইনপুটে সমস্যা থাকলে সাবমিট ব্লক করে এরর শো করবে
    if (Object.keys(errors).length > 0) {
      setPhoneErrors(errors);
      setValidationError("দয়া করে ফর্মের ভুল মোবাইল নম্বরগুলো ঠিক করুন।");
      return;
    }

    const payload: ILawyer = {
      name: formData.name,
      designation: formData.designation,
      lawyerType: formData.lawyerType,
      courtType: formData.courtType,
      barCouncilId: formData.barCouncilId || undefined,
      area: formData.area,
      address: formData.address,
      phone: phoneNumbers,
      experience: Number(formData.experience),
      isDeleted: false,
    };

    try {
      await createLawyer(payload).unwrap();

      // সফল হলে সমস্ত স্টেট রিস্টোর ও রিসেট করা
      setFormData({
        name: "",
        designation: "এডভোকেট",
        lawyerType: "civil",
        courtType: "district",
        barCouncilId: "",
        experience: "",
        address: "",
        area: "",
      });
      setPhoneNumbers([""]);
      setPhoneErrors({});
    } catch (err) {
      console.error("Lawyer Creation Failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 flex justify-center items-center font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-md">
        {/* ─── HEADER BAR ─── */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
            <Scale className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-teal-500/30">
              অ্যাডমিন প্যানেল
            </span>
            <h2 className="text-xl md:text-2xl font-black mt-3 tracking-tight">
              নতুন আইনজীবী যুক্ত করুন
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              সঠিক ডাটাবেজ স্ট্রাকচার অনুযায়ী আইনজীবীর প্রোফাইল তৈরি করুন।
            </p>
          </div>
        </div>

        {/* ─── FORM START ─── */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* গ্লোবাল এরর মেসেজ ডিসপ্লে */}
          {errorMessage && (
            <div className="flex items-center gap-3 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl text-rose-800 text-xs font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* সাকসেস মেসেজ ডিসপ্লে */}
          {isSuccess && (
            <div className="flex items-center gap-3 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl text-emerald-800 text-xs font-medium animate-fadeIn">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              <p>
                আইনজীবীর প্রোফাইলটি আপনার এক্সপেক্টেড ফরম্যাটে ডাটাবেজে সংরক্ষিত
                হয়েছে!
              </p>
            </div>
          )}

          {/* ১. আইনজীবীর নাম ও পদবী */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                আইনজীবীর নাম <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="উদা: এড. হাসান খোরশেদ"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                পদবী (Designation) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  disabled
                  name="designation"
                  required
                  placeholder="উদা: এডভোকেট"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* ২. বার কাউন্সিল আইডি এবং অভিজ্ঞতা */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                বার কাউন্সিল আইডি (barCouncilId){" "}
                <span className="text-slate-400">(ঐচ্ছিক)</span>
              </label>
              <div className="relative">
                <Award className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="barCouncilId"
                  placeholder="উদা: BD-2345"
                  value={formData.barCouncilId}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                অভিজ্ঞতা বছর (experience){" "}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  name="experience"
                  required
                  min="0"
                  placeholder="উদা: 15"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* ৩. আইনজীবী টাইপ এবং কোর্ট টাইপ (আপডেটেড ড্রপডাউন অপশনসমূহ) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                আইনজীবীর ধরণ (lawyerType)
              </label>
              <div className="relative">
                <Scale className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  name="lawyerType"
                  value={formData.lawyerType}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="civil">Civil (দেওয়ানি)</option>
                  <option value="criminal">Criminal (ফৌজদারি)</option>
                  <option value="family">Family (পারিবারিক)</option>
                  <option value="corporate">Corporate (করপোরেট)</option>
                  <option value="general">General (সাধারণ অনুশীলন)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                আদালতের ধরণ (courtType)
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  name="courtType"
                  value={formData.courtType}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="district">District Court (জেলা আদালত)</option>
                  <option value="magistrate">
                    Magistrate Court (ম্যাজিস্ট্রেট কোর্ট)
                  </option>
                  <option value="high">High Court (হাইকোর্ট)</option>
                  <option value="supreme">
                    Supreme Court (আপিল বিভাগ/সুপ্রিম কোর্ট)
                  </option>
                  <option value="labor">Labor Court (শ্রম আদালত)</option>
                  <option value="other">Other (অন্যান্য ট্রাইব্যুনাল)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ৪. এরিয়া এবং চেম্বার ঠিকানা */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                এরিয়া/উপজেলা (area) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="area"
                  required
                  placeholder="উদা: বরিশাল সদর"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                পূর্ণ ঠিকানা (address) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="উদা: আদালত পাড়া, বরিশাল"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* ৫. ডাইনামিক ফোন নম্বর ইনপুট অ্যারে (ইন-লাইন রেড এরর UI সহ) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                মোবাইল নম্বর সমূহ (phone){" "}
                <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={addPhoneField}
                className="flex items-center gap-1 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100/50"
              >
                <Plus className="w-3.5 h-3.5" /> নম্বর যোগ করুন
              </button>
            </div>

            <div className="space-y-3">
              {phoneNumbers.map((phone, index) => {
                const hasError = !!phoneErrors[index];
                return (
                  <div key={index} className="flex flex-col gap-1.5">
                    <div className="flex gap-2 items-center">
                      <div className="relative w-full">
                        <Phone
                          className={`absolute left-3.5 top-3.5 w-4 h-4 ${hasError ? "text-rose-400" : "text-slate-400"}`}
                        />
                        <input
                          type="text"
                          inputMode="numeric"
                          value={phone}
                          onChange={(e) =>
                            handlePhoneChange(index, e.target.value)
                          }
                          placeholder={`ফোন নম্বর ${index + 1} (উদা: 01820254226)`}
                          className={`w-full pl-10 pr-14 py-3 bg-slate-50/50 text-sm text-slate-800 rounded-xl border transition-all font-mono focus:outline-none focus:ring-2
                            ${
                              hasError
                                ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/10"
                                : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                            }`}
                        />
                        {phone.length > 0 && (
                          <span
                            className={`absolute right-3 top-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              phone.length === 11
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {phone.length}/11
                          </span>
                        )}
                      </div>
                      {phoneNumbers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePhoneField(index)}
                          className="p-3 text-rose-500 bg-rose-50/50 hover:bg-rose-50 rounded-xl transition-all border border-rose-100/50 hover:border-rose-200 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {/* ইন-লাইন লাল এরর মেসেজ */}
                    {hasError && (
                      <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1 pl-1 animate-fadeIn">
                        <AlertCircle className="w-3 h-3 text-rose-500" />{" "}
                        {phoneErrors[index]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ৬. সাবমিট বাটন */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white font-semibold rounded-xl hover:opacity-95 transition-all shadow-sm flex items-center justify-center gap-2 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transform active:scale-98"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  ডাটাবেজে পাঠানো হচ্ছে...
                </>
              ) : (
                "আইনজীবী প্রোফাইল সংরক্ষণ করুন"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
