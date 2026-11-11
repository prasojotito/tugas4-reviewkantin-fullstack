import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { ParsedError } from '../api/errors';
import type { StallFormValues } from '../utils/stallForm';

interface Props {
  initialValues: StallFormValues;
  submitLabel: string;
  submitting: boolean;
  error: ParsedError | null;
  onSubmit: (values: StallFormValues) => void;
  onCancel: () => void;
}

export function StallForm({ initialValues, submitLabel, submitting, error, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<StallFormValues>(initialValues);

  const handleChange =
    (field: keyof StallFormValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form className="auth-form stall-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="alert alert-error" role="alert">
          {error.status ? <strong>Error {error.status}: </strong> : null}
          {error.message}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Nama warung *</label>
        <input
          id="name"
          placeholder="Contoh: Warung Bu Tini"
          value={values.name}
          onChange={handleChange('name')}
          aria-invalid={Boolean(error?.fieldErrors.name)}
          aria-describedby={error?.fieldErrors.name ? 'stall-name-error' : undefined}
        />
        {error?.fieldErrors.name && (
          <span id="stall-name-error" className="field-error">
            {error.fieldErrors.name}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category">Kategori</label>
        <input
          id="category"
          placeholder="Contoh: Makanan, Minuman"
          value={values.category}
          onChange={handleChange('category')}
          aria-invalid={Boolean(error?.fieldErrors.category)}
          aria-describedby={error?.fieldErrors.category ? 'stall-category-error' : undefined}
        />
        {error?.fieldErrors.category && (
          <span id="stall-category-error" className="field-error">
            {error.fieldErrors.category}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="location">Lokasi</label>
        <input
          id="location"
          placeholder="Contoh: Kantin Fakultas Teknik"
          value={values.location}
          onChange={handleChange('location')}
          aria-invalid={Boolean(error?.fieldErrors.location)}
          aria-describedby={error?.fieldErrors.location ? 'stall-location-error' : undefined}
        />
        {error?.fieldErrors.location && (
          <span id="stall-location-error" className="field-error">
            {error.fieldErrors.location}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Deskripsi</label>
        <textarea
          id="description"
          rows={4}
          placeholder="Ceritakan menu andalan atau ciri khas warung..."
          value={values.description}
          onChange={handleChange('description')}
          aria-invalid={Boolean(error?.fieldErrors.description)}
          aria-describedby={error?.fieldErrors.description ? 'stall-description-error' : undefined}
        />
        {error?.fieldErrors.description && (
          <span id="stall-description-error" className="field-error">
            {error.fieldErrors.description}
          </span>
        )}
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Menyimpan...' : submitLabel}
        </button>
        <button className="btn btn-outline" type="button" onClick={onCancel} disabled={submitting}>
          Batal
        </button>
      </div>
    </form>
  );
}