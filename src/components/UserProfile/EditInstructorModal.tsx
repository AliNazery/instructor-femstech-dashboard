import { useSelector } from "react-redux";
import { RootState } from "../../app/api/store";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { useState, useEffect } from "react";
import { useUpdateInstructorMutation } from "../../app/api/instructor/instructorApi";
import { toast } from "react-toastify";
import { handleApiError } from "../../Util/Validation/utility";

interface EditInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditInstructorModal({
  isOpen,
  onClose,
}: Readonly<EditInstructorModalProps>) {
  const { instructor } = useSelector((state: RootState) => state.instructor);
  const [updateInstructor, { isLoading }] = useUpdateInstructorMutation();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    phone: "",
    address: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");


  useEffect(() => {
    if (instructor) {
      setFormData({
        first_name: instructor.first_name || "",
        last_name: instructor.last_name || "",
        bio: instructor.bio || "",
        phone: instructor.phone || "",
        address: instructor.address || "",
      });
      setAvatarPreview(instructor.avatar_url || "");
    }
  }, [instructor]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("bio", formData.bio);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    if (avatarFile) data.append("avatar_url", avatarFile);

    try {
      const res = await updateInstructor(data).unwrap();
      toast.success(res.message || "Instructor updated successfully!");
      onClose();
    } catch (err: unknown) {
      handleApiError(err, "Failed to update instructor.");
    }
  };

 
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Personal Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col">
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Personal Information
              </h5>

              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4 mb-8 lg:flex-row lg:items-center">
                <div className="w-24 h-24 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
                  <img
                    src={avatarPreview || "/images/user/avatar.jpg"}
                    alt="Avatar Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <Label>Change Profile Picture</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* Input Fields */}
              {/* Input Fields */}
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                {/* First Name */}
                <div className="w-full">
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                {/* Last Name */}
                <div className="w-full">
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                {/* Phone */}
                <div className="sm:col-span-2 w-full">
                  <Label>Phone</Label>
                  <Input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2 w-full">
                  <Label>Address</Label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                {/* Bio */}
                <div className="sm:col-span-2 w-full">
                  <Label>Bio</Label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700
        bg-transparent px-3 py-2 text-sm text-gray-700 dark:text-gray-300
        focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 justify-end">
            <Button size="sm" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
