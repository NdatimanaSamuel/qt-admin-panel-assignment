import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import type { UserResponse } from "../redux/features/users/usersServices";
import {
  fetchUsers,
  resetFetch,
  deleteUser,
} from "../redux/features/users/usersSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import EditUserModal from "../components/modals/EditUserModal";

interface User {
  id: number | string;
  email: string;
  role: number;
  status: number;
  createdAt: string;
}

const ViewUsers = () => {
  const dispatch = useAppDispatch();
  const { users, fetch } = useAppSelector((state) => state.auth);

  const { isLoading, isError, message } = fetch;

  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // ✅ Fetch users when the component loads
  useEffect(() => {
    dispatch(fetchUsers());
    return () => {
      dispatch(resetFetch());
    };
  }, [dispatch]);

  // ✅ Show toast if there's an error
  useEffect(() => {
    if (isError) {
      toast.error(message || "Failed to fetch users");
    }
  }, [isError, message]);

  // ✅ Handle edit modal open
 const handleEditClick = (id: string) => {
     setSelectedUserId(Number(id));
    setIsModalOpen(true);
  };

  // ✅ Handle delete user
// ✅ Handle delete
const handleDelete = (id: string | number) => {
  const numericId = Number(id);
  if (window.confirm("Are you sure you want to delete this user?")) {
    dispatch(deleteUser(numericId))
      .unwrap()
      .then((res: { message: string }) => {
        toast.success(res.message || "User deleted successfully");
        dispatch(fetchUsers());
      })
      .catch((err: string) => {
        toast.error(err || "Failed to delete user");
      });
  }
};

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            User Management
          </h2>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="flex justify-end mb-4">
              <Link
                to="/add-user"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                + Create New User
              </Link>
            </div>

            {isLoading ? (
              <p className="text-center text-gray-600 py-8">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No users found. Create one to get started!
              </p>
            ) : (
              <table className="min-w-full table-auto border-collapse text-left">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="py-3 px-2">ID</th>
                    <th className="py-3 px-2">Email</th>
                    <th className="py-3 px-2">Role</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 hidden md:table-cell">Created At</th>
                    <th className="py-3 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
       {users.map((user: UserResponse, index: number) => (
  <tr key={user.id} className="border-b hover:bg-gray-50 transition">
    <td className="py-2 px-2">{index + 1}</td>
    <td className="py-2 px-2 break-words">{user.email}</td>
    <td className="py-2 px-2">{Number(user.role) === 0 ? "ADMIN" : "USER"}</td>
    <td className={`py-2 px-2 font-semibold ${Number(user.status) === 0 ? "text-green-600" : "text-red-600"}`}>
      {Number(user.status) === 0 ? "ACTIVE" : "INACTIVE"}
    </td>
    <td className="py-2 px-2 hidden md:table-cell">{new Date(user.createdAt).toLocaleDateString()}</td>
    <td className="py-2 px-2 text-center flex gap-2 justify-center">
      <button onClick={() => handleEditClick(user.id)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded">
        Edit
      </button>
      <button onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">
          Delete
        </button>
    </td>
  </tr>
))}


                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2500} />

      <EditUserModal
        userId={selectedUserId}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </div>
  );
};

export default ViewUsers;
