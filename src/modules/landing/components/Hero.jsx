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
      {/* Background soft shapes */}
      <div className="absolute top-32 right-16 w-72 h-72 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-32 left-16 w-80 h-80 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: "3s" }}></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 mt-10 py-2 bg-indigo-50 rounded-full border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-medium text-indigo-700">
                Trusted by 50,000+ professionals
              </span>
            </div>

            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg shadow-md">
                <span className="text-xl font-black text-white tracking-tight">DNB</span>
              </div>
              <div className="h-px w-12 bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-500">Digital Solutions</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Digital Negotiation Book
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
              Streamline collaboration, optimize resources, and accelerate delivery with our intelligent platform designed for modern fish-selling businesses.
            </p>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">Real-time Sync</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-100">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">Secure & Safe</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button className="cursor-pointer group px-6 py-3 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-300">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button className="cursor-pointer group px-6 py-3 text-sm font-semibold bg-white hover:bg-gray-50 text-gray-700 rounded-lg shadow-md border border-gray-200 flex items-center justify-center transition-all duration-300">
                <Play className="mr-2 w-4 h-4" />
                Watch Demo
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Active Users
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                </div>
                <div className="text-xs text-gray-500 font-medium">Uptime</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">4.9</div>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  User Rating
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="lg:col-span-6 relative">
            <div className="relative max-w-xl mx-auto lg:mx-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/52/Liav%C3%A5g_plant.jpg"
                alt="Dashboard Illustration"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
