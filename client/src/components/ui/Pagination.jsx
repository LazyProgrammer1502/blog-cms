export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-12">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        className="px-3 py-2 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed">
        ← Prev
      </button>
      {pages.map((p, i) => p === '...' ? (
        <span key={i} className="px-2 text-gray-400">…</span>
      ) : (
        <button key={p} onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            p === currentPage ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed">
        Next →
      </button>
    </div>
  );
}
