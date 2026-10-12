import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, Feather } from 'lucide-react';
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
      setMessage(res.message || 'You\'re subscribed! Welcome to ZAIB ATTIRE.');
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
    <section className="bg-white border-t border-ink-200 py-14 sm:py-20">
      <div className="max-w-reading mx-auto px-5 text-center">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mx-auto mb-5">
          <Feather size={20} className="text-brand-accent" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 mb-3">
          Stories in Your Inbox
        </h2>
        <p className="text-base text-ink-500 leading-relaxed mb-8 max-w-md mx-auto">
          Get curated fashion articles, runway trends, and guest post updates delivered every Sunday morning.
        </p>

        {isSuccess ? (
          <div className="flex items-center justify-center gap-2.5 text-green-700 bg-green-50 border border-green-200 px-6 py-4 rounded-2xl max-w-sm mx-auto">
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">{message}</span>
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto"
              id="newsletter-form"
            >
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full pl-11 pr-4 py-3 border border-ink-200 rounded-full text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-400 focus:ring-2 focus:ring-ink-100 transition bg-white"
                  id="newsletter-email-input"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-sm py-3 px-6 shrink-0 disabled:opacity-60"
                id="newsletter-submit-btn"
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
                {!submitting && <ArrowRight size={14} />}
              </button>
            </form>
            {message && !isSuccess && (
              <p className="text-xs text-red-500 mt-3">{message}</p>
            )}
            <p className="text-xs text-ink-400 mt-4">
              No spam · Unsubscribe at any time
            </p>
          </>
        )}
      </div>
    </section>
  );
}
