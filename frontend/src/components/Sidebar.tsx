import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Users, Home, Menu } from "lucide-react";

const Sidebar = () => {
  const [openUsers, setOpenUsers] = useState(false); // closed by default
  const [collapsed, setCollapsed] = useState(false); // collapse for small screens
  const navigate = useNavigate();
  const location = useLocation();

  // exact match helper
  const isActive = (path: string) => location.pathname === path;

  // open submenu if user is on a child page
  useEffect(() => {
    if (location.pathname.startsWith("/view-users") || location.pathname.startsWith("/add-user")) {
      setOpenUsers(true);
    }
  }, [location.pathname]);

  const usersSectionActive =
    location.pathname.startsWith("/view-users") || location.pathname.startsWith("/add-user");

  return (
    <aside
      className={`flex flex-col bg-gray-900 text-white h-screen p-4 transition-all duration-200 shadow-lg
        ${collapsed ? "w-16" : "w-64"}`}
      aria-label="Sidebar"
    >
      {/* Top row: toggle + logo */}
      <div className="flex items-center justify-between mb-6">
        <button
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed((s) => !s)}
          className="p-1 rounded hover:bg-gray-800"
        >
          <Menu size={18} />
        </button>

        <Link
          to="/dashboard"
          onClick={() => collapsed && setCollapsed(false)}
          className={`flex items-center gap-2 font-bold text-blue-400 hover:text-blue-300 transition ${
            collapsed ? "justify-center w-full" : ""
          }`}
        >
          <span className={`${collapsed ? "text-lg" : "text-2xl"}`}>QT</span>
          {!collapsed && <span className="text-xl">QT Admin</span>}
        </Link>
      </div>

      {/* Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        className={`flex items-center gap-3 py-2 px-2 rounded-lg mb-2 transition w-full text-left
          ${isActive("/dashboard") ? "bg-blue-600 text-white" : "hover:bg-gray-800"}`}
      >
        <Home size={18} />
        {!collapsed && <span>Dashboard</span>}
      </button>

      {/* Manage Users */}
      <div className="mt-3">
        <button
          onClick={() => setOpenUsers((v) => !v)}
          className={`flex items-center justify-between w-full text-left py-2 px-2 rounded-lg transition
            ${usersSectionActive ? "bg-gray-800" : "hover:bg-gray-800"}`}
        >
          <div className="flex items-center gap-3">
            <Users size={18} />
            {!collapsed && <span>Manage Users</span>}
          </div>
          {!collapsed && (openUsers ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        </button>

        {openUsers && (
          <nav className={`ml-6 mt-2 flex flex-col gap-1 ${collapsed ? "hidden" : ""}`}>
            <button
              onClick={() => navigate("/add-user")}
              className={`flex items-center gap-2 py-2 px-2 rounded-md transition w-full text-left
                ${isActive("/add-user") ? "bg-blue-600 text-white" : "hover:text-blue-400"}`}
            >
              <span>➤</span>
              <span>Add New User</span>
            </button>

            <button
              onClick={() => navigate("/view-users")}
              className={`flex items-center gap-2 py-2 px-2 rounded-md transition w-full text-left
                ${isActive("/view-users") ? "bg-blue-600 text-white" : "hover:text-blue-400"}`}
            >
              <span>➤</span>
              <span>View All Users</span>
            </button>
          </nav>
        )}
      </div>

      <div className="flex-1" />

      <div className="mt-4 text-sm opacity-80">
        {!collapsed && <div>© {new Date().getFullYear()} QT</div>}
      </div>
    </aside>
  );
};

export default Sidebar;
