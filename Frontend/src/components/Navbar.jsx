import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Globe, Search } from "lucide-react";
import { API_URL } from "../../api/AppPath";
import { getProfilePic } from "../utils/profileUtils"; // ✅ Import utility

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(null);

  // ✅ Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user in navbar", error);
      }
    };

    fetchUser();
  }, []);

  // ✅ Dropdown close handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAuthPage = ["/register", "/login"].includes(location.pathname);

  return (
    <>
      <div className="mx-10 my-5 flex gap-10 justify-between items-center">
        <div className="flex gap-10">
          <p className="text-[18px] font-bold text-white">HealthWise</p>
          {!isAuthPage && (
            <ul className="flex gap-6">
              {[
                { label: "Home", href: "/home" },
                { label: "Remedies", href: "/remedies" },
                // { label: "Chat with AI", href: "/chat-with-ai" },
                { label: "About", href: "/about" },
              ].map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isAuthPage && (
          <div className="flex gap-6 items-center relative">
            {/* Search */}
            <div className="flex items-center relative w-[150px] gap-6">
              <Search size={18} className="absolute ml-2 text-[#888]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-8 py-2 rounded-md border text-sm"
              />
            </div>

            <div className="grey w-10 h-10 rounded-full flex justify-center items-center cursor-pointer">
              <Globe size={20} />
            </div>

            {/* Profile Image & Dropdown */}
            <div ref={dropdownRef} className="relative">
              <img
                src={getProfilePic(user?.gender)}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer object-cover"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1f2937] text-white rounded-lg shadow-lg z-50">
                  <ul className="p-2 space-y-2 text-sm">
                    <li className="hover:bg-gray-700 px-4 py-2 rounded cursor-pointer">
                      <Link to="/profile">👤 Profile</Link>
                    </li>
                    <li className="hover:bg-gray-700 px-4 py-2 rounded cursor-pointer">⚙️ Settings</li>
                    <li className="hover:bg-gray-700 px-4 py-2 rounded cursor-pointer">    <Link to="/history">🕓View History</Link></li>
                    <li className="hover:bg-gray-700 px-4 py-2 rounded cursor-pointer">⬇️ Download Health Summary</li>
                    <li className="hover:bg-gray-700 px-4 py-2 rounded cursor-pointer">❓ Help & Support</li>
                    <li
                      className="hover:bg-gray-700 px-4 py-2 rounded cursor-pointer"
                      onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                      }}
                    >
                      🔓 Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <hr className="text-white" />
    </>
  );
};

export default Navbar;
