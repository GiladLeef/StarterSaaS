export default function PrivacyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <div className="prose prose-sm md:prose dark:prose-invert">
          <p className="lead">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include your name, email address, and other contact information.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to develop new services and features.
          </p>

          <h2>3. Information Sharing</h2>
          <p>
            We do not share your personal information with third parties outside of Platform except in the following cases:
          </p>
          <ul>
            <li>With your consent</li>
            <li>For legal reasons</li>
            <li>With our service providers</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We use reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
          </p>

          <h2>5. Your Choices</h2>
          <p>
            You can access, update, or delete your account information at any time by logging into your account settings.
          </p>

          <h2>6. Children's Privacy</h2>
          <p>
            Our services are not directed to children under 13, and we do not knowingly collect personal information from children under 13.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@example.com.
          </p>
        </div>
      </div>
    </div>
  );
} 