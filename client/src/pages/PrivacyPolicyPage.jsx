import React, { useEffect } from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, Mail, Globe } from 'lucide-react';
import SEO from '../components/SEO';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf8] py-12 sm:py-16 animate-fadeIn font-sans">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="border-b border-luxury-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-950 text-gold-400 text-[10px] tracking-luxury uppercase font-bold mb-4">
            <Shield size={12} />
            <span>LEGAL &amp; COMPLIANCE CODEX • E-E-A-T TRUSTED</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-luxury-950 mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs text-luxury-500 uppercase tracking-widest font-semibold">
            Last Updated: October 2026 • Effective Date: January 1, 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="prose prose-luxury max-w-none space-y-8 text-luxury-800 leading-relaxed font-serif text-base sm:text-lg">
          
          <section className="bg-white p-6 sm:p-8 border border-luxury-200 shadow-sm space-y-4 font-sans text-sm">
            <h2 className="font-editorial text-2xl font-bold text-luxury-950">1. Editorial Transparency &amp; Commitment</h2>
            <p className="text-luxury-700 leading-relaxed font-serif text-base">
              At <strong>ZAIB ATTIRE</strong> ("we", "our", or "the Atelier"), we prioritize the privacy and intellectual protection of our global readers, contributors, guest journalists, and commercial partners. This Privacy Policy outlines our transparent data practices across our web domains, APIs, and contributor portal.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 border border-luxury-200 shadow-sm space-y-4 font-sans text-sm">
            <h2 className="font-editorial text-2xl font-bold text-luxury-950">2. Contributor &amp; Author Information Collected</h2>
            <p className="text-luxury-700 leading-relaxed font-serif text-base">
              When submitting guest articles, applying as a fashion contributor, or subscribing to our Haute Couture dispatches, we may collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-luxury-700 font-serif text-base">
              <li><strong>Author Credentials:</strong> Legal or pen name, verified email (Gmail/corporate), and public author biography.</li>
              <li><strong>Brand &amp; Web Entities:</strong> Brand name, target domain URL, and social media handles for backlink attribution.</li>
              <li><strong>Communications:</strong> Editorial pitches, press release materials, and correspondence with our editors.</li>
            </ul>
          </section>

          <section className="bg-white p-6 sm:p-8 border border-luxury-200 shadow-sm space-y-4 font-sans text-sm">
            <h2 className="font-editorial text-2xl font-bold text-luxury-950">3. How Your Information Is Utilized</h2>
            <p className="text-luxury-700 leading-relaxed font-serif text-base">
              Collected information is strictly applied to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-luxury-700 font-serif text-base">
              <li>Reviewing, formatting, and publishing fashion guest posts and runway reviews.</li>
              <li>Facilitating verified dofollow anchor text backlinks to author web properties.</li>
              <li>Maintaining contributor records and synchronizing editorial logs with our private Google Workspace dispatch systems.</li>
              <li>Preventing automated spam, malicious code injections, or copyright infringements.</li>
            </ul>
          </section>

          <section className="bg-white p-6 sm:p-8 border border-luxury-200 shadow-sm space-y-4 font-sans text-sm">
            <h2 className="font-editorial text-2xl font-bold text-luxury-950">4. Third-Party Disclosures &amp; Backlinks</h2>
            <p className="text-luxury-700 leading-relaxed font-serif text-base">
              We never sell, rent, or lease author or subscriber data to third-party data brokers. Articles published on ZAIB ATTIRE are publicly indexable by major search engines (Google, Bing). Any links contained within published guest articles represent direct external links governed by the respective target websites’ privacy terms.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 border border-luxury-200 shadow-sm space-y-4 font-sans text-sm">
            <h2 className="font-editorial text-2xl font-bold text-luxury-950">5. Cookies &amp; Performance Metrics</h2>
            <p className="text-luxury-700 leading-relaxed font-serif text-base">
              We use minimal, high-efficiency local storage and session cookies exclusively to preserve contributor login states, reading preferences, and performance caching to uphold rapid Core Web Vitals performance.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 border border-luxury-200 shadow-sm space-y-4 font-sans text-sm">
            <h2 className="font-editorial text-2xl font-bold text-luxury-950">6. Editorial Rights &amp; Data Erasure</h2>
            <p className="text-luxury-700 leading-relaxed font-serif text-base">
              Authors and readers may request data removal, author profile redaction, or article updates at any time by contacting our editorial desk at <strong className="text-luxury-950">editorial@zaibattire.com</strong>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
