export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          This Cookie Policy explains how Travel Planner uses cookies and similar technologies to recognize you when you visit our website.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How we use cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <span className="font-semibold">Essential cookies:</span> These are cookies that are required for the operation of our website.
            </li>
            <li>
              <span className="font-semibold">Analytical/performance cookies:</span> They allow us to recognize and count the number of visitors and see how visitors move around our website.
            </li>
            <li>
              <span className="font-semibold">Functionality cookies:</span> These are used to recognize you when you return to our website.
            </li>
            <li>
              <span className="font-semibold">Targeting cookies:</span> These cookies record your visit to our website, the pages you have visited, and the links you have followed.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Specific cookies we use</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full mt-4">
              <thead>
                <tr className="bg-base-200">
                  <th className="px-4 py-2 text-left">Cookie Name</th>
                  <th className="px-4 py-2 text-left">Purpose</th>
                  <th className="px-4 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">session_id</td>
                  <td className="border px-4 py-2">Maintains your session</td>
                  <td className="border px-4 py-2">Session</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">preferences</td>
                  <td className="border px-4 py-2">Stores your preferences</td>
                  <td className="border px-4 py-2">1 year</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">analytics</td>
                  <td className="border px-4 py-2">Tracks anonymous usage</td>
                  <td className="border px-4 py-2">2 years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to control cookies</h2>
          <p>
            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">More Information</h2>
          <p>
            If you have any questions about our use of cookies or other technologies, please <a href="/contact" className="text-primary">contact us</a>.
          </p>
        </section>
      </div>
    </div>
  );
} 