
import { Link } from "react-router-dom";
const Header = () => {
 
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 no-underline"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-base flex-shrink-0">
              🏙️
            </div>
            <span className="text-base font-bold text-gray-900 tracking-tight hidden sm:block">
              My Barisal
              <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full ml-2">
                Admin
              </span>
            </span>
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Header;

