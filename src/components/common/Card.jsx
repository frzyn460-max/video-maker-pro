import React from 'react';
import './Card.css';

/**
 * کامپوننت کارت حرفه‌ای
 * 
 * @param {node} children - محتوای کارت
 * @param {string} className - کلاس اضافی
 * @param {boolean} hoverable - قابلیت hover
 * @param {boolean} clickable - قابلیت کلیک
 * @param {function} onClick - تابع کلیک
 * @param {string} variant - نوع: default, outlined, elevated
 */
const Card = ({
  children,
  className = '',
  hoverable = false,
  clickable = false,
  onClick,
  variant = 'default',
  ...props
}) => {
  const classes = [
    'card',
    `card-${variant}`,
    hoverable && 'card-hoverable',
    clickable && 'card-clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================
// Card Header
// ============================================
export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
};

// ============================================
// Card Body
// ============================================
export const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
};

// ============================================
// Card Footer
// ============================================
export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
};

// ============================================
// Card Image
// ============================================
export const CardImage = ({ src, alt, className = '', ...props }) => {
  return (
    <div className={`card-image ${className}`} {...props}>
      <img src={src} alt={alt} />
    </div>
  );
};

// ============================================
// Card Title
// ============================================
export const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => {
  return (
    <Component className={`card-title ${className}`} {...props}>
      {children}
    </Component>
  );
};

// ============================================
// Card Description
// ============================================
export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`card-description ${className}`} {...props}>
      {children}
    </p>
  );
};

export default Card;