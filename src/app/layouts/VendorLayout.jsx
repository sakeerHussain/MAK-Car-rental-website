import { Outlet } from 'react-router-dom';
import { VendorTopBar } from '@/shared/components';

export function VendorLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <VendorTopBar />
      <main className="flex-1 p-4 sm:p-6">
        <div className="page-enter mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
