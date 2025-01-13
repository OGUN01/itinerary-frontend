import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content">
      <div>
        <span className="footer-title">Services</span>
        <Link href="/trip-planner" className="link link-hover">
          Trip Planning
        </Link>
        <Link href="/itineraries" className="link link-hover">
          My Itineraries
        </Link>
        <Link href="/pricing" className="link link-hover">
          Pricing
        </Link>
      </div>
      <div>
        <span className="footer-title">Company</span>
        <Link href="/about" className="link link-hover">
          About us
        </Link>
        <Link href="/contact" className="link link-hover">
          Contact
        </Link>
        <Link href="/blog" className="link link-hover">
          Blog
        </Link>
      </div>
      <div>
        <span className="footer-title">Legal</span>
        <Link href="/terms" className="link link-hover">
          Terms of use
        </Link>
        <Link href="/privacy" className="link link-hover">
          Privacy policy
        </Link>
        <Link href="/cookie" className="link link-hover">
          Cookie policy
        </Link>
      </div>
      <div>
        <span className="footer-title">Newsletter</span>
        <div className="form-control w-80">
          <label className="label">
            <span className="label-text">Enter your email address</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="username@site.com"
              className="input input-bordered w-full pr-16"
            />
            <button className="btn btn-primary absolute top-0 right-0 rounded-l-none">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}; 