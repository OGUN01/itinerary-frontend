export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Your privacy is important to us. It is Travel Planner's policy to respect your privacy regarding any information we may collect from you across our website.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Basic account information (name, email)</li>
            <li>Travel preferences and history</li>
            <li>Usage data and analytics</li>
            <li>Device and browser information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p>We use the information we collect in various ways, including to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Storage</h2>
          <p>
            We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
          <p>
            We use cookies to store information about your preferences and the pages you visit. This helps us understand how we can improve our website to better serve you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
          <p>
            We may employ third-party companies and individuals due to the following reasons:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>To facilitate our Service</li>
            <li>To provide the Service on our behalf</li>
            <li>To perform Service-related services</li>
            <li>To assist us in analyzing how our Service is used</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Access your personal data</li>
            <li>Correct any mistakes in your information</li>
            <li>Request deletion of your information</li>
            <li>Object to our use of your information</li>
            <li>Export your information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about our privacy policy, please <a href="/contact" className="text-primary">contact us</a>.
          </p>
        </section>
      </div>
    </div>
  );
} 