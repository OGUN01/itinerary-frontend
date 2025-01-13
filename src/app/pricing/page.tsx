export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Pricing</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Basic Plan */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Basic</h2>
            <p className="text-3xl font-bold">$9.99<span className="text-sm font-normal">/month</span></p>
            <ul className="mt-4 space-y-2">
              <li>✓ 3 itineraries per month</li>
              <li>✓ Basic recommendations</li>
              <li>✓ Email support</li>
            </ul>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Pro</h2>
            <p className="text-3xl font-bold">$19.99<span className="text-sm font-normal">/month</span></p>
            <ul className="mt-4 space-y-2">
              <li>✓ Unlimited itineraries</li>
              <li>✓ Advanced recommendations</li>
              <li>✓ Priority support</li>
              <li>✓ Custom preferences</li>
            </ul>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-secondary">Get Started</button>
            </div>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Enterprise</h2>
            <p className="text-3xl font-bold">Custom</p>
            <ul className="mt-4 space-y-2">
              <li>✓ Custom solutions</li>
              <li>✓ API access</li>
              <li>✓ Dedicated support</li>
              <li>✓ Custom integrations</li>
            </ul>
            <div className="card-actions justify-end mt-4">
              <button className="btn">Contact Sales</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 