
import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FiHome,
  FiPlus,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash2,
  FiLoader,
} from "react-icons/fi";
import { useAddInstituteMutation } from "../../Redux/features/admin/adminApi";
import { toast } from "sonner"; // Sonner টোস্ট ইমপোর্ট
import { useState } from "react";

// ডাটা সাবমিশন ইন্টারফেস (ব্যাকএন্ডের সব enum ভ্যালু সহ)
interface IAddInstitutionInput {
  name: string;
  type:
    | "primary_school"
    | "high_school"
    | "college"
    | "masjid"
    | "madrasa"
    | "mandir"
    | "university"
    | "";
  status: "active" | "inactive";
  area: string;
  upazila: string;
  address: string;
  phone: { value: string }[]; // Form state-এর জন্য অবজেক্ট অ্যারে
  established: string;
  totalStudents: string;
}

const Add_Institute = () => {
  const [createInstitute] = useAddInstituteMutation();
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IAddInstitutionInput>({
    defaultValues: {
      name: "",
      type: "",
      status: "active",
      area: "",
      upazila: "",
      address: "",
      phone: [{ value: "" }], // ডিফল্ট একটি ফোন ফিল্ড থাকবে
      established: "",
      totalStudents: "",
    },
  });

  // ফোন নম্বর ডাইনামিক অ্যারে হ্যান্ডল করার জন্য field array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "phone",
  });

  // ফর্ম সাবমিট হ্যান্ডলার
  const onSubmit = async (data: IAddInstitutionInput) => {
    const toastId = toast.loading("ডাটা সংরক্ষণ করা হচ্ছে...");

    try {
      setIsSubmittingLocal(true);

      // ডাটাবেজের অবজেক্ট ফরম্যাট অনুযায়ী ডাটা রি-ডিজাইন (Clean Payload)
      const finalPayload = {
        name: data.name,
        type: data.type,
        status: data.status,
        area: data.area,
        upazila: data.upazila,
        address: data.address,
        // অবজেক্ট অ্যারে থেকে পিওর স্ট্রিং অ্যারেই তে রূপান্তর: [{value: "017..."}] -> ["017..."]
        phone: data.phone.map((p) => p.value),
        established: Number(data.established), // স্ট্রিং থেকে নাম্বারে কনভার্ট
        totalStudents: Number(data.totalStudents), // স্ট্রিং থেকে নাম্বারে কনভার্ট
        isDeleted: false,
      };

      // API কল
      await createInstitute(finalPayload).unwrap();

      // Sonner সাকসেস টোস্ট
      toast.success("নতুন প্রতিষ্ঠানটি সফলভাবে ডাটাবেজে যুক্ত করা হয়েছে!", {
        id: toastId,
        duration: 4000,
      });

      reset(); // ফর্ম রিসেট
    } catch (err: any) {
      console.error("Failed to add institution:", err);

      // এরর টোস্ট
      toast.error(
        err?.data?.message ||
          err?.message ||
          "কিছু একটা সমস্যা হয়েছে! আবার চেষ্টা করুন।",
        {
          id: toastId,
          duration: 4000,
        },
      );
    } finally {
      setIsSubmittingLocal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 font-sans antialiased text-slate-800">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* টপ প্রিমিয়াম হেডার */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <FiHome className="text-emerald-500" /> নতুন প্রতিষ্ঠান যুক্ত করুন
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            ডাটাবেজে নতুন শিক্ষা প্রতিষ্ঠান বা ধর্মীয় উপাসনালয়ের সঠিক তথ্য
            ইনপুট দিন।
          </p>
        </div>

        {/* মেইন ফর্ম কার্ড */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* প্রতিষ্ঠানের নাম */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  প্রতিষ্ঠানের নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="উদা: ব্রজমোহন (বিএম) কলেজ বা ঢাকা বিশ্ববিদ্যালয়"
                    {...register("name", {
                      required: "প্রতিষ্ঠানের নাম দেওয়া বাধ্যতামূলক",
                    })}
                    className={`w-full px-4 py-3 bg-white border ${errors.name ? "border-red-400 focus:ring-red-500/5" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/5"} focus:ring-4 rounded-xl outline-none transition-all font-medium text-sm text-slate-900`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                    <FiAlertCircle /> {errors.name.message}
                  </p>
                )}
              </div>

              {/* ক্যাটাগরি / টাইপ (University সহ আপডেট করা হয়েছে) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  প্রতিষ্ঠানের ধরন (Type){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("type", {
                      required: "প্রতিষ্ঠানের ধরন সিলেক্ট করুন",
                    })}
                    className={`w-full px-4 py-3 bg-white border ${errors.type ? "border-red-400 focus:ring-red-500/5" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/5"} focus:ring-4 rounded-xl outline-none transition-all font-bold text-sm text-slate-700 appearance-none cursor-pointer`}
                  >
                    <option value="">বাছাই করুন</option>
                    <option value="primary_school">
                      প্রাথমিক বিদ্যালয় (Primary School)
                    </option>
                    <option value="high_school">
                      উচ্চ বিদ্যালয় (High School)
                    </option>
                    <option value="college">কলেজ (College)</option>
                    <option value="university">
                      বিশ্ববিদ্যালয় (University)
                    </option>
                    <option value="madrasa">মাদরাসা (Madrasa)</option>
                    <option value="masjid">মসজিদ (Masjid)</option>
                    <option value="mandir">मंदिर (Mandir)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                    ▼
                  </div>
                </div>
                {errors.type && (
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                    <FiAlertCircle /> {errors.type.message}
                  </p>
                )}
              </div>

              {/* স্ট্যাটাস */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  স্ট্যাটাস (Status)
                </label>
                <div className="relative">
                  <select
                    {...register("status")}
                    className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-xl outline-none transition-all font-bold text-sm text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="active">একটিভ (Active)</option>
                    <option value="inactive">ইনএকটিভ (Inactive)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* প্রতিষ্ঠা সাল */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  প্রতিষ্ঠা সাল (Established){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiCalendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="উদা: 1921"
                    {...register("established", {
                      required: "প্রতিষ্ঠা সাল দেওয়া আবশ্যক",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "শুধুমাত্র ইংরেজি সংখ্যা ব্যবহার করুন",
                      },
                      maxLength: {
                        value: 4,
                        message: "সাল সর্বোচ্চ ৪ ডিজিটের হতে পারবে",
                      },
                    })}
                    className={`w-full pl-11 pr-4 py-3 bg-white border ${errors.established ? "border-red-400 focus:ring-red-500/5" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/5"} focus:ring-4 rounded-xl outline-none transition-all font-mono font-medium text-sm text-slate-900`}
                  />
                </div>
                {errors.established && (
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                    <FiAlertCircle /> {errors.established.message}
                  </p>
                )}
              </div>

              {/* মোট শিক্ষার্থী */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  মোট শিক্ষার্থী (Total Students){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiUsers
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="উদা: 45000"
                    {...register("totalStudents", {
                      required: "মোট শিক্ষার্থীর সংখ্যা দেওয়া আবশ্যক",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "শুধুমাত্র ইংরেজি সংখ্যা ব্যবহার করুন",
                      },
                    })}
                    className={`w-full pl-11 pr-4 py-3 bg-white border ${errors.totalStudents ? "border-red-400 focus:ring-red-500/5" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/5"} focus:ring-4 rounded-xl outline-none transition-all font-mono font-medium text-sm text-slate-900`}
                  />
                </div>
                {errors.totalStudents && (
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                    <FiAlertCircle /> {errors.totalStudents.message}
                  </p>
                )}
              </div>

              {/* এলাকা / রিজিয়ন */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  এلاকা / বাজার (Area) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="উদা: শাহবাগ"
                    {...register("area", {
                      required: "এলাকা বা বাজারের নাম দিন",
                    })}
                    className={`w-full px-4 py-3 bg-white border ${errors.area ? "border-red-400 focus:ring-red-500/5" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/5"} focus:ring-4 rounded-xl outline-none transition-all font-medium text-sm text-slate-900`}
                  />
                </div>
                {errors.area && (
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                    <FiAlertCircle /> {errors.area.message}
                  </p>
                )}
              </div>

              {/* উপজেলা */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  উপজেলা (Upazila) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="উদা: রমনা"
                    {...register("upazila", { required: "উপজেলার নাম দিন" })}
                    className={`w-full px-4 py-3 bg-white border ${errors.upazila ? "border-red-400 focus:ring-red-500/5" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/5"} focus:ring-4 rounded-xl outline-none transition-all font-medium text-sm text-slate-900`}
                  />
                </div>
                {errors.upazila && (
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                    <FiAlertCircle /> {errors.upazila.message}
                  </p>
                )}
              </div>

              {/* পূর্ণ ঠিকানা */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  রোড ও পূর্ণ ঠিকানা (Address){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMapPin
                    className="absolute left-4 top-3 text-slate-400"
                    size={16}
                  />
                  <textarea
                    rows={2}
                    placeholder="উদা: ঢাকা বিশ্ববিদ্যালয় ক্যাম্পাস, নীলক্ষেত রোড, ঢাকা"
                    {...register("address", {
                      required: "প্রতিষ্ঠানের পূর্ণ ঠিকানা লিখুন",
                    })}
                    className={`w-full pl-11 pr-4 py-2.5 bg-white border ${errors.address ? "border-red-400 focus:ring-red-500/5" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/5"} focus:ring-4 rounded-xl outline-none transition-all font-medium text-sm text-slate-900 resize-none`}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
                    <FiAlertCircle /> {errors.address.message}
                  </p>
                )}
              </div>

              {/* ফোন নম্বর অ্যারে জোন */}
              <div className="space-y-3 md:col-span-2 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    যোগাযোগের ফোন নম্বর (Phone Numbers){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => append({ value: "" })}
                    className="flex items-center gap-1 text-xs font-black text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-2.5 py-1.5 rounded-lg cursor-pointer"
                  >
                    <FiPlus size={14} /> আরও নম্বর যোগ করুন
                  </button>
                </div>

                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <FiPhone
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={14}
                          />
                          <input
                            type="text"
                            placeholder={`ফোন নম্বর ${index + 1} (উদা: 01711111111)`}
                            {...register(`phone.${index}.value` as const, {
                              required:
                                "কমপক্ষে একটি মোবাইল নম্বর দেওয়া বাধ্যতামূলক",
                              pattern: {
                                value: /^[0-9]+$/,
                                message:
                                  "ফোন নম্বরে শুধুমাত্র ইংরেজি সংখ্যা ব্যবহার করুন",
                              },
                              minLength: {
                                value: 11,
                                message:
                                  "মোবাইল নম্বরটি সর্বনিম্ন ১১ ডিজিট হতে হবে",
                              },
                            })}
                            className={`w-full pl-11 pr-4 py-2.5 bg-white border ${errors.phone?.[index]?.value ? "border-red-400 focus:ring-red-500/5" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/5"} focus:ring-4 rounded-xl outline-none transition-all font-mono font-medium text-sm text-slate-900`}
                          />
                        </div>

                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>

                      {errors.phone?.[index]?.value && (
                        <p className="text-xs font-bold text-red-500 flex items-center gap-1 mt-0.5">
                          <FiAlertCircle />{" "}
                          {errors.phone[index]?.value?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* সাবমিট বাটন */}
            <div className="border-t border-slate-100 pt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingLocal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {isSubmittingLocal ? (
                  <>
                    <FiLoader className="animate-spin" size={16} /> প্রসেসিং
                    হচ্ছে...
                  </>
                ) : (
                  <>
                    <FiCheckCircle size={16} /> ডাটাবেজে সংরক্ষণ করুন
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

export default Add_Institute;
