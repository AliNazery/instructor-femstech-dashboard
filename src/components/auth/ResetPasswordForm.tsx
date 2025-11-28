
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { handleApiError } from "../../Util/Validation/utility";
import { useInstructorResetPasswordMutation } from "../../app/api/instructor/instructorApi";
import { Button } from "../ui/InstructorButton/Button";

interface IResetPasswordForm {
  password: string;
  password_confirmation: string;
}

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<IResetPasswordForm>();
  const [resetPassword, { isLoading }] = useInstructorResetPasswordMutation();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data: IResetPasswordForm) => {
  if (!token) {
    toast.error("Invalid or missing token.");
    return;
  }

  try {
    setServerError("");
    const payload = { token, ...data };
    const res = await resetPassword(payload).unwrap();
    toast.success(res.message || "Password reset successful!");
    navigate("/");
  } catch (err: unknown) {
    // Narrow the type safely
    const error = err as {
      status?: number;
      data?: { message?: string; errors?: Record<string, string[]> };
    };

    if (error?.status === 422 && error?.data?.errors) {
  
      const firstError = Object.values(error.data.errors)[0][0];
      setServerError(firstError);
      toast.error(firstError);
    } else if (error?.data?.message) {
      setServerError(error.data.message);
      toast.error(error.data.message);
    } else {
      setServerError("Password reset failed. Please try again.");
      handleApiError(err, "Password reset failed");
    }
  }
};


  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* New Password */}
              <div>
                <Label>
                  New Password <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Label>
                  Confirm Password <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  {...register("password_confirmation", {
                    required: "Please confirm password",
                  })}
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              {/* Server Error */}
              {serverError && (
                <p className="text-sm text-red-500">{serverError}</p>
              )}

              {/* Submit Button */}
              <div>
                <Button
                  className="w-full"
                  type="submit"
                  disabled={isLoading}
                 
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  className="text-sm text-brand-500 hover:text-brand-700"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
