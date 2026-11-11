import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stallsApi } from '../api/stalls';
import { parseApiError, type ParsedError } from '../api/errors';
import { StallForm } from '../components/StallForm';
import { emptyStallValues, toCreatePayload, type StallFormValues } from '../utils/stallForm';

export function StallCreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ParsedError | null>(null);

  const handleSubmit = async (values: StallFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const stall = await stallsApi.create(toCreatePayload(values));
      navigate(`/stalls/${stall.id}`, { state: { message: 'Warung berhasil ditambahkan.' } });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card form-card form-wide">
      <h1>Tambah Warung</h1>
      <StallForm
        initialValues={emptyStallValues}
        submitLabel="Simpan"
        submitting={submitting}
        error={error}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </div>
  );
}