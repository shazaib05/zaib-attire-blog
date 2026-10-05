import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../utils/api';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubmitting(true);
    setMessage('');
    try {
      const res = await api.subscribeNewsletter(email);
      setMessage(res.message || 'You have entered the Atelier Circle.');
      setIsSuccess(true);
      setEmail('');
    } catch {
      setMessage('Failed to subscribe. Please try again.');
      setIsSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-luxury-950 text-white border-t border-luxury-800 py-16 sm:py-20 relative overflow-hidden">
      {/* Subtle gold luxury background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 text-gold-400 text-[10px] tracking-luxury uppercase font-bold mb-3 border border-gold-500/30 px-3 py-1">
          <Sparkles size={11} className="text-gold-400" />
          <span>JOIN THE ATELIER CIRCLE</span>
        </div>

        <h3 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Private Dispatches from the World's Runways
        </h3>

        <p className="font-cormorant text-lg sm:text-xl text-luxury-300 max-w-2xl mx-auto italic mb-8 font-light">
          "Receive front-row analysis, curated lookbooks, and invitation-only contributor dispatches directly to your inbox every Sunday morning."
        </p>

        {isSuccess ? (
          <div className="p-4 bg-gold-500/15 border border-gold-500/40 text-gold-300 max-w-md mx-auto text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-gold-400" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxury-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your personal email address..."
                className="w-full pl-10 pr-4 py-3 bg-luxury-900 border border-luxury-700 text-xs tracking-wider placeholder:text-luxury-500 text-white focus:outline-none focus:border-gold-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-luxury transition shadow-glow-gold flex items-center justify-center gap-2 shrink-0"
            >
              <span>{submitting ? 'Connecting...' : 'Request Invitation'}</span>
              <ArrowRight size={13} />
            </button>
          </form>
        )}

        <p className="text-[10px] text-luxury-500 uppercase tracking-widest mt-4">
          Strictly Curated • No Algorithms • Unsubscribe at Any Moment
        </p>
      </div>
    </section>
  );
}
