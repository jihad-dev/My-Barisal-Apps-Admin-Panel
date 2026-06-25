import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Redux/hooks";
import { logout } from "../../Redux/features/auth/authSlice";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  Home,
  X,
  ChevronDown,
  Hospital,
  Truck,
  Scale,
  Star,
  Newspaper,
  School,
  Phone,
  LogOut,
  ShieldCheck,
  Flame,
  Car,
  Droplet,
  Moon,
  Stethoscope,
  Pill,
  Landmark,
} from "lucide-react";

// ── Types ──
interface TChild {
  to: string;
  label: string;
}
interface TNavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  children?: TChild[];
}

// ── Nav Items ──
const navigation: TNavItem[] = [
  {
    to: "/dashboard/admin-home",
    icon: <LayoutDashboard size={18} />,
    label: "ড্যাশবোর্ড",
  },
  {
    to: "/dashboard/hospitals",
    icon: <Hospital size={18} />,
    label: "হাসপাতাল",
    children: [
      { to: "/dashboard/all-hospitals", label: "সব হাসপাতাল" },
      { to: "/dashboard/hospitals/add", label: "নতুন যোগ করুন" },
    ],
  },
  {
    to: "/dashboard/doctors",
    icon: <Stethoscope size={18} className="text-emerald-500" />,
    label: "ডাক্তার",
    children: [
      { to: "/dashboard/all-doctors", label: "সব ডাক্তার" },
      { to: "/dashboard/add-doctor", label: "নতুন যোগ করুন" },
    ],
  },
  {
    to: "/dashboard/ambulances",
    icon: <Truck size={18} />,
    label: "অ্যাম্বুলেন্স",
    children: [
      { to: "/dashboard/all-ambulances", label: "সব অ্যাম্বুলেন্স" },
      { to: "/dashboard/add-ambulance", label: "নতুন যোগ করুন" },
    ],
  },
  {
    to: "/dashboard/lawyers",
    icon: <Scale size={18} />,
    label: "আইনজীবী",
    children: [
      { to: "/dashboard/all-lawyers", label: "সব আইনজীবী" },
      { to: "/dashboard/add-lawyer", label: "নতুন যোগ করুন" },
    ],
  },
  {
    to: "/dashboard/police",
    icon: <ShieldCheck size={18} className="text-blue-600" />,
    label: "পুলিশ প্রশাসন",
    children: [
      { to: "/dashboard/all-police", label: "সব থানা/স্টেশন" },
      { to: "/dashboard/add-station", label: "নতুন থানা যোগ করুন" },
    ],
  },
  {
    to: "/dashboard/fire-service",
    icon: <Flame size={18} className="text-orange-500" />,
    label: "অগ্নি পরিষেবা",
    children: [
      { to: "/dashboard/all-fire-station", label: "সব স্টেশন তালিকা" },
      { to: "/dashboard/add-fire-station", label: "নতুন স্টেশন যোগ করুন" },
    ],
  },
  {
    to: "/dashboard/imams",
    icon: <Moon size={18} className="text-teal-500" />,
    label: "ইমাম ও খতিব",
    children: [
      { to: "/dashboard/imams", label: "সব ইমাম তালিকা" },
      { to: "/dashboard/imams/add", label: "নতুন ইমাম যোগ করুন" },
    ],
  },
  {
    to: "/dashboard/cars",
    icon: <Car size={18} className="text-slate-500" />,
    label: "গাড়ি / রেন্ট-এ-কার",
    children: [
      { to: "/dashboard/all-cars", label: "সব গাড়ি" },
      { to: "/dashboard/cars/add", label: "নতুন গাড়ি যোগ করুন" },
    ],
  },
  {
    to: "/dashboard/blood-donors",
    icon: <Droplet size={18} className="text-rose-500" />,
    label: "রক্তের গ্রুপ/দাতা",
    children: [
      { to: "/dashboard/all-donors", label: "সব রক্তদাতা" },
      { to: "/dashboard/add-donor", label: "নতুন দাতা যোগ করুন" },
    ],
  },
  {
    to: "/dashboard/education",
    icon: <School size={18} />,
    label: "শিক্ষা প্রতিষ্ঠান",
    children: [
      { to: "/dashboard/education", label: "সব প্রতিষ্ঠান" },
      { to: "/dashboard/education/add", label: "নতুন যোগ করুন" },
    ],
  },
  {
    to: "/dashboard/banks",
    icon: <Landmark size={18} className="text-amber-600" />,
    label: "ব্যাংক",
    children: [
      { to: "/dashboard/all-banks", label: "সব ব্যাংক" },
      { to: "/dashboard/add-bank", label: "নতুন ব্যাংক যোগ করুন" },
    ],
  },
  {
    to: "/dashboard/pharmacies",
    icon: <Pill size={18} className="text-red-500" />,
    label: "ফার্মেসী",
    children: [
      { to: "/dashboard/all-pharmacies", label: "সব ফার্মেসী" },
      { to: "/dashboard/add-pharmacy", label: "নতুন ফার্মেসী যোগ করুন" },
    ],
  },
  {
    to: "/dashboard/users",
    icon: <Users size={18} />,
    label: "ব্যবহারকারী",
  },
  {
    to: "/dashboard/all-admin",
    icon: <ShieldCheck size={18} />,
    label: "All Admin",
  },
];

// ── Single Nav Item ──
const NavItem = ({
  item,
  onClose,
}: {
  item: TNavItem;
  onClose?: () => void;
}) => {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = item.children?.some((c) => location.pathname === c.to);
  const isActive = location.pathname === item.to || isChildActive;
  const [open, setOpen] = useState(isChildActive ?? false);

  return (
    <div>
      <Link
        to={hasChildren ? "#" : item.to}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setOpen(!open);
          } else onClose?.();
        }}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
          transition-all duration-150 group w-full no-underline
          ${
            isActive && !hasChildren
              ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }
        `}
      >
        <span
          className={`flex-shrink-0 ${isActive && !hasChildren ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
        >
          {item.icon}
        </span>

        <span className="flex-1">{item.label}</span>

        {item.badge && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {item.badge}
          </span>
        )}

        {hasChildren && (
          <span
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <ChevronDown size={14} />
          </span>
        )}
      </Link>

      {hasChildren && open && (
        <div className="ml-4 mt-1 pl-4 border-l-2 border-gray-100 space-y-0.5">
          {item.children!.map((child) => (
            <Link
              key={child.to}
              to={child.to}
              onClick={onClose}
              className={`
                block px-3 py-2 text-[12px] font-medium rounded-lg transition-colors no-underline
                ${
                  location.pathname === child.to
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }
              `}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    location.pathname === child.to
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
                {child.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Sidebar Content ──
const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // লগআউট হ্যান্ডলার ফাংশন
  const handleLogout = () => {
    dispatch(logout()); // ১. রিডাক্স স্টেট ক্লিয়ার করা
    toast.success("সফলভাবে লগআউট করা হয়েছে"); // ২. নোটিফিকেশন
    if (onClose) onClose(); // ৩. মোবাইল ড্রয়ার ওপেন থাকলে ক্লোজ করা
    navigate("/login"); // ৪. লগইন পেজে রিডাইরেক্ট
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100 flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-base shadow-sm">
          🏙️
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-bold text-gray-900 tracking-tight">
            My Barisal
          </span>
          <span className="text-[10px] font-semibold text-blue-500 tracking-wider uppercase">
            Admin Panel
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
          মূল মেনু
        </p>

        {navigation.slice(0, 1).map((item) => (
          <NavItem key={item.to} item={item} onClose={onClose} />
        ))}

        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mt-4 mb-2">
          সেবাসমূহ
        </p>

        {navigation.slice(1, 13).map((item) => (
          <NavItem key={item.to} item={item} onClose={onClose} />
        ))}

        {/* <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mt-4 mb-2">
          সিস্টেম
        </p> */}

        {navigation.slice(13).map((item) => (
          <NavItem key={item.to} item={item} onClose={onClose} />
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1 flex-shrink-0">
        {/* View Site */}
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline"
        >
          <Home size={18} className="text-gray-400" />
          <span>সাইট দেখুন</span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
        >
          <LogOut size={18} />
          <span>লগআউট</span>
        </button>
      </div>
    </div>
  );
};

// ── Main Sidebar ──
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* ── Desktop ── */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 border-r border-gray-100 shadow-sm bg-white">
        <SidebarContent />
      </aside>

      {/* ── Mobile Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out md:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
};

export default Sidebar;
