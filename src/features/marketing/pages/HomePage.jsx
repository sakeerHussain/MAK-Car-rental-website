import { Link } from 'react-router-dom';
import { Shield, Clock, Headphones, MapPin } from 'lucide-react';
import { useHomeData } from '@/api/hooks/useHome';
import { useConfig } from '@/api/hooks/useConfig';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { VehicleCard } from '@/shared/components';
import { HeroCarousel } from '@/features/marketing/components/HeroCarousel';
import { HomeSearchWidget } from '@/features/marketing/components/HomeSearchWidget';
import { StarRating } from '@/shared/components';

const FEATURES = [
  { icon: Shield, title: 'Fully Insured Fleet', description: 'Comprehensive coverage on every vehicle' },
  { icon: Clock, title: '24/7 Availability', description: 'Spot bookings and airport pickups anytime' },
  { icon: Headphones, title: 'Dedicated Support', description: 'Personal account managers for corporate clients' },
  { icon: MapPin, title: 'UAE-Wide Coverage', description: 'Dubai, Abu Dhabi, Sharjah and beyond' },
];

export default function HomePage() {
  const { data: home, isLoading, isError } = useHomeData();
  const { data: config } = useConfig();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-[420px] w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-text-secondary">Unable to load homepage. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-16">
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <HeroCarousel banners={home.banners} />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeSearchWidget
          locations={config?.locations || []}
          minDailyRate={home.minDailyRate}
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Featured Fleet</p>
            <h2 className="text-2xl font-bold">Popular vehicles this week</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/cars">View all</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {home.featuredCars.map((car) => (
            <VehicleCard
              key={car.id}
              car={car}
              priceLabel={`From AED ${car.dailyRate}/day`}
            />
          ))}
        </div>
      </section>

      <section className="bg-primary-pale py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl bg-surface p-6 shadow-soft">
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold">Current promotions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {home.promotions.map((promo) => (
            <div
              key={promo.id}
              className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary-pale to-surface p-5"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{promo.code}</p>
              <h3 className="mt-1 font-semibold">{promo.label}</h3>
              <p className="mt-1 text-sm text-text-secondary">{promo.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold">What our clients say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {home.testimonials.map((t) => (
            <blockquote
              key={t.id}
              className="rounded-xl border border-border-brand bg-surface p-6 shadow-soft"
            >
              <StarRating value={t.rating} />
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4">
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-text-muted">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold">Pickup locations</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(config?.locations || []).map((loc) => (
            <div
              key={loc.value}
              className="flex items-center gap-3 rounded-xl border border-border-brand bg-surface px-4 py-3"
            >
              <MapPin className="size-4 shrink-0 text-primary" />
              <span className="text-sm">{loc.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 rounded-2xl gradient-primary p-8 text-white lg:grid-cols-2 lg:p-12">
          <div>
            <h2 className="text-2xl font-bold text-white">Stay updated</h2>
            <p className="mt-2 text-white/85">
              Get exclusive offers and fleet updates delivered to your inbox.
            </p>
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="h-10 flex-1 rounded-lg border-0 px-3 text-text-primary"
              aria-label="Email for newsletter"
            />
            <Button type="submit" variant="secondary">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-border-brand bg-surface p-8 sm:flex-row">
          <div>
            <h2 className="text-xl font-bold">Download the MAK app</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Book on the go, track your rental, and access digital invoices.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">App Store</Button>
            <Button variant="outline">Google Play</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
