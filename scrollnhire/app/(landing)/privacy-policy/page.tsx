export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-foreground px-6 py-16 pt-32">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Privacy Policy
          </h1>
        </div>

        {/* Sections */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="text-muted-foreground">
            Welcome to ScrollnHire. We are committed to protecting your privacy
            and ensuring that your personal data is handled securely and
            responsibly while you showcase work, discover talent, and interact
            on our platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Name, email address, and account details</li>
            <li>Profile information, reels, and project content</li>
            <li>Messages and interactions with other users</li>
            <li>Usage data such as views, engagement, and activity</li>
            <li>Technical data including IP address, device, and browser</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. How We Use Your Data</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Enable connections between students and recruiters</li>
            <li>Personalize your feed and recommendations</li>
            <li>Support messaging and hiring workflows</li>
            <li>Improve platform performance and features</li>
            <li>Ensure security and prevent fraud or misuse</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Data Sharing</h2>
          <p className="text-muted-foreground">
            We do not sell your personal data. We may share limited information
            with trusted third-party service providers (such as hosting,
            analytics, or authentication services) only as necessary to operate
            the platform or comply with legal obligations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Data Storage & Security</h2>
          <p className="text-muted-foreground">
            Your data is stored securely using industry-standard practices. We
            implement appropriate safeguards to protect against unauthorized
            access, loss, or misuse. However, no system can be completely
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Access and review your personal data</li>
            <li>Update or correct your profile information</li>
            <li>Request deletion of your account and associated data</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Cookies & Tracking</h2>
          <p className="text-muted-foreground">
            We use cookies and similar technologies to enhance your experience,
            analyze usage, and improve our services. You can manage or disable
            cookies through your browser settings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. Continued use
            of ScrollnHire after changes indicates your acceptance of the
            updated policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Contact</h2>
          <p className="text-muted-foreground">
            Questions? Reach us at{" "}
            <span className="font-medium text-foreground">
              romil4business@gmail.com
            </span>
          </p>
        </section>
      </div>
    </main>
  );
}
