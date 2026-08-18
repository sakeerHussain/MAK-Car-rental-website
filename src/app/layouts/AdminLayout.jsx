import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar, AdminTopBar } from '@/shared/components';
import { cn } from '@/lib/utils';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {sidebarOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-primary-deep/40 lg:hidden"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 start-0 z-50 lg:hidden">
            <AdminSidebar />
          </div>
        </>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className={cn('flex-1 overflow-auto p-4 sm:p-6 lg:p-8')}>
          <div className="page-enter mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
