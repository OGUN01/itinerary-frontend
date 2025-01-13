export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Welcome to Travel Planner, your AI-powered travel companion. We're dedicated to making travel planning effortless and enjoyable.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p>
          Our mission is to revolutionize travel planning by combining artificial intelligence with human expertise to create personalized, memorable travel experiences for everyone.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What Sets Us Apart</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>AI-Powered Recommendations: Tailored suggestions based on your preferences</li>
          <li>Real-Time Updates: Live weather and event information</li>
          <li>Smart Itineraries: Optimized schedules that maximize your time</li>
          <li>Local Insights: Access to local knowledge and hidden gems</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
        <p>
          We're a passionate team of travelers, technologists, and dreamers working together to make travel planning more accessible and enjoyable for everyone.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          Have questions or suggestions? We'd love to hear from you. Reach out to us at <a href="mailto:contact@travelplanner.com" className="text-primary">contact@travelplanner.com</a>
        </p>
      </div>
    </div>
  );
} 