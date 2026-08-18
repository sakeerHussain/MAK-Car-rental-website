import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { downloadVendorSettlementExcel } from '@/api/vendor.api';
import { Button } from '@/components/ui/button';
import { Alert } from '@/shared/components';

export default function VendorSettlementExcelPage() {
  const { id } = useParams();
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    downloadVendorSettlementExcel(id)
      .then(() => setDone(true))
      .catch((err) => setError(err.message || 'Download failed'));
  }, [id]);

  if (error) return <Alert variant="danger" title={error} />;

  return (
    <div className="space-y-4 py-8 text-center">
      <p className="text-text-secondary">
        {done ? 'Your Excel file should have downloaded.' : 'Preparing download...'}
      </p>
      <Button variant="outline" asChild>
        <Link to="/vendor/settlements">Back to settlements</Link>
      </Button>
    </div>
  );
}
