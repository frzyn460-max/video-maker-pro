import React, { useState, forwardRef } from 'react';
import './Input.css';

/**
 * کامپوننت Input با امکانات کامل
 */
const Input = forwardRef(
  (
    {
      type = 'text',
      label = '',
      placeholder = '',
      value = '',
      onChange,
      onFocus,
      onBlur,
      error = '',
      success = '',
      helperText = '',
      disabled = false,
      required = false,
      fullWidth = false,
      icon = null,
      iconPosition = 'left',
      clearable = false,
      onClear,
      size = 'md',
      variant = 'default',
      className = '',
      inputClassName = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const hasError = !!error;
    const hasSuccess = !!success;
    const hasValue = value && value.toString().length > 0;

    const handleFocus = (e) => {
      setIsFocused(true);
      onFocus && onFocus(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      onBlur && onBlur(e);
    };

    const handleClear = () => {
      if (onChange) {
        onChange({ target: { value: '' } });
      }
      onClear && onClear();
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const containerClasses = [
      'input-container',
      fullWidth && 'input-fullwidth',
      hasError && 'input-error',
      hasSuccess && 'input-success',
      disabled && 'input-disabled',
      isFocused && 'input-focused',
      variant === 'filled' && 'input-filled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      'input',
      `input-${size}`,
      icon && iconPosition === 'left' && 'input-has-icon-left',
      icon && iconPosition === 'right' && 'input-has-icon-right',
      clearable && hasValue && 'input-clearable',
      type === 'password' && 'input-password',
      inputClassName,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses}>
        {/* Label */}
        {label && (
          <label className="input-label">
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="input-wrapper">
          {/* Icon Left */}
          {icon && iconPosition === 'left' && (
            <span className="input-icon input-icon-left">{icon}</span>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            {...props}
          />

          {/* Icon Right */}
          {icon && iconPosition === 'right' && !clearable && type !== 'password' && (
            <span className="input-icon input-icon-right">{icon}</span>
          )}

          {/* Clear Button */}
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              className="input-clear"
              onClick={handleClear}
              tabIndex={-1}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Password Toggle */}
          {type === 'password' && (
            <button
              type="button"
              className="input-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Helper Text / Error / Success */}
        {(helperText || error || success) && (
          <div className="input-message">
            {error && <span className="input-error-text">{error}</span>}
            {success && <span className="input-success-text">{success}</span>}
            {!error && !success && helperText && (
              <span className="input-helper-text">{helperText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================
// Textarea Component
// ============================================
export const Textarea = forwardRef(
  (
    {
      label = '',
      placeholder = '',
      value = '',
      onChange,
      error = '',
      helperText = '',
      disabled = false,
      required = false,
      fullWidth = false,
      rows = 4,
      maxLength = null,
      showCount = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const currentLength = value ? value.length : 0;

    const containerClasses = [
      'input-container',
      fullWidth && 'input-fullwidth',
      hasError && 'input-error',
      disabled && 'input-disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses}>
        {label && (
          <label className="input-label">
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          className="input textarea"
          {...props}
        />

        {(showCount || helperText || error) && (
          <div className="input-message">
            <div className="flex justify-between items-center w-full">
              <div>
                {error && <span className="input-error-text">{error}</span>}
                {!error && helperText && (
                  <span className="input-helper-text">{helperText}</span>
                )}
              </div>
              {showCount && (
                <span className="text-xs opacity-70">
                  {currentLength}
                  {maxLength && ` / ${maxLength}`}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Input;