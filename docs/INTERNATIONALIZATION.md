# Internationalization (i18n) Plan for App Router

Next.js App Router uses a routing-based approach to localization rather than the legacy `i18n` config.

Recommended approach:

1. Locale-aware routing
   - Create route groups for locales: `src/app/(en)/...`, `src/app/(fr)/...`.
   - Use a middleware to detect locale from headers or cookies and rewrite to the proper group.

2. Message catalogs
   - Use a library like `next-intl` or `lingui` for message management.
   - Load messages per locale via server components for optimal performance.

3. Date/number formatting
   - Rely on `Intl.*` built-ins where possible; fall back to libraries only if needed.

4. Content and SEO
   - Add `hreflang` tags with locale alternates.
   - Ensure localized metadata via `generateMetadata()` in each locale group.

5. Accessibility
   - Set `lang` attribute appropriately per locale root layout.

6. Persistence
   - Store user-selected locale in a cookie; read it in `middleware.ts`.

References:
- Next.js App Router i18n: https://nextjs.org/docs/app/building-your-application/routing/internationalization
- next-intl: https://next-intl.dev/docs

This plan keeps builds clean while providing a clear path to multilingual support.
