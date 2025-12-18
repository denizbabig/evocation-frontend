export type CategoryId = 'SIGHT' | 'FOOD' | 'ACCOMMODATION' | 'NATURE' | 'SHOPPING' | 'OTHER';

export const CATEGORY_OPTIONS: { id: CategoryId; label: string }[] = [
  { id: 'SIGHT', label: 'Sight' },
  { id: 'FOOD',  label: 'Essen' },
  { id: 'ACCOMMODATION', label: 'Unterkunft' },
  { id: 'NATURE', label: 'Natur' },
  { id: 'SHOPPING', label: 'Shopping' },
  { id: 'OTHER', label: 'Sonstiges' },
];
