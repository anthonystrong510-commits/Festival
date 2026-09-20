/**
 * Dynamic Document Head & SEO Manager
 * Manages document titles, meta descriptions, robots directives, Open Graph,
 * Twitter cards, dynamic canonical URLs, and structured JSON-LD (Event + FAQPage)
 * schema for search engine indexing.
 */

export interface PageHeadMeta {
  title: string;
  description: string;
  canonicalPath?: string;
  noIndex?: boolean;
  ogType?: string;
  keywords?: string[];
  customOrigin?: string;
}

export function updateDocumentHead(meta: PageHeadMeta) {
  if (typeof document === 'undefined') return;

  // 1. Resolve current origin dynamically
  let origin = 'https://skysevents.online';
  if (meta.customOrigin && meta.customOrigin.trim().startsWith('http')) {
    origin = meta.customOrigin.trim().replace(/\/+$/, '');
  } else if (typeof window !== 'undefined' && window.location && window.location.origin) {
    origin = window.location.origin.replace(/\/+$/, '');
  }

  // 2. Title
  document.title = meta.title;

  // 3. Helper to set or create meta tags
  const setMetaTag = (attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 4. Helper to set or create link tags (e.g. canonical)
  const setLinkTag = (rel: string, href: string, type?: string, title?: string) => {
    let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
    if (type) el.setAttribute('type', type);
    if (title) el.setAttribute('title', title);
  };

  // Standard Meta Tags
  setMetaTag('name', 'description', meta.description);
  setMetaTag(
    'name', 
    'robots', 
    meta.noIndex 
      ? 'noindex, nofollow, noarchive' 
      : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  );

  // High-Intent Search Keywords (including Dating, Singles & Vendor Queries)
  const defaultKeywords = [
    'community marketplace',
    'artisan craft festival',
    'vendor application',
    'food truck rally',
    '50 states vendor directory',
    'dating events',
    'singles mixer',
    'festival date night',
    'speed dating pop-up',
    'singles meetups',
    'romantic date night ideas',
    'couples artisan market',
    'local dating fair',
    'matchmaking booths'
  ];

  const mergedKeywords = Array.from(new Set([...(meta.keywords || []), ...defaultKeywords]));
  setMetaTag('name', 'keywords', mergedKeywords.join(', '));

  // Canonical URL always using current origin
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentSearch = typeof window !== 'undefined' ? window.location.search : '';
  const canonicalUrl = meta.canonicalPath 
    ? `${origin}${meta.canonicalPath.startsWith('/') ? meta.canonicalPath : `/${meta.canonicalPath}`}`
    : `${origin}${currentPath}${currentSearch}`;

  setMetaTag('property', 'og:title', meta.title);
  setMetaTag('property', 'og:description', meta.description);
  setMetaTag('property', 'og:type', meta.ogType || 'website');
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:site_name', 'Community Vendor Marketplace & Dating Singles Festival');
  setLinkTag('canonical', canonicalUrl);

  // Link to XML Sitemaps
  setLinkTag('sitemap', `${origin}/sitemap.xml`, 'application/xml', 'Primary Sitemap');

  // Twitter Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', meta.title);
  setMetaTag('name', 'twitter:description', meta.description);

  // 5. Inject Structured JSON-LD (Event + FAQPage with Dating queries + WebSite)
  const jsonLdId = 'festival-structured-data';
  let scriptEl = document.getElementById(jsonLdId) as HTMLScriptElement | null;

  if (!meta.noIndex) {
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = jsonLdId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const structuredDataGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        // WebSite schema
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          'url': origin,
          'name': 'Community Vendor Marketplace & Dating Singles Festival Expo',
          'description': meta.description,
          'potentialAction': {
            '@type': 'SearchAction',
            'target': `${origin}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        },
        // Festival / Event schema
        {
          '@type': 'Festival',
          '@id': `${origin}/#event`,
          'name': 'Community Vendor Marketplace, Artisan Expo & Dating Singles Mixer',
          'description': meta.description,
          'url': origin,
          'startDate': '2026-10-02T10:00:00-04:00',
          'endDate': '2026-10-04T20:00:00-04:00',
          'eventStatus': 'https://schema.org/EventScheduled',
          'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
          'location': {
            '@type': 'Place',
            'name': 'Columbia County Fairgrounds & Riverfront Pavilion',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'Fairgrounds Pavilion & Green',
              'addressLocality': 'Columbia',
              'addressRegion': 'SC',
              'postalCode': '29201',
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
            'name': 'Community Festival & Singles Event Operations',
            'url': origin
          }
        },
        // Rich FAQPage Schema (incorporating Dating Search Queries & Vendor Policies)
        {
          '@type': 'FAQPage',
          '@id': `${origin}/#faq`,
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'Can dating services, matchmaking agencies, and singles event organizers apply for a vendor booth?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Yes! Matchmaking services, certified dating coaches, singles social clubs, relationship authors, and dating apps can book 10x10 or 10x20 spaces to host speed-dating micro-sessions, dating profile reviews, and matchmaking consultations.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What singles mixer events and speed dating activities happen at the festival?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The festival hosts daily Singles Social Mixers every evening from 5:30 PM to 8:30 PM at the Sunset Riverfront Pavilion, featuring Color-Coded Singles Icebreaker Wristbands, 5-minute mini speed-dating rounds, and social mixer games.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Is the festival a good date night destination for couples and first dates?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The festival is rated as a premier outdoor date night destination, offering waterfront artisan strolls, candlelit food truck dining tables, craft beer and wine tastings, live acoustic music, and couples craft workshops.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How do vendors apply for a booth space and what are the rates?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Vendors apply online through our Vendor Booking Portal. Standard 10x10 booth spaces start at $70/day with 1 table, 2 chairs, overnight security, and multi-day discounts included.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Is festival admission free for attendees?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Yes, general admission to the festival grounds, artisan aisles, concert stages, and singles mixers is 100% free with complimentary online RSVP passes.'
              }
            }
          ]
        }
      ]
    };

    scriptEl.textContent = JSON.stringify(structuredDataGraph);
  } else if (scriptEl) {
    // Remove structured data in admin views
    scriptEl.remove();
  }
}

