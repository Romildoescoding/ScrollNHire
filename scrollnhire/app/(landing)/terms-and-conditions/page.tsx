export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-foreground px-6 py-16 pt-32">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Terms & Conditions
          </h1>
        </div>

        {/* Sections */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="text-muted-foreground">
            By accessing or using ScrollnHire, you agree to these Terms.
            ScrollnHire is a platform designed to connect students and
            recruiters through real work, projects, and interactions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Accounts</h2>
          <p className="text-muted-foreground">
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. We are not liable for any loss or damage resulting from
            unauthorized access due to your failure to protect your credentials.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Acceptable Use</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>No illegal or harmful activities</li>
            <li>No false, misleading, or plagiarized content</li>
            <li>No harassment, abuse, or spam</li>
            <li>No unauthorized access to systems or data</li>
          </ul>
          <p className="text-muted-foreground">
            We reserve the right to remove content or restrict access if these
            rules are violated.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Content</h2>
          <p className="text-muted-foreground">
            You retain ownership of the content you upload. By posting content,
            you grant ScrollnHire a non-exclusive, worldwide license to use,
            display, and distribute it on the platform. You are responsible for
            ensuring that you have the rights to all content you upload.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Platform Usage</h2>
          <p className="text-muted-foreground">
            ScrollnHire acts as a facilitator between students and recruiters.
            We do not guarantee hiring outcomes, job offers, or candidate
            suitability.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Termination</h2>
          <p className="text-muted-foreground">
            We may suspend or terminate your account at our discretion if you
            violate these Terms or engage in activity that harms the platform or
            its users.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Liability</h2>
          <p className="text-muted-foreground">
            ScrollnHire is provided “as is” without warranties of any kind. We
            are not responsible for user interactions, hiring outcomes, or any
            loss of data, opportunities, or revenue resulting from the use of
            the platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms are governed by the laws of India.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Contact</h2>
          <p className="text-muted-foreground">
            Reach us at{" "}
            <span className="font-medium text-foreground">
              romil4business@gmail.com
            </span>
          </p>
        </section>
      </div>
    </main>
  );
}
