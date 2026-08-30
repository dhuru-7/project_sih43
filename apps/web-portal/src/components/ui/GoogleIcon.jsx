import React from 'react';

export const GoogleIcon = ({ 
  name, 
  size = 24, 
  color = 'currentColor', 
  fill = false, 
  weight = 400, 
  className = '', 
  style = {} 
}) => {
  return (
    <span
      className={`material-symbols-rounded ${className}`}
      style={{
        fontSize: `${size}px`,
        color: color,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        verticalAlign: 'middle',
        ...style,
      }}
    >
      {name}
    </span>
  );
};
