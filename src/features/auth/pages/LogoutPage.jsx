import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/api/auth.api';

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    logout().finally(() => navigate('/', { replace: true }));
  }, [navigate]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-text-secondary">
      Signing you out...
    </div>
  );
}
