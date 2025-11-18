import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, MessageSquare, Headphones, FileText, Users } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    howDidYouHear: ''
  });
  
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFormStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          howDidYouHear: ''
        });
        setFormStatus(null);
      }, 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email us",
      details: "support@yourcompany.com",
      subdetails: "We'll respond within 24 hours",
      link: "mailto:support@yourcompany.com"
    },
    {
      icon: Phone,
      title: "Call us",
      details: "+1 (555) 123-4567",
      subdetails: "Mon-Fri from 9am to 6pm EST",
      link: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Visit us",
      details: "123 Business Street",
      subdetails: "San Francisco, CA 94102",
      link: "https://maps.google.com"
    }
  ];

  const supportOptions = [
    {
      icon: MessageSquare,
      title: "Sales inquiry",
      description: "Get in touch with our sales team to discuss plans and pricing"
    },
    {
      icon: Headphones,
      title: "Technical support",
      description: "Need help with your account or have technical questions?"
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Browse our comprehensive guides and API documentation"
    },
    {
      icon: Users,
      title: "Partnership",
      description: "Interested in partnering with us? Let's explore opportunities"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Header */}
      <section className="relative px-6 pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-60"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-700 font-medium mb-6">
            <Clock className="w-3 h-3" />
            Average response time: 2 hours
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            Let's talk
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have a question or need assistance? Our team is here to help you succeed. 
            Reach out and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((info, idx) => (
              <a
                key={idx}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                  <info.icon className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{info.details}</p>
                <p className="text-sm text-gray-500">{info.subdetails}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Send us a message
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we'll get back to you shortly
                </p>

                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Your company"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="sales">Sales inquiry</option>
                      <option value="support">Technical support</option>
                      <option value="partnership">Partnership opportunity</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="6"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  {/* How did you hear */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How did you hear about us?
                    </label>
                    <select
                      name="howDidYouHear"
                      value={formData.howDidYouHear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option value="">Select an option</option>
                      <option value="search">Search engine</option>
                      <option value="social">Social media</option>
                      <option value="referral">Referral</option>
                      <option value="advertisement">Advertisement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Success/Error Messages */}
                  {formStatus === 'success' && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Message sent successfully!</p>
                        <p className="text-xs text-green-700">We'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  )}

                  {formStatus === 'error' && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-900">Something went wrong</p>
                        <p className="text-xs text-red-700">Please try again or contact us directly.</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Support Options */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How can we help?
                </h3>
                <div className="space-y-4">
                  {supportOptions.map((option, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                        <option.icon className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          {option.title}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Office hours
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="text-gray-900 font-medium">9am - 6pm EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="text-gray-900 font-medium">10am - 4pm EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="text-gray-500">Closed</span>
                  </div>
                </div>
              </div>

              {/* Quick Response */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Need immediate help?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Check out our knowledge base for instant answers to common questions.
                </p>
                <button className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                  Visit help center
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      {/* <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Find quick answers to common questions. Can't find what you're looking for? 
            Don't hesitate to reach out.
          </p>
          <button className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm">
            View all FAQs
          </button>
        </div>
      </section> */}
    </div>
  );
};

export default Contact;