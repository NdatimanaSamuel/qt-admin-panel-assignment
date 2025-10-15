import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="text-center p-10 rounded-2xl bg-gray-800/60 backdrop-blur-lg shadow-2xl border border-gray-700 max-w-lg">
        <h1 className="text-4xl font-extrabold mb-4 text-blue-400">
          QT Admin Panel 
        </h1>

        <p className="text-gray-300 mb-8">
          Mini admin dashboard for managing users.
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 transition rounded-xl font-semibold"
          >
            Go to Dashboard
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          Developed by <span className="text-blue-300 font-medium">Ndatimana Samuel</span>
        </p>
      </div>
    </div>
  );
};

export default MainPage;
