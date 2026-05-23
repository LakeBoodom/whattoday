import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://whattoday.org';
  return [
    { url: `${base}/today`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/week`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/year`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
  ];
}
