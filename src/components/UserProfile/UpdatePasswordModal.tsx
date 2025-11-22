import { useState } from "react";
import { toast } from "react-toastify";


import { Eye, EyeOff } from "lucide-react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { Button } from "../ui/InstructorButton/Button";
import { Modal } from "../ui/modal";
import { handleApiError } from "../../Util/Validation/utility";
import { useUpdatePasswordMutation } from "../../app/api/instructor/instructorApi";

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdatePasswordModal({
  isOpen,
  onClose,
}: Readonly<UpdatePasswordModalProps>) {
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState({
    current_password: false,
    password: false,
    password_confirmation: false,
  });

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updatePassword(formData).unwrap();
      toast.success(res.message || "Password updated successfully!");
      onClose();
      setFormData({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (err) {
      handleApiError(err, "Failed to update password.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
      <div className="w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Change Password
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Secure your account by updating your password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Current Password */}
          <div className="relative">
            <Label>Current Password</Label>
            <Input
              type={showPassword.current_password ? "text" : "password"}
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current_password")}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword.current_password ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <Label>New Password</Label>
            <Input
              type={showPassword.password ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("password")}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword.password ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Label>Confirm New Password</Label>
            <Input
              type={showPassword.password_confirmation ? "text" : "password"}
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("password_confirmation")}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword.password_confirmation ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4 justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
