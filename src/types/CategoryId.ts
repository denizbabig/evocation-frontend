// frontend
export type CategoryId =
  | 'TRAVEL'
  | 'FOOD'
  | 'ADVENTURE'
  | 'SPORT'
  | 'CULTURE'
  | 'SHOPPING'
  | 'NATURE'

export const CATEGORY_OPTIONS: { id: CategoryId; label: string }[] = [
  { id: 'TRAVEL', label: 'Reise' },
  { id: 'FOOD', label: 'Essen' },
  { id: 'ADVENTURE', label: 'Abenteuer' },
  { id: 'SPORT', label: 'Sport' },
  { id: 'CULTURE', label: 'Sightseeing/Kultur' },
  { id: 'SHOPPING', label: 'Shopping' },
  { id: 'NATURE', label: 'Natur' },
]
