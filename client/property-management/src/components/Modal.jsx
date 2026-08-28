import { useEffect } from 'react';

export default function Modal({ title, isOpen, onClose, children, maxWidth = 560 }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal-panel"
        style={{ maxWidth }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(28, 35, 33, 0.45);
          display: flex; align-items: flex-start; justify-content: center;
          padding: 40px 16px; overflow-y: auto;
        }
        .modal-panel {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          width: 100%;
          box-shadow: var(--shadow-lg);
          animation: modal-in 0.14s ease;
        }
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; border-bottom: 1px solid var(--color-border);
        }
        .modal-header h3 { margin: 0; font-size: 19px; }
        .modal-close {
          background: none; border: none; font-size: 16px; color: var(--color-text-muted);
          width: 32px; height: 32px; border-radius: 8px;
        }
        .modal-close:hover { background: var(--color-surface-sunken); }
        .modal-body { padding: 24px; }
      `}</style>
    </div>
  );
}