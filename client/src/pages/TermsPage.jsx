import React, { useEffect } from 'react';
import { BookOpen, CheckCircle2, Feather, AlertCircle, Scale, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf8] py-12 sm:py-16 animate-fadeIn font-sans">
      <SEO
        title="Terms of Service & Editorial Guidelines — Guest Post Standards"
        description="Official terms of service, contributor agreement, and guest post editorial standards for ZAIB ATTIRE. Backlink quality, original content, and copyright policies."
        keywords="terms of service, guest post guidelines, fashion contributor rules, backlink policy, zaib attire editorial standards"
        canonicalUrl="/terms"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Terms & Editorial Codex', item: '/terms' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="border-b border-luxury-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-950 text-gold-400 text-[10px] tracking-luxury uppercase font-bold mb-4">
            <Scale size={12} />
            <span>EDITORIAL COUNCIL • STANDARDS OF PUBLICATION</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-luxury-950 mb-3">
            Terms of Service &amp; Contributor Codex
          </h1>
          <p className="text-xs text-luxury-500 uppercase tracking-widest font-semibold">
            Governing All Publications, Brand Submissions &amp; Guest Articles
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 font-serif text-base sm:text-lg text-luxury-800 leading-relaxed">
          
          <section className="bg-white p-6 sm:p-8 border border-luxury-200 shadow-sm space-y-4 font-sans text-sm">
            <h2 className="font-editorial text-2xl font-bold text-luxury-950 flex items-center gap-2">
              <BookOpen size={20} className="text-gold-600" />
              1. Acceptance of Editorial Terms
            </h2>
            <p className="text-luxury-700 leading-relaxed font-serif text-base">
              By accessing ZAIB ATTIRE or submitting articles, brand stories, or multimedia through our Contributor Studio, you agree to comply with these Terms of Service. These guidelines protect our readership from spam and ensure every article provides genuine value and search authority.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 border border-luxury-200 shadow-sm space-y-4 font-sans text-sm">
            <h2 className="font-editorial text-2xl font-bold text-luxury-950 flex items-center gap-2">
              <Feather size={20} className="text-gold-600" />
              2. Guest Posting &amp; Backlink Editorial Standards
            </h2>
            <p className="text-luxury-700 leading-relaxed font-serif text-base">
              To uphold high Google Search Quality Standards (E-E-A-T), all guest post submissions must satisfy the following criteria:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-luxury-700 font-serif text-base">
              <li><strong>Originality &amp; Integrity:</strong> Articles must be 100% original, well-researched, and free of automated spinning or copyright infringements.</li>
              <li><strong>Natural Contextual Anchor Links:</strong> Backlinks must fit naturally within the body copy using relevant, descriptive anchor text. Keyword stuffing or spammy commercial domains (gambling, illicit products, deceptive schemes) are strictly forbidden.</li>
              <li><strong>High-Resolution Visuals:</strong> All articles require a verified, high-quality featured cover image (minimum 1200px width) relevant to fashion, lifestyle, craftsmanship, or design.</li>
              <li><strong>Length &amp; Substance:</strong> Submissions must offer comprehensive substance (minimum 500–800 words recommended for search engine indexing).</li>
            </ul>
          </section>

          <section className="bg-white p-6 sm:p-8 border border-luxury-200 shadow-sm space-y-4 font-sans text-sm">
            <h2 className="font-editorial text-2xl font-bold text-luxury-950 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-gold-600" />
              3. Permanent Dofollow Link Guarantee
            </h2>
            <p className="text-luxury-700 leading-relaxed font-serif text-base">
              Once approved and published, guest articles remain permanently active in the ZAIB ATTIRE archives with indexable dofollow backlinks, contributing continuous SEO equity and referral authority to the contributor's brand.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 border border-luxury-200 shadow-sm space-y-4 font-sans text-sm">
            <h2 className="font-editorial text-2xl font-bold text-luxury-950 flex items-center gap-2">
              <AlertCircle size={20} className="text-gold-600" />
              4. Editorial Review &amp; Moderation Rights
            </h2>
            <p className="text-luxury-700 leading-relaxed font-serif text-base">
              ZAIB ATTIRE editors reserve the right to perform minor typographic, grammatical, or formatting adjustments to conform to our publication style. Submissions that fail to meet editorial standards may be rejected or held for revision.
            </p>
          </section>

          {/* Quick CTA */}
          <div className="bg-luxury-950 text-luxury-100 p-8 text-center space-y-4 font-sans">
            <h3 className="font-editorial text-2xl font-bold text-white">
              Ready to Share Your Fashion Authority?
            </h3>
            <p className="text-xs text-luxury-400 max-w-md mx-auto">
              Join our verified contributors and publish your article today with permanent brand backlinks.
            </p>
            <Link
              to="/write"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-luxury-950 font-bold uppercase tracking-luxury text-xs hover:bg-gold-400 transition shadow-lg"
            >
              <span>Access Contributor Studio</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
