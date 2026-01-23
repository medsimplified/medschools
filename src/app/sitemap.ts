import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://bhanuprakash.com';

  const staticRoutes = [
    '',
    '/about-us',
    '/contact',
    '/courses',
    '/blog',
    '/pricing',
    '/privacy',
    '/instructor-login',
    '/instructor-registration',
    '/login',
    '/registration',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return staticRoutes;
}
