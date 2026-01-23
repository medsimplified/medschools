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
    name: 'Bhanuprakash',
    url: process.env.NEXTAUTH_URL || 'https://bhanuprakash.com',
    description: 'Quality education and online courses for your career growth',
    logo: `${process.env.NEXTAUTH_URL || 'https://bhanuprakash.com'}/logo.png`,
    sameAs: [
      'https://www.facebook.com/bhanuprakash',
      'https://www.twitter.com/bhanuprakash',
      'https://www.instagram.com/bhanuprakash',
    ],
  };
}
