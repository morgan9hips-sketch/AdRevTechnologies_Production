/**
 * Logo Component for Ad Rev Technologies Website
 */

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
    small: 'h-8',
    medium: 'h-10',
    large: 'h-14',
    xlarge: 'h-20',
  }

  return (
    <div className={`flex items-center ${className}`}>
      {showWordmark ? (
        <img
          src="/brand/logo-transparent.png"
          alt="Ad Rev Technologies"
          className={`${sizeClasses[size]} w-auto`}
        />
      ) : (
        <img
          src="/brand/logo-icon.png"
          alt="Ad Rev Technologies"
          className={`${sizeClasses[size]} w-auto`}
        />
      )}
    </div>
  )
}
