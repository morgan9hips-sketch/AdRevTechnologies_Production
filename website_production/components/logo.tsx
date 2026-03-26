/**
 * Logo Component for Ad Rev Technologies Website
 *
 * Professional logo component using the Cash for Ads logo assets.
 * Responsive and scalable for use throughout the website.
 */

import Image from 'next/image'

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  showWordmark?: boolean
  className?: string
}

export function Logo({
  size = 'medium',
  showWordmark = true,
  className = '',
}: LogoProps) {
  const sizeClasses = {
    small: 'h-20',
    medium: 'h-32',
    large: 'h-40',
    xlarge: 'h-52',
  }

  return (
    <div className={`flex items-center ${className}`}>
      {showWordmark ? (
        <img
          src="/logo.png"
          alt="Ad Rev Technologies"
          className={`${sizeClasses[size]} w-auto`}
        />
      ) : (
        <img
          src="/logo.png"
          alt="Ad Rev Technologies"
          className={`${sizeClasses[size]} w-auto`}
        />
      )}
    </div>
  )
}
