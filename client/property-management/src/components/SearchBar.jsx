export default function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="search-bar">
      <span aria-hidden="true">🔍</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <style>{`
        .search-bar {
          display: flex; align-items: center; gap: 8px;
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-sm); padding: 0 12px; min-width: 220px;
        }
        .search-bar input {
          border: none; outline: none; padding: 10px 0; font-size: 14px;
          background: transparent; width: 100%; color: var(--color-text);
        }
      `}</style>
    </div>
  );
}