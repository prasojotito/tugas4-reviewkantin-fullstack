import type { Stall, User } from '../types';

export const canCreateStall = (user: User | null): boolean =>
  user?.role === 'admin' || user?.role === 'owner';

// Admin boleh mengubah semua warung, owner hanya warung miliknya.
export const canEditStall = (user: User | null, stall: Stall): boolean =>
  !!user && (user.role === 'admin' || (user.role === 'owner' && stall.ownerId === user.id));

export const canDeleteStall = (user: User | null): boolean => user?.role === 'admin';