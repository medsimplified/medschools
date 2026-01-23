'use client';

import HeaderSeven from '@/layouts/headers/HeaderSeven';
import FooterTwo from '@/layouts/footers/FooterTwo';
import BreadcrumbOne from '@/components/common/breadcrumb/BreadcrumbOne';
import RegistrationArea from '@/components/inner-pages/registration/RegistrationArea';

export default function RegistrationPage() {
  return (
    <>
      <HeaderSeven />
      <main className="main-area fix">
        <BreadcrumbOne title="Student SignUp" sub_title="SignUp" />
        <RegistrationArea />
      </main>
      {/* <FooterTwo /> */}
    </>
  );
}
