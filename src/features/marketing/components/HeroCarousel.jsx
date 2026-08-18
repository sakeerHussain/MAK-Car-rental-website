import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function HeroCarousel({ banners = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[index];

  return (
    <section className="relative overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/7] min-h-[320px] sm:min-h-[420px]">
        {banners.map((item, i) => (
          <img
            key={item.id}
            src={item.imageUrl}
            alt=""
            className={cn(
              'absolute inset-0 size-full object-cover transition-opacity duration-700',
              i === index ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/80 via-primary-deep/50 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6 sm:px-10 lg:px-14">
          <div className="max-w-xl text-white">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {banner.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
              {banner.subtitle}
            </p>
            {banner.ctaLink ? (
              <Button className="mt-6" asChild>
                <Link to={banner.ctaLink}>{banner.ctaLabel || 'Learn More'}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {banners.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}
            className="absolute start-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % banners.length)}
            className="absolute end-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
            aria-label="Next slide"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  'size-2 rounded-full transition-all',
                  i === index ? 'w-6 bg-white' : 'bg-white/50',
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
