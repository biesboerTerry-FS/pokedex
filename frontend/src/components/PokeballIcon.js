import React from 'react';

/**
 * Silhouette: grayscale. Caught: classic Poké Ball colors.
 */
export default function PokeballIcon({ caught, size = 28, title }) {
  const red = caught ? '#e53935' : '#6b7280';
  const white = caught ? '#f5f5f5' : '#9ca3af';
  const band = caught ? '#1f2937' : '#374151';
  const stroke = caught ? '#111827' : '#4b5563';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
    >
      {title ? <title>{title}</title> : null}
      <circle cx="16" cy="16" r="15" fill={white} stroke={stroke} strokeWidth="2" />
      <path
        d="M1 16 A15 15 0 0 1 31 16 Z"
        fill={red}
      />
      <rect x="1" y="14" width="30" height="4" fill={band} />
      <circle cx="16" cy="16" r="5" fill={white} stroke={stroke} strokeWidth="1.5" />
      <circle cx="16" cy="16" r="2.2" fill={band} />
    </svg>
  );
}
