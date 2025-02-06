import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Sidebar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full md:w-60 md:h-screen bg-gray-800 text-white p-4">
      {/* Hamburger Button for Mobile */}
      <button onClick={toggleSidebar} className="text-white md:hidden">
        ☰ {/* Hamburger Icon */}
      </button>

      {/* Sidebar Content */}
      <div className={`md:block ${isOpen ? 'block' : 'hidden'}`}>
        <ul>
          <li className="mb-4">
            <Link to="/students" className="text-lg hover:text-blue-400">Students</Link>
          </li>
          <li>
            <button
              onClick={logout}
              className="text-lg text-red-500 hover:text-red-300"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
