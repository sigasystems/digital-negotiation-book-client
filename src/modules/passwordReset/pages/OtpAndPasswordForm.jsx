import React, { useEffect, useState } from "react";
import { useForm, Controller  } from "react-hook-form";
import toast from "react-hot-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { validateField } from "@/utils/validation";
import { resetPasswordWithOtp } from "../services.js";
import { Eye, EyeOff } from "lucide-react";
import { dismissToast, showSuccess } from "@/components/common/toastService.js";

export default function OtpAndPasswordForm({ email, navigate }) {
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({ defaultValues: { otp: "", password: "", confirmPassword: "" } });

  const otp = form.watch("otp");

  useEffect(() => {
    setShowPasswordFields(otp.length === 6);
  }, [otp]);

  const onSubmit = async (values) => {
    setLoading(true);
    setError("");
    try {
      if (!showPasswordFields) {
        dismissToast("Please enter a valid 6-digit OTP first.");
        return;
      }

      if (values.password !== values.confirmPassword) {
        dismissToast("Passwords do not match!");
        return;
      }

      const passwordError = validateField.password(values.password);
      if (!passwordError) {
        dismissToast(passwordError);
        return;
      }

      await resetPasswordWithOtp({
        email,
        otp: values.otp,
        password: values.password,
      });

       showSuccess("Password reset successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(err);
      dismissToast(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">Reset Password 🔐</h1>
      <p className="text-gray-600 mb-8 text-center text-lg">
        {showPasswordFields ? "Enter your new password below." : "Enter the 6-digit OTP sent to your email."}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* OTP */}
          <Controller
              name="otp"
            control={form.control}
            rules={{
              required: "OTP is required",
              pattern: { value: /^[0-9]{6}$/, message: "OTP must be a 6-digit number", },
            }}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); 
                        field.onChange(value);
                      }}
                      className="w-full text-center tracking-[0.5em] text-2xl font-mono px-4 py-2 border-2 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white hover:border-blue-400 placeholder-gray-300"
                    />
                </FormControl>
                {fieldState.error && (<FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          {/* Password Fields */}
          {showPasswordFields && (
            <>
              {/* New Password */}
              <FormField
                control={form.control}
                name="password"
                rules={{ validate: validateField.password }}
                render={({ field, fieldState }) => (
                  <FormItem className="relative">
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                     <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            {...field}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
                        />
                        <span
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
>
  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
</span>
                     </div>
                    </FormControl>
                    {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === form.watch("password") || "Passwords do not match",
                }}
                render={({ field, fieldState }) => (
                  <FormItem className="relative">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          {...field}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10"
                        />
                        <span
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                      </div>
                    </FormControl>
                    {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg cursor-pointer transition"
            disabled={loading}
          >
            {loading ? "Processing..." : showPasswordFields ? "Reset Password" : "Verify OTP"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
