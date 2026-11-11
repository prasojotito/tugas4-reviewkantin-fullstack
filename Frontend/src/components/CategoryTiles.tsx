import { categoryEmoji } from '../utils/stallVisual';

interface Props {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}

export function CategoryTiles({ categories, active, onSelect }: Props) {
  if (categories.length === 0) return null;

  return (
    <div className="category-row">
      <button
        type="button"
        className={`category-tile ${active === '' ? 'active' : ''}`}
        onClick={() => onSelect('')}
      >
        <span className="category-icon" aria-hidden="true">
          🍽️
        </span>
        <span>Semua</span>
      </button>
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          className={`category-tile ${active === c ? 'active' : ''}`}
          onClick={() => onSelect(c)}
        >
          <span className="category-icon" aria-hidden="true">
            {categoryEmoji(c)}
          </span>
          <span>{c}</span>
        </button>
      ))}
    </div>
  );
}