export default function Modal({ show, onClose, children, maxWidth }) {
  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={maxWidth ? { maxWidth } : {}}>
        {children}
      </div>
    </div>
  );
}
