export const SITE_CONFIG = {
  name: 'MangaLegends',
  url: 'https://mangalegends.de5.net',
  description: 'Read manga online for free with MangaLegends. Discover trending, popular, and latest manga chapters with a modern, fast reader experience.',
  ogImage: 'https://mangalegends.de5.net/og-default.png',
  googleVerification: 'zGP3Ct0SKInYtQcJWy5VeBhhoEiK7SYwZaEBVIyra_Y',
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_CONFIG.url}${item.url}`,
    })),
  }
}

export function generateWebPageJsonLd(params: {
  name: string
  description: string
  url: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: params.name,
    description: params.description,
    url: params.url.startsWith('http') ? params.url : `${SITE_CONFIG.url}${params.url}`,
    ...(params.image ? { image: params.image } : {}),
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  }
}
