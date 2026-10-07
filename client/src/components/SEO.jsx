import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'ZAIB ATTIRE';
const BASE_URL = 'https://zaibattire.com';
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;
const DEFAULT_DESC = 'ZAIB ATTIRE — The premier luxury fashion blog, runway trend forecast, and guest editorial platform. Discover haute couture, street style subcultures, quiet luxury, and publish guest posts.';

export default function SEO({
  title = '',
  description = DEFAULT_DESC,
  keywords = 'fashion blog, haute couture, runway trends 2026, street style, quiet luxury, fashion guest post, free guest posting, backlink fashion, luxury atelier',
  image = DEFAULT_IMAGE,
  article = null, // { title, datePublished, authorName, authorBio, category, tags, readTime }
  type = 'website'
}) {
  const location = useLocation();
  const canonicalUrl = `${BASE_URL}${location.pathname}`;
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Haute Couture, Fashion Trends & Guest Editorial Platform`;

  useEffect(() => {
    // 1. Page Title
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMeta('name', 'author', article?.authorName || SITE_NAME);

    // 3. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // 4. Open Graph (Facebook / LinkedIn / WhatsApp)
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', article ? 'article' : type);
    setMeta('property', 'og:image', image || DEFAULT_IMAGE);
    setMeta('property', 'og:locale', 'en_US');

    // 5. Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image || DEFAULT_IMAGE);

    // 6. JSON-LD Schema Markup
    let schemaScript = document.getElementById('seo-json-ld');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-json-ld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    let schemaData;
    if (article) {
      // BlogPosting Schema
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        headline: article.title || title,
        description: description,
        image: image || DEFAULT_IMAGE,
        datePublished: article.datePublished || new Date().toISOString(),
        dateModified: article.dateModified || article.datePublished || new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: article.authorName || 'Editorial Contributor',
          url: article.authorWebsite || canonicalUrl
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/logo.png`
          }
        },
        articleSection: article.category || 'Fashion Trends',
        keywords: keywords
      };
    } else {
      // WebSite / Organization Schema
      schemaData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${BASE_URL}/#organization`,
            name: SITE_NAME,
            url: BASE_URL,
            logo: {
              '@type': 'ImageObject',
              url: `${BASE_URL}/logo.png`,
              caption: SITE_NAME
            },
            sameAs: [
              'https://instagram.com/zaibattire_official',
              'https://twitter.com/zaibattire'
            ]
          },
          {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            url: BASE_URL,
            name: SITE_NAME,
            description: DEFAULT_DESC,
            publisher: {
              '@id': `${BASE_URL}/#organization`
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: `${BASE_URL}/blog?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          }
        ]
      };
    }

    schemaScript.text = JSON.stringify(schemaData);
  }, [fullTitle, description, keywords, image, canonicalUrl, type, article]);

  return null;
}
