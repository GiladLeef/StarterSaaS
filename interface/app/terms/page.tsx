export default function TermsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose prose-sm md:prose dark:prose-invert">
          <p className="lead">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2>1. Introduction</h2>
          <p>
            Welcome to Platform. These Terms of Service govern your use of our website and services.
            By accessing or using our service, you agree to be bound by these Terms.
          </p>
          
          <h2>2. Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate and complete information.
            You are responsible for safeguarding your account and for all activities that occur under your account.
          </p>
          
          <h2>3. User Content</h2>
          <p>
            Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content you post.
          </p>
          
          <h2>4. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.
          </p>
          
          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall Platform, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.
          </p>
          
          <h2>6. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
          </p>
          
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@example.com.
          </p>
        </div>
      </div>
    </div>
  );
} 