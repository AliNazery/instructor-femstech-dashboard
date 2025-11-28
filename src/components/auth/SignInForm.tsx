import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Cookies from "js-cookie";
import { useInstructorLoginMutation } from "../../app/api/instructor/instructorApi";
import { useNavigate } from "react-router";
import { handleApiError } from "../../Util/Validation/utility";
import { useDispatch } from "react-redux";
import { addInstructor } from "../../app/features/instructorSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link } from "react-router-dom";

interface IInstructorLoginFormInputs {
  email: string;
  password: string;
}

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});
export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useInstructorLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IInstructorLoginFormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: IInstructorLoginFormInputs) => {
    try {
      setServerError(""); // reset previous error
      const res = await login(data).unwrap();

      if (res?.data) {
        Cookies.set("instructor_token", res.data.access_token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      }

      dispatch(addInstructor(res.data?.user));
      navigate("/instructor/home");
    } catch (err: unknown) {
      const error = err as { status?: number; data?: { message?: string } };

      if (error?.status === 401) {
        setServerError("Incorrect email or password");
      } else {
        setServerError("Login failed. Please try again.");
        handleApiError(err, "Login failed");
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Instructor Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Email */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input placeholder="admin@example.com" {...register("email")} />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
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
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
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
                  size="sm"
                  type="submit"
                  disabled={isLoading}
                  variant="primary"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-brand-500 hover:text-brand-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-5">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-brand-500 hover:text-brand-700 dark:text-brand-400"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
