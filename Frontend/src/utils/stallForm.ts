import type { StallPayload } from '../api/stalls';
import type { Stall } from '../types';

export interface StallFormValues {
  name: string;
  category: string;
  location: string;
  description: string;
}

export const emptyStallValues: StallFormValues = {
  name: '',
  category: '',
  location: '',
  description: '',
};

export const valuesFromStall = (stall: Stall): StallFormValues => ({
  name: stall.name,
  category: stall.category ?? '',
  location: stall.location ?? '',
  description: stall.description ?? '',
});

export const toCreatePayload = (values: StallFormValues): StallPayload => ({
  name: values.name,
  category: values.category || undefined,
  location: values.location || undefined,
  description: values.description || undefined,
});

export const toUpdatePayload = (values: StallFormValues): Partial<StallPayload> => ({
  name: values.name,
  category: values.category,
  location: values.location,
  description: values.description,
});
