import React, { useEffect } from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, Mail, Globe } from 'lucide-react';
import SEO from '../components/SEO';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 sm:py-16 animate-fadeIn font-sans">
      <SEO
        title="Privacy Policy — Data Protection & Contributor Privacy"
        description="Official privacy policy for ZAIB ATTIRE. How we protect contributor lead data, newsletter subscribers, cookies, and digital editorial communications."
        keywords="privacy policy, data protection, contributor privacy, zaib attire privacy, gdpr compliance fashion blog"
        canonicalUrl="/privacy"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Privacy Policy', item: '/privacy' }
        ]}
      />

      <div className="max-w-reading mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="border-b border-ink-200 pb-8 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-[2px] bg-brand-accent"></span>
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Legal &amp; Data Ethics
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-ink-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-ink-500">
            Last updated: October 2026 · Effective Date: January 1, 2026
          </p>
        </div>

        {/* Policy Content — Medium Article Style Typography */}
        <div className="space-y-8 text-ink-800 font-serif text-lg leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-ink-900">
              1. Editorial Transparency &amp; Commitment
            </h2>
            <p>
              At <strong>ZAIB ATTIRE</strong> ("we", "our", or "the platform"), we prioritize the privacy and intellectual property of our global readers, contributors, guest writers, and brand partners. This Privacy Policy outlines our transparent data practices across our web domains, APIs, and contributor portal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-ink-900">
              2. Contributor &amp; Author Information Collected
            </h2>
            <p>
              When submitting guest articles, applying as a fashion contributor, or subscribing to our email dispatches, we may collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-ink-700">
              <li><strong>Author Credentials:</strong> Pen name or legal name, verified email address, and author biography.</li>
              <li><strong>Brand &amp; Target URL:</strong> Brand website URL and social handles for dofollow backlink attribution.</li>
              <li><strong>Submissions:</strong> Article drafts, photography assets, and editorial correspondence.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-ink-900">
              3. Protection of Contributor Passwords &amp; Data
            </h2>
            <p>
              Contributor credentials and authentication tokens stored on client devices are handled with industry standards. We do not sell, rent, or trade your contact information to third-party data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-ink-900">
              4. Permanent Dofollow Link Integrity
            </h2>
            <p>
              Articles accepted and published on ZAIB ATTIRE are maintained permanently in our searchable editorial archive. Contextual anchor links and author bio attribution links are preserved as dofollow references as long as the linked destination adheres to web safety standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-ink-900">
              5. Contacting the Editorial Desk
            </h2>
            <p>
              For data protection questions, author profile modifications, or removal inquiries, please contact our editorial desk at <a href="mailto:editorial@zaibattire.com" className="text-brand-muted underline hover:text-ink-900">editorial@zaibattire.com</a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
