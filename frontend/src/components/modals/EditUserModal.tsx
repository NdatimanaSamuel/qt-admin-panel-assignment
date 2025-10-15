// src/components/modals/EditUserModal.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import type { UserResponse } from "../../redux/features/users/usersServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchSingleUser,
  updateUser,
  resetRegister,
  fetchUsers,
} from "../../redux/features/users/usersSlice";
import { useNavigate } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";

interface EditUserModalProps {
  userId: number | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const EditUserModal = ({ userId, isOpen, setIsOpen }: EditUserModalProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, fetch, register } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    role: "",
    status: "",
  });

  // Fetch selected user data when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      dispatch(fetchSingleUser(userId));
    }
  }, [isOpen, userId, dispatch]);

  // Pre-fill form when user data is fetched
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        role: user.role || "",
        status: user.status || "",
      });
    }
  }, [user]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit update request
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    dispatch(updateUser({ userId, updatedData: formData }))
      .unwrap()
      .then((res: { data: UserResponse; message: string }) => {
        toast.success(res.message || "User updated successfully");
        setIsOpen(false);
        dispatch(resetRegister());
        // Refresh the user list after successful update
        dispatch(fetchUsers());
        // Redirect to /view-users after short delay
        setTimeout(() => navigate("/view-users"), 1000);
      })
      .catch((err: string) => {
        toast.error(err || "Failed to update user");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit User (ID: {userId})</h2>

        {fetch.isLoading ? (
          <p>Loading user data...</p>
        ) : fetch.isError ? (
          <p className="text-red-500">{fetch.message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border px-3 py-2 rounded"
              value={formData.email}
              onChange={handleChange}
            />
            <select
              name="role"
              className="w-full border px-3 py-2 rounded"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
            <select
              name="status"
              className="w-full border px-3 py-2 rounded"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={register.isLoading}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {register.isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditUserModal;
