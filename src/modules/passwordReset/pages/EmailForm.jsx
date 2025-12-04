import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { validateField } from "@/utils/validation";
import { forgotPassword } from "../services.js";
import { showSuccess , dismissToast } from "@/utils/toastService.js";
export default function EmailForm({ setIsOtpSent, setEmail }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm({ defaultValues: { email: "" } });

  const onSubmit = async (values) => {
    setLoading(true);
    setError("");
    try {
      const data = await forgotPassword({ email: values.email });
       showSuccess("OTP sent to your email!");
      setIsOtpSent(true);
      setEmail(values.email);
    } catch (err) {
      setError(err);
      dismissToast(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4 text-gray-800 text-left">Forgot Password</h1>
      <p className="text-gray-700 mb-8 text-center text-lg">
        Enter your registered email to receive an OTP.
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
                {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
              </FormItem>
            )}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full button-styling"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
