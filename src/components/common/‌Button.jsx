import React from 'react';
import './Button.css';

/**
 * کامپوننت دکمه با طراحی مدرن و responsive
 * 
 * @param {string} variant - نوع دکمه: primary, secondary, outline, ghost, danger
 * @param {string} size - اندازه: sm, md, lg
 * @param {boolean} fullWidth - عرض کامل
 * @param {boolean} loading - وضعیت بارگذاری
 * @param {boolean} disabled - غیرفعال
 * @param {node} icon - آیکون
 * @param {string} iconPosition - موقعیت آیکون: left, right
 * @param {node} children - محتوا
 * @param {string} className - کلاس اضافی
 * @param {function} onClick - تابع کلیک
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const fullWidthClass = fullWidth ? 'btn-fullwidth' : '';
  const loadingClass = loading ? 'btn-loading' : '';
  const disabledClass = disabled ? 'btn-disabled' : '';

  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    fullWidthClass,
    loadingClass,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn-spinner">
          <svg
            className="spinner"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="spinner-circle"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
        </span>
      )}

      {!loading && icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}

      {children && <span className="btn-content">{children}</span>}

      {!loading && icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </button>
  );
};

// ============================================
// Button Group Component
// ============================================
export const ButtonGroup = ({ children, className = '', ...props }) => {
  return (
    <div className={`btn-group ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Button;