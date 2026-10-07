import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Send, CheckCircle2, Phone, Clock, MessageSquare } from 'lucide-react';
import SEO from '../components/SEO';
import { api } from '../utils/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Editorial Desk',
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
    <div className="min-h-screen bg-[#fafaf8] py-10 sm:py-16 animate-fadeIn">
      <SEO
        title="Contact The Atelier — Editorial & Press Inquiries"
        description="Direct correspondence with ZAIB ATTIRE editorial directors, advertising managers, press bureaus, and guest posting team."
        keywords="contact zaib attire, fashion editor contact, fashion guest post submission, advertise fashion blog, editorial press desk"
        canonicalUrl="/contact"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Contact Editorial Desk', item: '/contact' }
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-950 text-gold-400 text-[10px] tracking-luxury uppercase font-bold mb-4">
            <Mail size={12} />
            <span>COMMUNICATIONS ATELIER • PRESS & DISPATCHES</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-luxury-950 mb-4">
            Contact ZAIB ATTIRE
          </h1>
          <p className="font-cormorant text-lg sm:text-2xl text-luxury-600 italic leading-relaxed">
            "Direct correspondence with our editorial directors, advertising managers, and global bureaus."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-luxury-200 p-6 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-luxury-950">
                  Dispatch Received
                </h3>
                <p className="text-xs text-luxury-600 leading-relaxed max-w-md mx-auto">
                  Your message has been assigned to the <strong>{formData.department}</strong>. A representative from our Paris or London bureau will respond to <strong className="text-luxury-950">{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      department: 'Editorial Desk',
                      subject: '',
                      message: ''
                    });
                  }}
                  className="mt-4 px-6 py-2.5 bg-luxury-950 text-gold-400 text-xs uppercase tracking-luxury font-bold hover:bg-gold-500 hover:text-luxury-950 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-editorial text-xl font-bold text-luxury-950 mb-1">
                    Send Direct Dispatch
                  </h3>
                  <p className="text-xs text-luxury-500">
                    All inquiries are monitored Monday through Friday, 9:00 AM – 6:00 PM CET.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-luxury-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Marc Jacobs"
                      className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-luxury-700 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="marc@fashion.com"
                      className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-luxury-700 mb-1">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs uppercase tracking-wider focus:bg-white focus:outline-none focus:border-gold-500"
                    >
                      <option value="Editorial Desk">Editorial Desk (Stories & Trends)</option>
                      <option value="Guest Contributor Support">Guest Contributor Support</option>
                      <option value="Advertising & Sponsorships">Advertising & Sponsorships</option>
                      <option value="Press & PR Inquiries">Press & PR Inquiries</option>
                      <option value="Technical & Admin">Technical & Website Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-luxury-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Fashion Week Coverage Inquiry"
                      className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-luxury-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide full details regarding your inquiry..."
                    className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500 font-serif"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-luxury-950 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 transition text-xs uppercase tracking-luxury font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{submitting ? 'Transmitting Dispatch...' : 'Send Message'}</span>
                  <Send size={13} />
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Bureau Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-luxury-950 text-white p-6 sm:p-8 border border-gold-500/40">
              <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-bold block mb-2">
                HEADQUARTERS & ATELIER
              </span>
              <h4 className="font-editorial text-xl font-bold mb-4">
                ZAIB ATTIRE Editorial Office
              </h4>
              <div className="space-y-3 text-xs text-luxury-300 font-light">
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-gold-400 shrink-0 mt-0.5" />
                  <span>18 Rue du Faubourg Saint-Honoré, 75008 Paris, France</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="text-gold-400 shrink-0" />
                  <span>editorial@zaibattire.com</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={15} className="text-gold-400 shrink-0" />
                  <span>Mon – Fri, 9:00 – 18:00 CET</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-luxury-200 p-6 space-y-3 text-xs text-luxury-700">
              <h5 className="font-editorial text-base font-bold text-luxury-950">
                Department Direct Contacts
              </h5>
              <div className="space-y-2 border-t border-luxury-100 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-luxury-900">Guest Posting Inquiries:</span>
                  <span className="text-gold-700 font-mono">guest@zaibattire.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-luxury-900">Advertising & Media Kit:</span>
                  <span className="text-gold-700 font-mono">partnerships@zaibattire.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-luxury-900">Press & Lookbooks:</span>
                  <span className="text-gold-700 font-mono">press@zaibattire.com</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
