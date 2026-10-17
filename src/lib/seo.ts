/**
 * SEO & Metadata Utilities for AUTO CRAFT 3D
 * Developed & Designed by Ahad Ali Nisar
 */

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  jsonLd?: Record<string, any>;
}

export const BRAND_NAME = 'AUTO CRAFT 3D';
export const CREATOR_NAME = 'Ahad Ali Nisar';
export const CREATOR_CREDIT = 'Developed & Designed by Ahad Ali Nisar';

export const VIEW_METADATA_MAP: Record<string, PageMetadata> = {
  home: {
    title: 'AUTO CRAFT 3D — Precision Performance Workshop | Developed by Ahad Ali Nisar',
    description: 'Precision diagnostics, expert restoration, dynamometer tuning, and performance-focused automotive care in Islamabad. Developed & Designed by Ahad Ali Nisar.',
    keywords: ['Auto Craft 3D', 'precision automotive workshop', 'dyno tuning Islamabad', 'Porsche diagnostics', 'car restoration Pakistan', 'Ahad Ali Nisar'],
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AutoRepair',
      name: 'AUTO CRAFT 3D - Precision Performance Workshop',
      founder: {
        '@type': 'Person',
        name: 'Ahad Ali Nisar',
        jobTitle: 'Principal Software & Systems Architect',
      },
      description: 'Precision diagnostics, expert restoration, and performance-focused automotive care.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot 84, Industrial Triangle, Sector I-9/3',
        addressLocality: 'Islamabad',
        addressCountry: 'PK',
      },
      telephone: '+92-51-8899221',
      priceRange: 'PKR 6,500 - PKR 250,000',
    },
  },
  services: {
    title: 'Specialized Engineering Services | AUTO CRAFT 3D',
    description: 'Explore our 11 factory-level diagnostic and engineering procedures including dyno ECU tuning, Hunter 3D alignment, and concours restoration.',
    keywords: ['dyno tuning', 'computer diagnostics', 'laser wheel alignment', 'ceramic detailing', 'brake overhaul', 'Islamabad performance garage'],
  },
  estimator: {
    title: 'Live Workshop Cost Estimator | AUTO CRAFT 3D',
    description: 'Calculate transparent itemized repair and performance tuning estimates in PKR with category multipliers and add-on packages.',
    keywords: ['car repair cost calculator', 'tuning cost estimate PKR', 'workshop labor pricing', 'auto service estimator'],
  },
  booking: {
    title: 'Smart Bay Scheduler & Appointment Booking | AUTO CRAFT 3D',
    description: 'Reserve calibrated workshop bay capacity with atomic double-booking prevention in PKT timezone.',
    keywords: ['book workshop slot', 'car service appointment Islamabad', 'auto repair bay booking'],
  },
  gallery: {
    title: 'Project Gallery & Restoration Archives | AUTO CRAFT 3D',
    description: 'Inspect before and after restoration comparisons, dyno pull telemetry, and bespoke supercar builds.',
    keywords: ['BMW E30 restoration', 'Porsche 911 aerokit build', 'before after car detailing', 'project car showcase'],
  },
  reviews: {
    title: 'Client Testimonials & Verified Logs | AUTO CRAFT 3D',
    description: 'Read verified customer feedback and track telemetry ratings from performance drivers and collectors.',
    keywords: ['auto workshop reviews', 'dyno tuning testimonials', 'customer ratings Islamabad'],
  },
  about: {
    title: 'Engineering Facility & Standards | AUTO CRAFT 3D',
    description: 'Learn about our 12,000 sq ft cleanroom facility, Hunter optical alignment, Mainline AWD dyno cell, and master technicians.',
    keywords: ['cleanroom automotive facility', 'Hunter 3D alignment', 'Mainline AWD dyno', 'precision workshop Islamabad'],
  },
  contact: {
    title: 'Direct Intake Desk & Location | AUTO CRAFT 3D',
    description: 'Visit our facility at Sector I-9/3 Industrial Area Islamabad or submit an engineering inquiry directly to the workshop floor.',
    keywords: ['workshop address Islamabad', 'contact auto craft 3d', 'performance tuning inquiry'],
  },
  dashboard: {
    title: 'Customer Garage & Digital Passports | AUTO CRAFT 3D',
    description: 'Manage registered performance vehicles, track upcoming bay reservations, and inspect service telemetry.',
    keywords: ['customer portal', 'vehicle digital passport', 'service history'],
  },
  admin: {
    title: 'Operations Command & Dispatch | AUTO CRAFT 3D',
    description: 'Master workshop administrative console for managing bay appointments, pricing, inquiries, and security audit logs.',
    keywords: ['workshop admin panel', 'operations telemetry', 'appointment management'],
  },
  privacy: {
    title: 'Privacy Policy & Telemetry Security | AUTO CRAFT 3D',
    description: 'Our commitment to data protection, vehicle telemetry retention, and secure session management.',
  },
  terms: {
    title: 'Terms of Service & Engineering Warranty | AUTO CRAFT 3D',
    description: 'Review our non-binding estimate terms, 12-month engineering warranty, and bay scheduling rules.',
  },
  '404': {
    title: 'Pit Lane Not Found (404) | AUTO CRAFT 3D',
    description: 'The requested workshop bay or telemetry specification does not exist.',
  },
};

/**
 * Returns metadata for a given view name with fallback to home.
 */
export function getPageMetadata(view: string): PageMetadata {
  return VIEW_METADATA_MAP[view] || VIEW_METADATA_MAP.home;
}

/**
 * Safely updates or creates a meta tag in document head.
 */
function setMetaTag(selector: string, attributeName: string, attributeValue: string, content: string): void {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Dynamically updates document title, OpenGraph tags, Twitter cards, and JSON-LD structured data.
 */
export function updateSEO(metadata: PageMetadata): void {
  if (typeof document === 'undefined') return;

  // 1. Page Title
  document.title = metadata.title;

  // 2. Standard Meta Description & Keywords
  setMetaTag('meta[name="description"]', 'name', 'description', metadata.description);

  if (metadata.keywords && metadata.keywords.length > 0) {
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', metadata.keywords.join(', '));
  }

  // 3. OpenGraph Tags
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', metadata.title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', metadata.description);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', metadata.ogType || 'website');
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'AUTO CRAFT 3D');

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://autocraft3d.com';
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', metadata.canonicalUrl || currentUrl);

  // 4. Twitter / X Cards
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', metadata.title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', metadata.description);

  // 5. Canonical Link
  let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', metadata.canonicalUrl || currentUrl);

  // 6. Schema.org JSON-LD Structured Data
  const existingJsonLd = document.head.querySelector('script[data-seo="autocraft-jsonld"]');
  if (existingJsonLd) {
    existingJsonLd.remove();
  }

  if (metadata.jsonLd) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'autocraft-jsonld');
    script.textContent = JSON.stringify(metadata.jsonLd);
    document.head.appendChild(script);
  }
}
