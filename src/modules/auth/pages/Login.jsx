import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import LoginBG from "@/assets/loginimage.webp";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { validateField } from "@/utils/validation";
import {login} from "../authServices"
import { InputField } from "@/components/common/InputField";
import { PasswordField } from "../components/PasswordField";
import useAuth from "@/app/hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login: setSession } = useAuth();

  const form = useForm({
    defaultValues: { businessName: "", email: "", password: "" },
  });

 const onSubmit = async (values) => {
  setLoading(true);
  try {
     const { data } = await login(values);

    if (!data?.accessToken || !data?.refreshToken) {
      throw new Error("Missing tokens from server");
    }

    setSession(
      {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.tokenPayload,
      },
      { remember: true }
    );

    toast.success(`Welcome back, ${data.tokenPayload?.name ?? "User"}!`);
    const activeNegId = data.tokenPayload?.activeNegotiationId;
    if (activeNegId) {
      navigate(`/negotiation/${activeNegId}`);
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
      toast.error(
      err.response?.data?.message || err.message || "Login failed"
    );
  } finally {
    setLoading(false);
    }
};



  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen bg-white">
      <div className="flex w-full md:w-1/2 justify-center items-center px-6 sm:px-10 lg:px-80 py-10 bg-gray-100">
        <div className="w-full max-w-md sm:max-w-lg">
          <h1 className="tex-2xl font-bold mb-4 text-gray-800 text-center p-4">
            Login to your account!
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Business Name */}
              <Controller
                name="businessName"
                control={form.control}
                    render={({ field, fieldState }) => (
                  <InputField
                    label="Business Name"
                        placeholder="e.g. Ocean Fresh Seafood"
                    field={field}
                    error={fieldState.error}
                      />
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                rules={{ validate: validateField.email }}
                render={({ field, fieldState }) => (
                  <InputField
                    label="Email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        field={field}
                        error={fieldState.error}
                      />
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                rules={{ validate: validateField.password }}
                render={({ field, fieldState }) => (
                  <PasswordField
                    label="Password"
                    required
                    field={field}
                    error={fieldState.error}
                  />
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition cursor-pointer"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="flex justify-center items-center gap-4 mt-6 text-sm font-medium">
            <Link
              to="/forgot-password"
              className="text-blue-600 underline hover:text-blue-800 transition"
            >
              Forgot password?
            </Link>

          <Link
            to="/"
            className="text-blue-600 underline hover:text-blue-800 transition"
          >
            Back to home
          </Link>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-56 sm:h-72 md:h-auto">
        <img
          src={LoginBG}
          alt="Login illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
