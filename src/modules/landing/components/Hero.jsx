import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  Star,
  Users,
  TrendingUp,
  Zap,
  Shield,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50/30"></div>

      {/* Soft floating orbs */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div
        className="absolute bottom-40 left-20 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"
        style={{ animationDelay: "3s" }}
      ></div>

      {/* Main container */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="lg:col-span-6 space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-medium text-indigo-700">
                Trusted by 50,000+ professionals
              </span>
            </div>

            {/* DNB Branding */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md">
                <span className="text-xl font-black text-white tracking-tight">
                  DNB
                </span>
              </div>
              <div className="h-px w-12 bg-gradient-to-r from-indigo-200 to-transparent"></div>
              <span className="text-sm font-medium text-gray-500">
                Digital Solutions
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
             Digital Negotiation Book
              <br />
              {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Manage & Scale Fish Product Sales
              </span> */}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
              Streamline collaboration, optimize resources, and accelerate
              delivery with our intelligent platform designed for modern
              fish-selling businesses.
            </p>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">
                  Real-time Sync
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">
                  Lightning Fast
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-100">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">
                  Secure & Safe
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button className="group px-6 py-3 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button className="group px-6 py-3 text-sm font-semibold bg-white hover:bg-gray-50 text-gray-700 rounded-lg shadow-md border border-gray-200 hover:border-indigo-300 transition-all duration-300">
                <Play className="mr-2 w-4 h-4" />
                Watch Demo
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                </div>
                <div className="text-xs text-gray-500 font-medium">Active Users</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                </div>
                <div className="text-xs text-gray-500 font-medium">Uptime</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">4.9</div>
                </div>
                <div className="text-xs text-gray-500 font-medium">User Rating</div>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative max-w-xl mx-auto lg:mx-0">
              {/* You can add dashboard cards/illustrations here */}
              <img
                src="/assets/dashboard-mockup.png"
                alt="Dashboard Illustration"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,rgb(0_0_0/0.05)_1px,transparent_0)] bg-[size:40px_40px]"></div>
    </section>
  );
}
