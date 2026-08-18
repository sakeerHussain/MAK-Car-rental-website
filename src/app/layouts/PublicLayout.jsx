import { Outlet } from 'react-router-dom';
import { PublicFooter, PublicHeader } from '@/shared/components';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
