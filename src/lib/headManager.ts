/**
 * Dynamic Document Head & SEO Manager
 * Manages document titles, meta descriptions, robots directives, Open Graph,
 * Twitter cards, canonical URLs, and structured JSON-LD Event schema for rich search indexing.
 */

export interface PageHeadMeta {
  title: string;
  description: string;
  canonicalPath?: string;
  noIndex?: boolean;
  ogType?: string;
  keywords?: string[];
}

export function updateDocumentHead(meta: PageHeadMeta) {
  if (typeof document === 'undefined') return;

  // 1. Title
  document.title = meta.title;

  // 2. Helper to set or create meta tags
  const setMetaTag = (attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 3. Helper to set or create link tags (e.g. canonical)
  const setLinkTag = (rel: string, href: string) => {
    let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  };

  // Standard Meta Tags
  setMetaTag('name', 'description', meta.description);
  setMetaTag(
    'name', 
    'robots', 
    meta.noIndex ? 'noindex, nofollow, noarchive' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  );

  if (meta.keywords && meta.keywords.length > 0) {
    setMetaTag('name', 'keywords', meta.keywords.join(', '));
  }

  // Open Graph
  setMetaTag('property', 'og:title', meta.title);
  setMetaTag('property', 'og:description', meta.description);
  setMetaTag('property', 'og:type', meta.ogType || 'website');
  
  const origin = window.location.origin || 'https://columbiamarket.org';
  const canonicalUrl = meta.canonicalPath 
    ? `${origin}${meta.canonicalPath.startsWith('/') ? meta.canonicalPath : `/${meta.canonicalPath}`}`
    : `${origin}${window.location.pathname}`;

  setMetaTag('property', 'og:url', canonicalUrl);
  setLinkTag('canonical', canonicalUrl);

  // Twitter Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', meta.title);
  setMetaTag('name', 'twitter:description', meta.description);

  // 4. Inject or Update JSON-LD Structured Data Schema for Search Engines (Event Schema)
  if (!meta.noIndex) {
    const jsonLdId = 'festival-structured-data';
    let scriptEl = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = jsonLdId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const eventSchema = {
      '@context': 'https://schema.org',
      '@type': 'Festival',
      'name': 'Community Vendor Marketplace & Festival Expo',
      'description': meta.description,
      'url': origin,
      'startDate': '2026-09-18T10:00:00-04:00',
      'endDate': '2026-09-20T20:00:00-04:00',
      'eventStatus': 'https://schema.org/EventScheduled',
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
      'location': {
        '@type': 'Place',
        'name': 'Columbia County Fairgrounds & River Pavilion',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Fairgrounds Pavilion & Green',
          'addressLocality': 'Columbia',
          'addressRegion': 'SC',
          'addressCountry': 'US'
        }
      },
      'offers': {
        '@type': 'Offer',
        'url': `${origin}/#vendor-booking`,
        'price': '0',
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock',
        'validFrom': '2026-01-01'
      },
      'organizer': {
        '@type': 'Organization',
        'name': 'Columbia Community Festival Operations',
        'url': origin
      }
    };

    scriptEl.textContent = JSON.stringify(eventSchema);
  } else {
    // Remove structured data in admin views
    const scriptEl = document.getElementById('festival-structured-data');
    if (scriptEl) {
      scriptEl.remove();
    }
  }
}
