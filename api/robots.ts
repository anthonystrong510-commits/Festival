function getDomain(req: any): string {
  const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'www.skysevents.online';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return `${proto}://${host}`.replace(/\/+$/, '');
}

export default function handler(req: any, res: any) {
  const domain = getDomain(req);

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');

  const content = `# Robots.txt for ${domain}
# Community Vendor Marketplace & Dating Singles Festival

User-agent: *
Allow: /
Allow: /#events
Allow: /#schedule
Allow: /#vendor-booking
Allow: /#dating-faq
Allow: /sitemap.xml
Allow: /sitemap-dating.xml
Allow: /sitemap_index.xml

# Administrative and checkout areas
Disallow: /kingadmin
Disallow: /kingadmin/
Disallow: /api/
Disallow: /*?invoice=*
Disallow: /*?inv=*
Disallow: /*?checkout=*

# Sitemaps
Sitemap: ${domain}/sitemap_index.xml
Sitemap: ${domain}/sitemap.xml
Sitemap: ${domain}/sitemap-dating.xml
`;

  return res.status(200).send(content);
}
