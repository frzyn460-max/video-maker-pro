/* 
 * مسیر: /video-maker-pro/src/components/common/Input.jsx
 */

import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyPress,
  disabled = false,
  required = false,
  autoFocus = false,
  className = '',
  min,
  max,
  step,
  ...props
}) => {
  const inputClass = `input ${className}`.trim();

  return (
    <input
      type={type}
      className={inputClass}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyPress={onKeyPress}
      disabled={disabled}
      required={required}
      autoFocus={autoFocus}
      min={min}
      max={max}
      step={step}
      {...props}
    />
  );
};

export default Input;