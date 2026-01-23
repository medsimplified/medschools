import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Bhanuprakash",
  description: "Learn how we handle your data, cookies, and contact preferences.",
};

export default function PrivacyPage() {
  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-6 text-slate-700">
        We use your data to provide and improve the learning experience. By using this site, you agree to the terms below.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Data we collect</h2>
        <ul className="list-disc list-inside text-slate-700">
          <li>Account info: name, email, and authentication data.</li>
          <li>Course activity: enrollments, progress, and assessments.</li>
          <li>Payments: processed via Razorpay; we do not store full card data.</li>
          <li>Support interactions: messages or tickets you send us.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cookies and analytics</h2>
        <p className="text-slate-700 mb-2">
          Essential cookies keep the site running. Analytics cookies are optional and only set if you accept them in the cookie banner.
        </p>
        <p className="text-slate-700">
          You can change your choice anytime by clearing your browser cookies and revisiting the site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Third parties</h2>
        <ul className="list-disc list-inside text-slate-700">
          <li>Razorpay for payments.</li>
          <li>Email/SMS providers for OTPs and notifications.</li>
          <li>Cloud storage/CDN for media delivery.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your choices</h2>
        <ul className="list-disc list-inside text-slate-700">
          <li>Access, update, or delete your account data by contacting support.</li>
          <li>Opt out of marketing emails via unsubscribe links.</li>
          <li>Control cookies via the banner or your browser settings.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p className="text-slate-700">
          Questions? Reach us at <a className="text-blue-600" href="mailto:support@example.com">support@example.com</a>.
        </p>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
