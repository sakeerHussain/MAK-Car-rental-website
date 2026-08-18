import { Link } from 'react-router-dom';
import { Car, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/fleet', label: 'Our Fleet' },
  { to: '/services', label: 'Services' },
  { to: '/operations', label: 'Operations' },
  { to: '/clients', label: 'Clients' },
  { to: '/contact', label: 'Contact' },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-border-brand bg-primary-deep text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">
              <Car className="size-5" />
            </span>
            <span className="text-lg font-bold">MAK International</span>
          </div>
          <p className="text-sm leading-relaxed text-white/75">
            Premium vehicle rental and corporate transport services across the UAE.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {footerLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-white/75 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              Dubai, United Arab Emirates
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              +971 4 000 0000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              info@makinternational.ae
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} MAK International. All rights reserved.
      </div>
    </footer>
  );
}
