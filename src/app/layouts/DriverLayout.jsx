import { Outlet } from 'react-router-dom';
import { DriverTopBar } from '@/shared/components';

export function DriverLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <DriverTopBar />
      <main className="flex-1 p-4 sm:p-6">
        <div className="page-enter mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
