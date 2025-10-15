import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { registerUser, resetRegister } from "../redux/features/users/usersSlice";
import { useAppSelector, useAppDispatch } from "../redux/app/hooks";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AddUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    role: "",
    status: "ACTIVE",
  });

  const { register } = useAppSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = register;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(registerUser(formData)).unwrap();
    } catch (err) {
      console.error("Create user failed:", err);
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(message || "Failed to create user");
      dispatch(resetRegister());
    }

    if (isSuccess) {
      toast.success("✅ User created successfully!");
      setFormData({ email: "", role: "", status: "ACTIVE" });
      setTimeout(() => {
        navigate("/view-users");
        dispatch(resetRegister());
      }, 1500);
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />

          <div className="flex justify-center items-center h-full p-4">
  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md w-full max-w-md">
    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create New User</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Role</label>
        <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="ADMIN / USER"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Status</label>
        <select name="status" value={formData.status} onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading}
        className={`w-full py-2 rounded-lg font-semibold text-white transition ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
        {isLoading ? "Creating..." : "Create User"}
      </button>
    </form>
  </div>
</div>

        </div>
      </div>
    </>
  );
};

export default AddUser;
