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
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="alert alert-error">
          {error.status ? <strong>Error {error.status}: </strong> : null}
          {error.message}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Nama warung *</label>
        <input id="name" value={values.name} onChange={handleChange('name')} />
        {error?.fieldErrors.name && <span className="field-error">{error.fieldErrors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Kategori</label>
        <input id="category" value={values.category} onChange={handleChange('category')} />
        {error?.fieldErrors.category && <span className="field-error">{error.fieldErrors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="location">Lokasi</label>
        <input id="location" value={values.location} onChange={handleChange('location')} />
        {error?.fieldErrors.location && <span className="field-error">{error.fieldErrors.location}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Deskripsi</label>
        <textarea
          id="description"
          rows={4}
          value={values.description}
          onChange={handleChange('description')}
        />
        {error?.fieldErrors.description && (
          <span className="field-error">{error.fieldErrors.description}</span>
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