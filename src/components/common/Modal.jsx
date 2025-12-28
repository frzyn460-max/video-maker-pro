import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

/**
 * کامپوننت Modal حرفه‌ای
 */
const Modal = ({
  isOpen = false,
  onClose,
  children,
  title,
  size = 'md', // sm, md, lg, xl, full
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = '',
}) => {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEsc, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose?.();
    }
  };

  const modalContent = (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-container modal-${size} ${className}`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showCloseButton && (
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="بستن"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// ============================================
// Modal Body
// ============================================
export const ModalBody = ({ children, className = '' }) => {
  return <div className={`modal-body ${className}`}>{children}</div>;
};

// ============================================
// Modal Footer
// ============================================
export const ModalFooter = ({ children, className = '' }) => {
  return <div className={`modal-footer ${className}`}>{children}</div>;
};

// ============================================
// Confirm Modal Hook
// ============================================
export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState({});
  const resolveRef = React.useRef(null);

  const confirm = (options) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setConfig(options);
      setIsOpen(true);
    });
  };

  const handleConfirm = () => {
    resolveRef.current?.(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolveRef.current?.(false);
    setIsOpen(false);
  };

  const ConfirmModal = () => (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={config.title || 'تأیید'}
      size="sm"
    >
      <ModalBody>
        <div className="confirm-modal-content">
          <div className="confirm-modal-icon">
            {config.type === 'danger' ? '⚠️' : '❓'}
          </div>
          <p className="confirm-modal-message">
            {config.message || 'آیا مطمئن هستید؟'}
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex gap-md justify-end">
          <button
            className="btn btn-ghost"
            onClick={handleCancel}
          >
            {config.cancelText || 'لغو'}
          </button>
          <button
            className={`btn ${config.type === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleConfirm}
          >
            {config.confirmText || 'تأیید'}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );

  return { confirm, ConfirmModal };
};

export default Modal;