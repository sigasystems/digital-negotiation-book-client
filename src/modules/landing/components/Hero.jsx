import {
  CheckCircle2,
  Sparkles,
  Star,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Award,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [floatingCards, setFloatingCards] = useState([
    { id: 1, y: 0 },
    { id: 2, y: 0 },
  ]);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setFloatingCards(prev => prev.map(card => ({
        ...card,
        y: Math.sin(Date.now() / 1000 + card.id) * 10
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full min-h-screen flex items-center bg-gradient-to-br p-4 from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Animated background elements */}

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-0 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {/* Trust Badge */}
            <div 
              className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                transition: 'all 0.6s ease-out'
              }}
            >
              <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
                <Award className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Trusted by 50,000+ professionals worldwide
              </span>
            </div>

            {/* Main Headline */}
            <div 
              className="space-y-5"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                transition: 'all 0.8s ease-out 0.2s'
              }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
                <span className="block text-slate-900 mb-2">Digital</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 pb-3 to-purple-600 bg-clip-text text-transparent">
                  Negotiation Book
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl font-normal">
                Transform your fish-selling business with intelligent negotiation tools. Streamline deals, optimize pricing, and close sales faster with real-time collaboration.
              </p>
            </div>

            {/* Feature Highlights */}
            <div 
              className="cursor-pointer flex flex-wrap gap-3"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                transition: 'all 1s ease-out 0.4s'
              }}
            >
              <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-emerald-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700">Real-time Sync</span>
              </div>
              <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-blue-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700">Lightning Fast</span>
              </div>
              <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl border border-purple-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700">Bank-level Security</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div 
              className="flex flex-col sm:flex-row gap-4 pt-2"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                transition: 'all 1.2s ease-out 0.6s'
              }}
            >
              {/* <Button className="group px-8 py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button className="group px-8 py-6 text-base font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-xl shadow-md hover:shadow-lg border-2 border-slate-200 hover:border-slate-300 flex items-center justify-center transition-all duration-300">
                <Play className="mr-2 w-5 h-5 fill-slate-700" />
                Watch Demo
              </Button> */}
            </div>

            {/* Stats Row */}
            <div 
              className="grid grid-cols-3 gap-6 pt-8 border-t-2 border-slate-200"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                transition: 'all 1.4s ease-out 0.8s'
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">50K+</div>
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  Active Users
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">99.9%</div>
                </div>
                <div className="text-sm text-slate-600 font-medium">Uptime</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">4.9</div>
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  User Rating
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div 
            className="relative lg:block hidden"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
              transition: 'all 1s ease-out 0.4s'
            }}
          >
            <div className="relative" >
              {/* Floating card elements */}
              <div 
                className="absolute  z-1 -top-8 -left-8 w-22 h-22 bg-white rounded-2xl shadow-2xl flex items-center justify-center transform hover:rotate-6 transition-all duration-300"
                style={{
                  transform: `translateY(${floatingCards[0].y}px) rotate(6deg)`
                }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">98%</div>
                  <div className="text-xs font-semibold text-slate-600 mt-1">Success Rate</div>
                </div>
              </div>
              
              <div 
                className="absolute z-1 -bottom-8 -right-8 w-22 h-22 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-2xl flex items-center justify-center transform hover:-rotate-6 transition-all duration-300"
                style={{
                  transform: `translateY(${floatingCards[1].y}px) rotate(-6deg)`
                }}
              >
                <div className="text-center text-white">
                  <div className="text-3xl font-bold">2.5x</div>
                  <div className="text-xs font-semibold mt-1 opacity-90">Faster Deals</div>
                </div>
              </div>

              {/* Main image container */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white transform hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/52/Liav%C3%A5g_plant.jpg"
                  alt="Digital Negotiation Platform Dashboard"
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Deal Closed</div>
                        <div className="text-xs text-slate-600 font-medium">₹2,45,000 negotiated</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-lg font-bold text-slate-900">+15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

