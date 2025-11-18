import React, { useState } from 'react';
import { Check, ArrowRight, CreditCard, Mail, Building2, Sparkles, TrendingUp, Shield, Clock, Award, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProcessInstructions = () => {
  const [expandedStep, setExpandedStep] = useState(null);
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      number: "01",
      title: "Choose your plan",
      subtitle: "Select the perfect tier for your business",
      description: "Browse our transparent pricing and pick a plan that scales with your needs. Switch between plans anytime without penalties.",
      features: ["Compare all features", "Flexible billing"],
      color: "bg-blue-500"
    },
    {
      id: 2,
      number: "02",
      title: "Business verification",
      subtitle: "Quick and secure identity confirmation",
      description: "Provide your business details to create a verified account. We use industry-standard verification to ensure security and compliance.",
      features: ["Company registration", "Tax identification", "Owner verification", "Business address"],
      color: "bg-violet-500"
    },
    {
      id: 3,
      number: "03",
      title: "Secure checkout",
      subtitle: "Complete payment via Stripe",
      description: "Process your subscription through Stripe's secure payment platform. Your payment information is encrypted and never stored on our servers.",
      features: ["256-bit encryption", "PCI compliant", "Multiple payment methods", "Instant confirmation"],
      color: "bg-emerald-500"
    },
    {
      id: 4,
      number: "04",
      title: "Email confirmation",
      subtitle: "Receive your credentials instantly",
      description: "Get a welcome email with your login details, setup guide, and access to our knowledge base. Our support team is ready to assist you.",
      features: ["Instant delivery",  "Access credentials", "Support resources"],
      color: "bg-amber-500"
    },
    {
      id: 5,
      number: "05",
      title: "Start building",
      subtitle: "Access your personalized dashboard",
      description: "Log in to your new dashboard and start managing your business. Access real-time analytics, team tools, and integrations immediately.",
      features: ["Real-time analytics", "Team management", "API access", "Custom workflows"],
      color: "bg-rose-500"
    }
  ];

  const stats = [
    { value: "10 min", label: "Average setup time" },
    { value: "50K+", label: "Active businesses" },
    { value: "99.9%", label: "Uptime guarantee" },
    { value: "24/7", label: "Support available" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Navigation hint */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Getting Started Guide</span>
            <span>5 simple steps</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-60"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-700 font-medium mb-6">
            <Clock className="w-3 h-3" />
            Setup in minutes, not hours
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            Get started with confidence
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Our streamlined onboarding process gets you up and running quickly. 
            Join thousands of businesses already growing with our platform.
          </p>

          <button onClick={()=>navigate("/")} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm">
            Begin setup
            <ArrowRight  className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 border-y border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-semibold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              How it works
            </h2>
            <p className="text-gray-600 text-lg">
              Follow these steps to set up your account
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  className="w-full p-8 text-left flex items-start gap-6"
                >
                  {/* Number */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center text-white font-semibold shadow-sm`}>
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {step.subtitle}
                        </p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${expandedStep === step.id ? 'rotate-180' : ''}`} />
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </button>

                {/* Expandable Details */}
                <div className={`overflow-hidden transition-all duration-300 ${expandedStep === step.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-8 pb-8 pt-2">
                    <div className="pl-16 border-l-2 border-gray-100 ml-6">
                      <div className="space-y-3">
                        {step.features.map((feature, featureIdx) => (
                          <div key={featureIdx} className="flex items-center gap-3">
                            <div className={`w-5 h-5 ${step.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </div>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection line */}
                {idx < steps.length - 1 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Enterprise security",
                desc: "Your data is protected with bank-level encryption and security protocols"
              },
              {
                icon: Award,
                title: "Industry certified",
                desc: "SOC 2 Type II certified with regular third-party security audits"
              },
              {
                icon: TrendingUp,
                title: "Proven success",
                desc: "Trusted by over 50,000 businesses across 120+ countries"
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm mb-4">
                  <item.icon className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Ready to transform your business?
          </h2>
      
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={()=>navigate("/")} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm">
              Start free trial
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={()=>navigate('/contact')} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Contact sales
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Join 50,000+ businesses • Cancel anytime • No credit card required
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProcessInstructions;