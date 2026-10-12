import React, { useEffect } from 'react';
import { BookOpen, CheckCircle2, Feather, AlertCircle, Scale, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 sm:py-16 animate-fadeIn font-sans">
      <SEO
        title="Terms of Service & Editorial Guidelines — Guest Post Standards"
        description="Official terms of service, contributor agreement, and guest post editorial standards for ZAIB ATTIRE. Backlink quality, original content, and copyright policies."
        keywords="terms of service, guest post guidelines, fashion contributor rules, backlink policy, zaib attire editorial standards"
        canonicalUrl="/terms"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Terms of Service', item: '/terms' }
        ]}
      />

      <div className="max-w-reading mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="border-b border-ink-200 pb-8 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-[2px] bg-brand-accent"></span>
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Editorial Standards &amp; Terms
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-ink-900 mb-3">
            Terms of Service &amp; Contributor Codex
          </h1>
          <p className="text-sm text-ink-500">
            Governing All Publications, Brand Submissions &amp; Guest Articles
          </p>
        </div>

        {/* Content — Medium Style Typography */}
        <div className="space-y-8 font-serif text-lg text-ink-800 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-ink-900 flex items-center gap-2">
              1. Acceptance of Editorial Terms
            </h2>
            <p>
              By accessing ZAIB ATTIRE or submitting articles, brand stories, or multimedia through our contributor platform, you agree to comply with these Terms of Service. These guidelines ensure our readers receive high-caliber fashion analysis and our contributors receive durable search authority.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-ink-900 flex items-center gap-2">
              2. Guest Posting &amp; Backlink Standards
            </h2>
            <p>
              To maintain high editorial quality and Google Search integrity (E-E-A-T), all guest post submissions must satisfy the following:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-ink-700">
              <li><strong>Originality:</strong> Content must be 100% original, human-curated fashion analysis, brand reporting, or style perspectives. No spun content.</li>
              <li><strong>Contextual Backlinks:</strong> Up to 2 contextual dofollow anchor links are allowed per 1,000 words pointing to legitimate, relevant domains.</li>
              <li><strong>Author Attribution:</strong> Each published contributor receives a permanent author bio card with a dofollow link to their site or profile.</li>
              <li><strong>Prohibited Niches:</strong> Content linking to casinos, adult content, predatory lending, or dangerous goods will be rejected immediately.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-ink-900 flex items-center gap-2">
              3. Copyright &amp; Intellectual Property
            </h2>
            <p>
              Authors retain intellectual ownership of their original prose while granting ZAIB ATTIRE a perpetual, non-exclusive license to publish, index, format, and syndicate the piece across our digital network.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-ink-900 flex items-center gap-2">
              4. Review Timelines &amp; Editorial Amendments
            </h2>
            <p>
              Our editors reserve the right to format typography, adjust heading hierarchies, optimize metadata for Google Search, and correct minor typos prior to publication. Reviews are typically completed within 48 hours.
            </p>
          </section>

          {/* CTA Box */}
          <div className="border border-ink-200 rounded-2xl p-8 bg-ink-100 text-center space-y-3 mt-10">
            <h3 className="font-serif text-2xl font-bold text-ink-900">
              Ready to Publish Your Story?
            </h3>
            <p className="text-sm text-ink-500 max-w-md mx-auto">
              Draft your article in our Medium-style story editor with permanent dofollow backlinks.
            </p>
            <div>
              <Link to="/write" className="btn-primary text-sm py-3 px-6 inline-flex">
                <span>Start Writing Story</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
