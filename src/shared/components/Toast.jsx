import { useCallback, useMemo, useState } from 'react';
import { Alert } from '@/shared/components/Alert';
import { ToastContext } from '@/shared/components/useToast';
import { cn } from '@/lib/utils';

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'info', duration = 4000 }) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, title, description, variant }]);
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed end-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <Alert
              variant={item.variant}
              title={item.title}
              onClose={() => dismiss(item.id)}
              className="shadow-card-hover"
            >
              {item.description}
            </Alert>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}


export function Toast({ title, description, variant = 'info', className }) {
  return (
    <Alert variant={variant} title={title} className={cn('shadow-card', className)}>
      {description}
    </Alert>
  );
}
