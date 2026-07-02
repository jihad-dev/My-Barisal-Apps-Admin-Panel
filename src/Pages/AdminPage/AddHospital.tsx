// import { useState, ChangeEvent, FormEvent } from "react";
// import { Plus, Trash2, Loader2, CheckCircle, AlertCircle } from "lucide-react";
// import { useAddHospitalMutation } from "../../Redux/features/admin/adminApi";

// export default function AddHospitalPage() {
//   // ১. RTK Query Mutation Hook ডিক্লেয়ারেশন
//   const [addHospital, { isLoading, error: apiError, isSuccess }] =
//     useAddHospitalMutation();

//   // ফর্মের লোকাল স্টেটসমূহ (TypeScript টাইপসহ)
//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     area: "",
//     type: "government",
//   });
//   const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);
//   const [validationError, setValidationError] = useState<string | null>(null);

//   // ইনপুট চেঞ্জ হ্যান্ডলার (HTMLInputElement, Select, TextArea সবকিছুর জন্য টাইপ সেফ)
//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
//   ): void => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ডাইনামিক ফোন নম্বর চেঞ্জ হ্যান্ডলার (টাইপ রেস্ট্রিকশনসহ)
//   const handlePhoneChange = (index: number, value: string): void => {
//     // শুধুমাত্র সংখ্যা (0-9) ফিল্টার করার রেগুলার এক্সপ্রেশন
//     const cleanValue = value.replace(/[^0-9]/g, "");

//     // ১১ ডিজিটের বেশি ইনপুট নিতে দেবে না
//     if (cleanValue.length <= 11) {
//       const updatedPhones = [...phoneNumbers];
//       updatedPhones[index] = cleanValue;
//       setPhoneNumbers(updatedPhones);
//     }
//   };

//   const addPhoneField = (): void => setPhoneNumbers([...phoneNumbers, ""]);

//   const removePhoneField = (index: number): void => {
//     if (phoneNumbers.length > 1) {
//       setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
//     }
//   };

//   // ব্যাকএন্ড বা লোকাল এরর মেসেজ এক্সট্র্যাক্ট করার জন্য টাইপ সেফ ফাংশন
//   const getErrorMessage = (): string => {
//     if (validationError) return validationError;

//     // apiError অবজেক্ট কিনা এবং তা null বা primitive নয় তা নিশ্চিত করার জন্য টাইপ গার্ড
//     if (apiError && typeof apiError === "object") {
//       // ১. সার্ভার এরর (FetchBaseQueryError) হ্যান্ডলিং - যেখানে 'status' ফিল্ড থাকে
//       if ("status" in apiError) {
//         const errorWithStatus = apiError as {
//           status: number;
//           data?: { message?: string };
//         };

//         if (errorWithStatus.status === 403) {
//           return "YOUR_CUSTOM_ERROR: আপনার এই হসপিটালটি যুক্ত করার অনুমতি নেই।";
//         }
//         if (errorWithStatus.status === 401) {
//           return "টোকেন পাওয়া যায়নি! দয়া করে আবার লগইন করুন।";
//         }

//         if (errorWithStatus.data?.message) {
//           return errorWithStatus.data.message;
//         }
//       }

//       // ২. সিরিয়ালাইজড বা সাধারণ জাভাস্ক্রিপ্ট এরর হ্যান্ডলিং - যেখানে 'message' ফিল্ড থাকে
//       if ("message" in apiError) {
//         const errorWithMessage = apiError as { message?: string };
//         return errorWithMessage.message || "ডাটা সংরক্ষণ করা সম্ভব হয়নি।";
//       }

//       return "ডাটা সংরক্ষণ করা সম্ভব হয়নি।";
//     }

//     return "";
//   };
//   const errorMessage = getErrorMessage();

//   // ফর্ম সাবমিট হ্যান্ডলার
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
//     setValidationError(null); // আগের লোকাল এরর ক্লিয়ার করা

//     // খালি ফোন নম্বর ফিল্টারিং
//     const filteredPhones = phoneNumbers.filter((phone) => phone.trim() !== "");

//     if (filteredPhones.length === 0) {
//       setValidationError("কমপক্ষে একটি বৈধ ফোন নম্বর দেওয়া বাধ্যতামূলক।");
//       return;
//     }

//     // প্রতিটা ফোন নম্বর ঠিক ১১ ডিজিট কিনা তা চেক করার ভ্যালিডেশন
//     const hasInvalidPhone = filteredPhones.some((phone) => phone.length !== 11);
//     if (hasInvalidPhone) {
//       setValidationError("প্রতিটি মোবাইল নম্বর অবশ্যই ঠিক ১১ ডিজিটের হতে হবে।");
//       return;
//     }

//     // ডাটাবেজ স্কিমা অনুযায়ী পে-লোড রেডি করা
//     const payload = {
//       ...formData,
//       phone: filteredPhones,
//       isDeleted: false,
//     };

//     try {
//       // ২. মিউটেশন ট্রিগার করা
//       await addHospital(payload).unwrap();

//       // সফল হলে ফর্ম ও ফোন ফিল্ড রিসেট করুন
//       setFormData({ name: "", address: "", area: "", type: "government" });
//       setPhoneNumbers([""]);
//     } catch (err) {
//       console.error("Hospital Creation Failed:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center items-center">
//       <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
//         {/* টপ বার */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
//           <h2 className="text-xl md:text-2xl font-bold">
//             নতুন হসপিটাল যুক্ত করুন
//           </h2>
//           <p className="text-blue-100 text-sm mt-1">অ্যাডমিন ড্যাশবোর্ড</p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* এরর মেসেজ ডিসপ্লে */}
//           {(validationError || apiError) && (
//             <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm animate-fadeIn">
//               <AlertCircle className="w-5 h-5 flex-shrink-0" />
//               <p>{errorMessage}</p>
//             </div>
//           )}

//           {/* সাকসেস মেসেজ ডিসপ্লে */}
//           {isSuccess && (
//             <div className="flex items-center gap-3 bg-green-50 border-l-4 border-green-500 p-4 rounded text-green-700 text-sm animate-fadeIn">
//               <CheckCircle className="w-5 h-5 flex-shrink-0" />
//               <p>
//                 হসপিটালটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে এবং লিস্ট আপডেট
//                 হয়েছে!
//               </p>
//             </div>
//           )}

//           {/* হসপিটালের নাম */}
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               হসপিটালের নাম <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="name"
//               required
//               value={formData.name}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2.5 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
//             />
//           </div>

//           {/* এরিয়া এবং টাইপ */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">
//                 এরিয়া/উপজেলা <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="area"
//                 required
//                 value={formData.area}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2.5 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">
//                 ধরণ (Type) <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="type"
//                 value={formData.type}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2.5 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition"
//               >
//                 <option value="government">Government (সরকারি)</option>
//                 <option value="private">Private (বেসরকারি)</option>
//                 <option value="clinic">Clinic (ক্লিনিক)</option>
//               </select>
//             </div>
//           </div>

//           {/* পূর্ণাঙ্গ ঠিকানা */}
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               পূর্ণাঙ্গ ঠিকানা <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               name="address"
//               required
//               rows={2}
//               value={formData.address}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2.5 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
//             ></textarea>
//           </div>

//           {/* ডাইনামিক ফোন নম্বর ইনপুট অ্যারে */}
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <label className="block text-sm font-semibold text-gray-700">
//                 ফোন নম্বর
//               </label>
//               <button
//                 type="button"
//                 onClick={addPhoneField}
//                 className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
//               >
//                 <Plus className="w-3.5 h-3.5" /> নম্বর যোগ করুন
//               </button>
//             </div>

//             <div className="space-y-2">
//               {phoneNumbers.map((phone, index) => (
//                 <div key={index} className="flex gap-2 items-center">
//                   <div className="relative w-full">
//                     <input
//                       type="text"
//                       inputMode="numeric"
//                       required={index === 0}
//                       value={phone}
//                       onChange={(e) => handlePhoneChange(index, e.target.value)}
//                       placeholder="উদা: 01712345678"
//                       className="w-full px-4 py-2.5 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
//                     />
//                     {phone.length > 0 && (
//                       <span
//                         className={`absolute right-3 top-3 text-xs font-semibold ${
//                           phone.length === 11
//                             ? "text-green-500"
//                             : "text-gray-400"
//                         }`}
//                       >
//                         {phone.length}/11
//                       </span>
//                     )}
//                   </div>
//                   {phoneNumbers.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removePhoneField(index)}
//                       className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100"
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* সাবমিট বাটন */}
//           <div className="pt-4 border-t border-gray-100 flex justify-end">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   ডাটাবেজে পাঠানো হচ্ছে...
//                 </>
//               ) : (
//                 "হসপিটাল ডাটা সংরক্ষণ করুন"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState, ChangeEvent, FormEvent } from "react";
import { Plus, Trash2, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAddHospitalMutation } from "../../Redux/features/admin/adminApi";

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

export default function AddHospitalPage() {
  // ১. RTK Query Mutation Hook ডিক্লেয়ারেশন
  const [addHospital, { isLoading, error: apiError, isSuccess }] =
    useAddHospitalMutation();

  // ফর্মের লোকাল স্টেটসমূহ (thana যুক্ত করা হয়েছে এবং টাইপ ডিফল্ট 'government')
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    thana: "barisal sadar", // ডিফল্ট প্রথম থানা সিলেক্টেড থাকবে
    area: "",
    type: "government",
  });
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ডাইনামিক ফোন নম্বর চেঞ্জ হ্যান্ডলার
  const handlePhoneChange = (index: number, value: string): void => {
    const cleanValue = value.replace(/[^0-9]/g, "");

    if (cleanValue.length <= 11) {
      const updatedPhones = [...phoneNumbers];
      updatedPhones[index] = cleanValue;
      setPhoneNumbers(updatedPhones);
    }
  };

  const addPhoneField = (): void => setPhoneNumbers([...phoneNumbers, ""]);

  const removePhoneField = (index: number): void => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
    }
  };

  // ব্যাকএন্ড বা লোকাল এরর মেসেজ এক্সট্র্যাক্ট করার ফাংশন
  const getErrorMessage = (): string => {
    if (validationError) return validationError;

    if (apiError && typeof apiError === "object") {
      if ("status" in apiError) {
        const errorWithStatus = apiError as {
          status: number;
          data?: { message?: string };
        };

        if (errorWithStatus.status === 403) {
          return "YOUR_CUSTOM_ERROR: আপনার এই হসপিটালটি যুক্ত করার অনুমতি নেই।";
        }
        if (errorWithStatus.status === 401) {
          return "টোকেন পাওয়া যায়নি! দয়া করে আবার লগইন করুন।";
        }

        if (errorWithStatus.data?.message) {
          return errorWithStatus.data.message;
        }
      }

      if ("message" in apiError) {
        const errorWithMessage = apiError as { message?: string };
        return errorWithMessage.message || "ডাটা সংরক্ষণ করা সম্ভব হয়নি।";
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

    const filteredPhones = phoneNumbers.filter((phone) => phone.trim() !== "");

    if (filteredPhones.length === 0) {
      setValidationError("কমপক্ষে একটি বৈধ ফোন নম্বর দেওয়া বাধ্যতামুলক।");
      return;
    }

    const hasInvalidPhone = filteredPhones.some((phone) => phone.length !== 11);
    if (hasInvalidPhone) {
      setValidationError("প্রতিটি মোবাইল নম্বর অবশ্যই ঠিক ১১ ডিজিটের হতে হবে।");
      return;
    }

    // ডাটাবেজ স্কিমা অনুযায়ী পে-লোড রেডি করা
    const payload = {
      ...formData,
      phone: filteredPhones,
      isDeleted: false,
    };

    try {
      // ২. মিউটেশন ট্রিগার করা
      await addHospital(payload).unwrap();

      // সফল হলে ফর্ম ও ফোন ফিল্ড রিসেট করুন
      setFormData({
        name: "",
        address: "",
        thana: "barisal sadar",
        area: "",
        type: "government",
      });
      setPhoneNumbers([""]);
    } catch (err) {
      console.error("Hospital Creation Failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* টপ বার */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h2 className="text-xl md:text-2xl font-bold">
            নতুন প্রতিষ্ঠান যুক্ত করুন
          </h2>
          <p className="text-blue-100 text-sm mt-1">অ্যাডমিন ড্যাশবোর্ড</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* এরর মেসেজ ডিসপ্লে */}
          {(validationError || apiError) && (
            <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* সাকসেস মেসেজ ডিসপ্লে */}
          {isSuccess && (
            <div className="flex items-center gap-3 bg-green-50 border-l-4 border-green-500 p-4 rounded text-green-700 text-sm animate-fadeIn">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p>
                প্রতিষ্ঠানটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে এবং লিস্ট আপডেট
                হয়েছে!
              </p>
            </div>
          )}

          {/* হসপিটালের নাম */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              প্রতিষ্ঠানের নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* থানা এবং এরিয়া/মহল্লা */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                থানা সিলেক্ট করুন <span className="text-red-500">*</span>
              </label>
              <select
                name="thana"
                value={formData.thana}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition"
              >
                {THANAS.map((thana) => (
                  <option key={thana.key} value={thana.key}>
                    {thana.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                এরিয়া/গ্রাম/রোড <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="area"
                required
                placeholder="উদা: চৌমাথা / রুপাতলী"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* প্রতিষ্ঠানের ধরণ */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              ধরণ (Type) <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition"
            >
              <option value="government">Government (সরকারি)</option>
              <option value="private">Private (বেসরকারি)</option>
              <option value="clinic">Clinic (ক্লিনিক)</option>
              <option value="diagnostic">Diagnostic (ডায়াগনস্টিক)</option>
            </select>
          </div>

          {/* পূর্ণাঙ্গ ঠিকানা */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              পূর্ণাঙ্গ ঠিকানা <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              required
              rows={2}
              placeholder="সঠিক লোকেশন ট্র্যাক করার জন্য বিস্তারিত লিখুন..."
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
            ></textarea>
          </div>

          {/* ডাইনামিক ফোন নম্বর ইনপুট অ্যারে */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-gray-700">
                ফোন নম্বর
              </label>
              <button
                type="button"
                onClick={addPhoneField}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
              >
                <Plus className="w-3.5 h-3.5" /> নম্বর যোগ করুন
              </button>
            </div>

            <div className="space-y-2">
              {phoneNumbers.map((phone, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="relative w-full">
                    <input
                      type="text"
                      inputMode="numeric"
                      required={index === 0}
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      placeholder="উদা: 01712345678"
                      className="w-full px-4 py-2.5 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                    {phone.length > 0 && (
                      <span
                        className={`absolute right-3 top-3 text-xs font-semibold ${
                          phone.length === 11
                            ? "text-green-500"
                            : "text-gray-400"
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
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  ডাটাবেজে পাঠানো হচ্ছে...
                </>
              ) : (
                "তথ্য সংরক্ষণ করুন"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
