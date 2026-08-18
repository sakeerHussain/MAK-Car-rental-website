import { Construction } from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';

export function PlaceholderPage({ title, description, breadcrumbs = [] }) {
  return (
    <div className="page-enter mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {breadcrumbs.length > 0 ? <Breadcrumbs items={breadcrumbs} /> : null}
      <Card>
        <CardContent className="flex flex-col items-center px-6 py-16 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <Construction className="size-8" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
          <p className="mt-2 max-w-lg text-sm text-text-secondary">
            {description ||
              'This screen is wired into the route tree and will be built in a later phase.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
