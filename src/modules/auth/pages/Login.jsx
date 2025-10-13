import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { validateField } from "@/utils/validation";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    setError("");
    try {
        const data = await login(values);
        const token = data.data.accessToken
        if (data.statusCode === 200 && data.success === true && token) {
          sessionStorage.setItem("authToken", token);
          toast.success("Logged in successfully!");
          navigate("/dashboard");
        } else {
          toast.error("Something went wrong! Please try again later.");
        }

    } catch (err) {
        setError(err);
        toast.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-100 px-8 md:px-16 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">
            Welcome 👋
          </h1>
          <p className="text-gray-600 mb-8 text-center text-lg">
            Please login to your account
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                rules={{ validate: validateField.email }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{ validate: validateField.password }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg cursor-pointer transition"
                disabled={loading}
              >
                {loading ? "Login in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="flex justify-center mt-6 text-base text-gray-700 font-medium gap-6 flex-wrap">
            <Link
              to="/forgot-password"
              className="hover:text-blue-600 cursor-pointer transition-colors duration-200"
            >
              Forgot password?
            </Link>
            <Link
              to="/become-tenant"
              className="hover:text-blue-600 cursor-pointer transition-colors duration-200"
            >
              Become a tenant
            </Link>
          </div>

          <Link
            onClick={() => navigate("/")}
            className="mt-8 block w-full text-center bg-blue-100 hover:bg-blue-300 text-blue-800 font-medium py-2 rounded-lg cursor-pointer transition"
          >
            Back to Home
          </Link>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-64 md:h-auto">
        <img
          src="/src/assets/loginimage.webp"
          alt="Login illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
