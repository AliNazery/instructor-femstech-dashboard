import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { handleApiError } from "../../Util/Validation/utility";
import { Button } from "../ui/InstructorButton/Button";
import { useInstructorForgotPasswordMutation } from "../../app/api/instructor/instructorApi";

interface IForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPasswordForm>();

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [forgotPassword, { isLoading }] = useInstructorForgotPasswordMutation();

  const onSubmit = async (data: IForgotPasswordForm) => {
    try {
      setServerError("");
      setSuccessMessage("");

      const res = await forgotPassword(data).unwrap();

      const message =
        res.message || "Reset link sent successfully! Please check your email.";

      toast.success(message);
      setSuccessMessage(
        "✅ Password reset link has been sent to your email. Please check your inbox to continue."
      );
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
        const fallbackMessage =
          "Failed to send password reset link. Please try again.";
        setServerError(fallbackMessage);
        handleApiError(err, fallbackMessage);
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Forgot Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email to receive a password reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Email */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="admin@example.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* ✅ Success Message */}
              {successMessage && (
                <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-200 rounded-md">
                  {successMessage}
                </div>
              )}

              {/* Server Error */}
              {serverError && (
                <p className="text-sm text-red-500">{serverError}</p>
              )}

              {/* Submit Button */}
              <div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
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

