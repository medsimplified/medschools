/**
 * Utility to generate JSON-LD schema markup for courses
 */
export function generateCourseSchema(course: {
  title: string;
  description?: string;
  image?: string;
  url: string;
  instructor?: string;
  price?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description || course.title,
    image: course.image,
    url: course.url,
    ...(course.instructor && { instructor: { '@type': 'Person', name: course.instructor } }),
    ...(course.price && {
      offers: {
        '@type': 'Offer',
        price: course.price,
        priceCurrency: 'USD',
      },
    }),
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MedSchool Simplified',
    url: process.env.NEXTAUTH_URL || 'https://medschoolsimplified.org',
    description: 'Online medical education platform offering structured courses, MCQs, and study support for aspiring physicians.',
    logo: `${process.env.NEXTAUTH_URL || 'https://medschoolsimplified.org'}/logo.png`,
    sameAs: [
      'https://www.facebook.com/medschoolsimplified',
      'https://www.twitter.com/medschoolsimplified',
      'https://www.instagram.com/medschoolsimplified',
    ],
  };
}
