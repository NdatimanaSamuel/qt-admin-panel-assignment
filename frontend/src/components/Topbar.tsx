import { useNavigate } from "react-router-dom";

const Topbar = () => {

    const navigate = useNavigate();
  return (
    <div className="bg-white shadow-md h-16 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>
      <button className="text-sm bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600" onClick={() => navigate("/")}>
        Logout
      </button>
    </div>
  );
};

export default Topbar;
