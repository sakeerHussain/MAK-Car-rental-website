import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Users, Settings2, Fuel, Calendar } from 'lucide-react';
import { useCar } from '@/api/hooks/useCars';
import { useCarReviews, useSubmitReview } from '@/api/hooks/useReviews';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  Breadcrumbs,
  CurrencyDisplay,
  StarRating,
} from '@/shared/components';
import { estimateCarPrice, formatDate, getRentalDays } from '@/shared/utils/rental';
import { cn } from '@/lib/utils';

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  const pickup = searchParams.get('pickup') || '';
  const ret = searchParams.get('ret') || '';

  const { data: car, isLoading, isError } = useCar(id);
  const { data: reviewData } = useCarReviews(id);
  const submitReview = useSubmitReview(id);

  const [activeImage, setActiveImage] = useState(0);
  const [localPickup, setLocalPickup] = useState(pickup);
  const [localReturn, setLocalReturn] = useState(ret);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  const days = getRentalDays(localPickup, localReturn);
  const estimate = car && days > 0 ? estimateCarPrice(car, days, 'DAY') : null;

  const images = car?.images?.length ? car.images : car?.imageUrl ? [car.imageUrl] : [];

  const handleBook = (withDriver) => {
    const params = new URLSearchParams();
    if (localPickup) params.set('pickup', localPickup);
    if (localReturn) params.set('ret', localReturn);
    if (withDriver) params.set('withDriver', 'true');

    if (!accessToken || user?.role !== 'CUSTOMER') {
      navigate('/login', {
        state: { from: { pathname: `/cars/${id}/book`, search: `?${params.toString()}` } },
      });
      return;
    }
    navigate(`/cars/${id}/book?${params.toString()}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    try {
      await submitReview.mutateAsync({
        carId: id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Alert variant="danger" title="Vehicle not found" />
        <Button className="mt-4" asChild>
          <Link to="/cars">Back to fleet</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Fleet', to: '/cars' },
          { label: `${car.make} ${car.model}` },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl bg-primary-pale">
            <img
              src={images[activeImage]}
              alt={`${car.make} ${car.model}`}
              className="aspect-[16/10] w-full object-cover"
            />
            {images.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto p-3">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      'size-16 shrink-0 overflow-hidden rounded-lg border-2',
                      i === activeImage ? 'border-primary' : 'border-transparent',
                    )}
                  >
                    <img src={img} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold">
                  {car.make} {car.model}
                </h1>
                <p className="text-text-secondary">{car.year} · {car.registration}</p>
              </div>
              <Badge variant={car.available ? 'success' : 'warning'}>
                {car.available ? 'Available' : 'Unavailable'}
              </Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Users, label: `${car.seats} seats` },
                { icon: Settings2, label: car.transmission },
                { icon: Fuel, label: car.fuel },
                { icon: Calendar, label: car.type },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg bg-primary-pale px-3 py-2 text-sm"
                >
                  <Icon className="size-4 text-primary" />
                  {label}
                </div>
              ))}
            </div>

            {car.featureTags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {car.featureTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary-deep"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Rates</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Hourly', value: car.hourlyRate },
                { label: 'Daily', value: car.dailyRate },
                { label: 'Monthly', value: car.monthlyRate },
              ].map((rate) => (
                <Card key={rate.label}>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs uppercase tracking-wide text-text-muted">{rate.label}</p>
                    <p className="mt-1 tabular-nums text-xl font-bold text-primary">
                      AED {rate.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Reviews</h2>
              {reviewData ? (
                <div className="flex items-center gap-2 text-sm">
                  <StarRating value={reviewData.avgRating} />
                  <span className="text-text-secondary">
                    {reviewData.avgRating.toFixed(1)} ({reviewData.count} reviews)
                  </span>
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              {reviewData?.reviews?.length ? (
                reviewData.reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-border-brand p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{review.customerName}</p>
                      <StarRating value={review.rating} size="sm" />
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">{review.comment}</p>
                    <p className="mt-2 text-xs text-text-muted">{formatDate(review.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-muted">No reviews yet. Be the first to review!</p>
              )}
            </div>

            {user?.role === 'CUSTOMER' ? (
              <form onSubmit={handleReviewSubmit} className="mt-6 space-y-3 rounded-xl border border-border-brand p-4">
                <h3 className="font-medium">Write a review</h3>
                {reviewError ? <Alert variant="danger" title={reviewError} /> : null}
                <div>
                  <Label>Your rating</Label>
                  <StarRating value={reviewRating} onChange={setReviewRating} className="mt-1" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="review-comment">Comment</Label>
                  <Textarea
                    id="review-comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    minLength={10}
                  />
                </div>
                <Button type="submit" disabled={submitReview.isPending}>
                  {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            ) : (
              <p className="mt-4 text-sm text-text-muted">
                <Link to="/login" className="text-primary hover:underline">Sign in</Link> to write a review.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="shadow-card-hover">
            <CardContent className="space-y-4 p-5">
              <h2 className="font-semibold">Check availability</h2>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="detail-pickup">Pickup</Label>
                  <Input
                    id="detail-pickup"
                    type="datetime-local"
                    value={localPickup}
                    onChange={(e) => setLocalPickup(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="detail-return">Return</Label>
                  <Input
                    id="detail-return"
                    type="datetime-local"
                    value={localReturn}
                    min={localPickup || undefined}
                    onChange={(e) => setLocalReturn(e.target.value)}
                  />
                </div>
              </div>

              {estimate ? (
                <div className="rounded-lg bg-primary-pale p-3">
                  <p className="text-xs text-text-muted">{days} day rental estimate</p>
                  <CurrencyDisplay amount={estimate} className="text-2xl text-primary-deep" />
                </div>
              ) : (
                <p className="text-sm text-text-muted">Select dates for a live estimate</p>
              )}

              <Button
                className="w-full"
                onClick={() => handleBook(false)}
                disabled={car.status !== 'ACTIVE' || !car.available}
              >
                Book Self-Drive
              </Button>
              {car.type !== 'BIKE' ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleBook(true)}
                  disabled={car.status !== 'ACTIVE' || !car.available}
                >
                  Book With Driver
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
