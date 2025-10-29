import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/app/store/slices/authSlice";

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

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    dispatch(loginUser(values));
  };
  // ✅ Redirect if logged in
  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.name || "User"}!`);
      sessionStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen bg-white">
      {/* Left side - form */}
      <div className="flex w-full md:w-1/2 justify-center items-center px-6 sm:px-10 lg:px-16 py-10 sm:py-16 bg-gray-100">
        <div className="w-full max-w-md sm:max-w-lg">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800 text-center">
            Welcome 👋
          </h1>
          <p className="text-gray-600 mb-8 text-center text-base sm:text-lg">
            Please login to your account
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6"
            >
              {/* Email */}
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
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                      />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Password */}
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
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
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

              {/* Error message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition text-sm sm:text-base cursor-pointer"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          {/* Links */}
          <div className="flex justify-center mt-6 text-sm sm:text-base text-gray-700 font-medium gap-4 sm:gap-6 flex-wrap">
            <Link
              to="/forgot-password"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Forgot password?
            </Link>
            <Link
              to="/become-tenant"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Become a tenant
            </Link>
          </div>

          {/* Back to Home */}
          <Link
            to={"/"}
            className="mt-8 block w-full text-center bg-blue-100 hover:bg-blue-300 text-blue-800 font-medium py-2 rounded-lg transition text-sm sm:text-base"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Right side - image */}
      <div className="w-full md:w-1/2 h-56 sm:h-72 md:h-auto">
        <img
          src="/src/assets/loginimage.webp"
          alt="Login illustration"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
}









// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import { Eye, EyeOff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { validateField } from "@/utils/validation";
// import { loginUser } from "@/app/store/slices/authSlice";

// export default function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { loading, error, user } = useSelector((state) => state.auth);

//   const [showPassword, setShowPassword] = useState(false);

//   const form = useForm({
//     defaultValues: { email: "", password: "" },
//   });

//   const onSubmit = async (values) => {
//     const resultAction = await dispatch(loginUser(values));

//     if (loginUser.fulfilled.match(resultAction)) {
//       toast.success("Logged in successfully!");
//       navigate("/");
//     } else {
//       toast.error(resultAction.payload || "Login failed.");
//     }
//   };

//   return (
//     <div className="flex flex-col-reverse md:flex-row min-h-screen bg-white">
//       {/* Left side - form */}
//       <div className="flex w-full md:w-1/2 justify-center items-center px-6 sm:px-10 lg:px-16 py-10 sm:py-16 bg-gray-100">
//         <div className="w-full max-w-md sm:max-w-lg">
//           <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800 text-center">
//             Welcome 👋
//           </h1>
//           <p className="text-gray-600 mb-8 text-center text-base sm:text-lg">
//             Please login to your account
//           </p>

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 rules={{ validate: validateField.email }}
//                 render={({ field, fieldState }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <input
//                         type="email"
//                         placeholder="you@example.com"
//                         {...field}
//                         className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//                       />
//                     </FormControl>
//                     {fieldState.error && (
//                       <FormMessage>{fieldState.error.message}</FormMessage>
//                     )}
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="password"
//                 rules={{ validate: validateField.password }}
//                 render={({ field, fieldState }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <input
//                           type={showPassword ? "text" : "password"}
//                           placeholder="••••••••"
//                           {...field}
//                           className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword((prev) => !prev)}
//                           className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
//                         >
//                           {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                         </button>
//                       </div>
//                     </FormControl>
//                     {fieldState.error && (
//                       <FormMessage>{fieldState.error.message}</FormMessage>
//                     )}
//                   </FormItem>
//                 )}
//               />

//               {error && <p className="text-red-500 text-sm">{error}</p>}

//               <Button
//                 type="submit"
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
//                 disabled={loading}
//               >
//                 {loading ? "Logging in..." : "Login"}
//               </Button>
//             </form>
//           </Form>

//           {/* Links */}
//           <div className="flex justify-center mt-6 text-sm sm:text-base text-gray-700 font-medium gap-4 sm:gap-6 flex-wrap">
//             <Link to="/forgot-password" className="hover:text-blue-600">
//               Forgot password?
//             </Link>
//             <Link to="/become-tenant" className="hover:text-blue-600">
//               Become a tenant
//             </Link>
//           </div>

//           <Link
//             onClick={() => navigate("/")}
//             className="mt-8 block w-full text-center bg-blue-100 hover:bg-blue-300 text-blue-800 font-medium py-2 rounded-lg"
//           >
//             Back to Home
//           </Link>
//         </div>
//       </div>

//       {/* Right side */}
//       <div className="w-full md:w-1/2 h-56 sm:h-72 md:h-auto">
//         <img
//           src="/src/assets/loginimage.webp"
//           alt="Login illustration"
//           className="w-full h-full object-cover object-center"
//         />
//       </div>
//     </div>
//   );
// }
