import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Feather, Globe, Award, Compass, ArrowRight, Quote, Check, PenLine } from 'lucide-react';
import SEO from '../components/SEO';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white py-10 sm:py-16 animate-fadeIn font-sans">
      <SEO
        title="About ZAIB ATTIRE — Fashion Manifesto & Editorial Council"
        description="Learn the history, editorial mission, and contributor manifesto behind ZAIB ATTIRE. Chronicling haute couture, runway trends, and guest fashion voices."
        keywords="about zaib attire, fashion manifesto, haute couture editorial, luxury fashion journalism, runway critics, fashion guest posting"
        canonicalUrl="/about"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'About', item: '/about' }
        ]}
      />

      <div className="max-w-reading mx-auto px-5 sm:px-8">
        
        {/* Masthead Header */}
        <div className="border-b border-ink-200 pb-8 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-[2px] bg-brand-accent"></span>
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              About The Publication
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-900 tracking-tight mb-4">
            About ZAIB ATTIRE
          </h1>
          <p className="text-xl text-ink-600 font-serif leading-relaxed">
            Where fashion critics, emerging stylists, and couture observers chronicle runway trends and publish original stories.
          </p>
        </div>

        {/* Lead Hero Image */}
        <div className="aspect-[16/9] overflow-hidden rounded-xl bg-ink-100 mb-10 border border-ink-200">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80"
            alt="ZAIB ATTIRE Runway Editorial"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Editorial Body — Medium Article Style Typography */}
        <div className="space-y-6 text-ink-800 font-serif text-lg leading-relaxed mb-12">
          <p>
            Founded as an independent fashion chronicle, <strong className="font-sans font-semibold text-ink-900">ZAIB ATTIRE</strong> has grown into an international platform celebrating contemporary couture, avant-garde garment construction, and runway culture.
          </p>

          <p>
            In a digital landscape inundated with ephemeral micro-trends and disposable apparel, we stand for thoughtful fashion criticism — honoring master drapers, independent textile innovators, and visionary houses who treat style as an architectural art form.
          </p>

          <blockquote className="border-l-3 border-brand-accent pl-6 py-2 my-8 italic text-xl text-ink-700 bg-ink-50 rounded-r-lg">
            "We believe high fashion is not mere consumption; it is architecture for the human form, an anthropological mirror of our era, and pure sensory expression."
          </blockquote>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 pt-6">
            The Contributor Ethos
          </h2>

          <p>
            Unlike legacy publications behind closed doors, ZAIB ATTIRE champions a democratized guest posting ecosystem. We open our platform to emerging fashion writers, freelance stylists, brand founders, and culture critics from around the world.
          </p>

          <p>
            Every guest article is held to clear editorial standards, rewarding contributors with wide organic readership, community exposure, and permanent dofollow backlinks to their brand or portfolio.
          </p>
        </div>

        {/* Publication Stats */}
        <div className="grid grid-cols-3 gap-4 border-y border-ink-200 py-8 mb-12 text-center">
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-ink-900">100+</div>
            <div className="text-xs text-ink-500 font-sans mt-1">Curated Stories</div>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-ink-900">50k+</div>
            <div className="text-xs text-ink-500 font-sans mt-1">Monthly Readers</div>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-ink-900">100%</div>
            <div className="text-xs text-ink-500 font-sans mt-1">Free Guest Posts</div>
          </div>
        </div>

        {/* Four Fashion Capitals */}
        <div className="mb-12">
          <h3 className="font-serif text-xl font-bold text-ink-900 mb-4">
            Editorial Desks
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { city: 'Paris', focus: 'Haute Couture' },
              { city: 'Milan', focus: 'Heritage Tailoring' },
              { city: 'London', focus: 'Avant-Garde Street' },
              { city: 'New York', focus: 'Ready-to-Wear & Tech' },
            ].map(({ city, focus }) => (
              <div key={city} className="border border-ink-200 rounded-lg p-3.5 bg-ink-50/50 text-center">
                <span className="font-serif font-bold text-base text-ink-900 block">{city}</span>
                <span className="text-[11px] text-ink-500 font-sans">{focus}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write for us CTA */}
        <div className="border border-ink-200 rounded-2xl p-8 bg-gradient-to-br from-white to-ink-100 text-center space-y-4">
          <Feather size={24} className="text-brand-accent mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-ink-900">
            Write on ZAIB ATTIRE
          </h3>
          <p className="text-sm text-ink-500 max-w-md mx-auto leading-relaxed">
            Have a fashion critique, trend report, or designer showcase to share? Submit your free guest post today with dofollow attribution.
          </p>
          <div>
            <Link
              to="/write"
              className="btn-primary text-sm py-3 px-6 inline-flex"
            >
              <PenLine size={15} />
              <span>Start Writing</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
