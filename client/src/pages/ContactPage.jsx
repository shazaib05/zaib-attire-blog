import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Send, CheckCircle2, Phone, Clock, MessageSquare, Feather } from 'lucide-react';
import SEO from '../components/SEO';
import { api } from '../utils/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Guest Post & Contributor Desk',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dispatchId, setDispatchId] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.submitContactMessage(formData);
      if (res.success) {
        setDispatchId(res.dispatch_id);
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to submit contact message:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 sm:py-16 animate-fadeIn font-sans">
      <SEO
        title="Contact ZAIB ATTIRE — Editorial & Guest Post Inquiries"
        description="Direct correspondence with ZAIB ATTIRE editors, guest post review team, advertising coordinators, and press bureaus."
        keywords="contact zaib attire, fashion editor contact, fashion guest post submission, advertise fashion blog, editorial press desk"
        canonicalUrl="/contact"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Contact', item: '/contact' }
        ]}
      />

      <div className="max-w-reading mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="border-b border-ink-200 pb-8 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-[2px] bg-brand-accent"></span>
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Editorial Communications
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-900 tracking-tight mb-3">
            Get in Touch
          </h1>
          <p className="text-lg text-ink-500 leading-relaxed font-serif">
            Reach out to our editors, pitch story ideas, inquire about guest posts, or propose brand partnerships.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="border border-ink-200 rounded-2xl p-6 sm:p-10 bg-white shadow-xs mb-12">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-ink-900">
                Message Received
              </h3>
              <p className="text-sm text-ink-600 leading-relaxed max-w-md mx-auto">
                Your inquiry has been assigned to our <strong>{formData.department}</strong>. We will respond to <strong>{formData.email}</strong> shortly.
              </p>
              {dispatchId && (
                <div className="font-mono text-xs text-ink-400">
                  Reference: {dispatchId}
                </div>
              )}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      department: 'Guest Post & Contributor Desk',
                      subject: '',
                      message: ''
                    });
                  }}
                  className="btn-primary text-xs py-2.5 px-6"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Laurent Moret"
                    className="w-full px-4 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 transition cursor-pointer"
                  >
                    <option value="Guest Post & Contributor Desk">Guest Post & Contributor Desk</option>
                    <option value="Editorial Feedback & Pitches">Editorial Feedback & Pitches</option>
                    <option value="Brand Advertising & Media Kit">Brand Advertising & Media Kit</option>
                    <option value="Press & Media Relations">Press & Media Relations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief subject..."
                    className="w-full px-4 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share details regarding your inquiry or story proposal..."
                  className="w-full px-4 py-3 bg-ink-100 rounded-lg text-sm text-ink-900 font-serif focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 transition resize-y"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-ink-400">
                  Typical response time: 24 - 48 hours
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-sm py-3 px-7 disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{submitting ? 'Transmitting...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="border border-ink-200 rounded-xl p-5 bg-ink-50/50">
            <Mail size={18} className="text-brand-accent mx-auto mb-2" />
            <span className="text-xs font-bold text-ink-900 block mb-1">Email Inquiries</span>
            <span className="text-xs text-ink-500 font-mono">editorial@zaibattire.com</span>
          </div>

          <div className="border border-ink-200 rounded-xl p-5 bg-ink-50/50">
            <Feather size={18} className="text-brand-accent mx-auto mb-2" />
            <span className="text-xs font-bold text-ink-900 block mb-1">Guest Posting</span>
            <span className="text-xs text-ink-500 font-mono">100% Free Submissions</span>
          </div>

          <div className="border border-ink-200 rounded-xl p-5 bg-ink-50/50">
            <Clock size={18} className="text-brand-accent mx-auto mb-2" />
            <span className="text-xs font-bold text-ink-900 block mb-1">Review Time</span>
            <span className="text-xs text-ink-500">Under 48 Hours</span>
          </div>
        </div>

      </div>
    </div>
  );
}
