import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/shared/components/FilterPanel';

/**
 * @template T
 * @param {{
 *   columns: { key: string, label: string, render?: (row: T) => React.ReactNode, sortable?: boolean }[],
 *   data: T[],
 *   loading?: boolean,
 *   searchable?: boolean,
 *   searchPlaceholder?: string,
 *   pageSize?: number,
 *   emptyTitle?: string,
 *   emptyDescription?: string,
 *   emptyAction?: React.ReactNode,
 *   mobileCardRender?: (row: T) => React.ReactNode,
 *   className?: string,
 * }} props
 */
export function DataTable({
  columns,
  data,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search...',
  pageSize = 10,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your filters or search query.',
  emptyAction,
  mobileCardRender,
  className,
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((row) =>
        columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(q)),
      );
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (av === bv) return 0;
        const cmp = av > bv ? 1 : -1;
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return rows;
  }, [columns, data, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key, sortable) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {searchable ? (
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="ps-9"
          />
        </div>
      ) : null}

      {pageData.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-border-brand bg-surface md:block">
            <table className="w-full text-sm">
              <thead className="bg-primary-pale text-left text-text-secondary">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 font-medium">
                      <button
                        type="button"
                        className={cn(
                          'inline-flex items-center gap-1',
                          col.sortable && 'cursor-pointer hover:text-primary',
                        )}
                        onClick={() => toggleSort(col.key, col.sortable)}
                      >
                        {col.label}
                        {sortKey === col.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : null}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.map((row, rowIndex) => (
                  <tr
                    key={row.id || rowIndex}
                    className="border-t border-border-brand transition-colors hover:bg-primary-pale/50"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-text-primary">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {pageData.map((row, rowIndex) => (
              <div
                key={row.id || rowIndex}
                className="rounded-xl border border-border-brand bg-surface p-4 shadow-soft"
              >
                {mobileCardRender ? mobileCardRender(row) : (
                  columns.map((col) => (
                    <div key={col.key} className="flex justify-between gap-4 py-1 text-sm">
                      <span className="text-text-muted">{col.label}</span>
                      <span className="font-medium text-text-primary">
                        {col.render ? col.render(row) : row[col.key]}
                      </span>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {filtered.length > pageSize ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of{' '}
            {filtered.length}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
