import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { handleApiError } from "../../Util/Validation/utility";

import { useRegisterInstructorMutation } from "../../app/api/instructor/instructorApi";
import {
  InstructorFormData,
  instructorSchema,
} from "../../app/features/instructor.schema";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [registerInstructor, { isLoading }] = useRegisterInstructorMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InstructorFormData>({
    resolver: zodResolver(instructorSchema),
  });

  const onSubmit = async (data: InstructorFormData) => {
    try {
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("bio", data.bio || "");
      formData.append("phone", data.phone);
      formData.append("address", data.address || "");
      formData.append("avatar_url", data.avatar_url[0]); // File upload

      const res = await registerInstructor(formData).unwrap();

      toast.success(res.message || "Instructor registered successfully!");
      reset();
      navigate("/");
    } catch (err) {
      handleApiError(err, "Failed to register instructor.");
    }
  };

  return (
    <div className="py-10 w-full flex flex-col gap-6">
     {/* <div className="py-10 flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar"> */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your information to create your instructor account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* First + Last Name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>
                  First Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  {...register("first_name")}
                  placeholder="Enter your first name"
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label>
                  Last Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  {...register("last_name")}
                  placeholder="Enter your last name"
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label>
                Email<span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label>
                Password<span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <Label>Bio</Label>
              <textarea
                {...register("bio")}
                placeholder="Tell us a bit about yourself..."
                className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label>
                Phone<span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                {...register("phone")}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <Label>Address</Label>
              <Input
                type="text"
                {...register("address")}
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* Avatar Upload */}
            <div>
              <Label>
                Profile Picture<span className="text-error-500">*</span>
              </Label>
              <Input type="file" accept="image/*" {...register("avatar_url")} />
              {errors.avatar_url && (
                <p className="text-sm text-red-500">
                  {String(errors.avatar_url?.message ?? "")}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-700 disabled:opacity-70"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-brand-500 hover:text-brand-700 "
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
