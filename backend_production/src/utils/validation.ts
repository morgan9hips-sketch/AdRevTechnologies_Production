export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (
  password: string,
  userData?: { email?: string; name?: string }
): PasswordValidationResult => {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (password && password.length > 128) {
    errors.push('Password must not exceed 128 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Use a simpler regex that checks for any non-alphanumeric character
  // This avoids ReDoS vulnerability while still enforcing special chars
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check if password contains personal information
  if (userData) {
    const lowerPassword = password.toLowerCase();

    if (userData.email) {
      const emailPart = userData.email.split('@')[0].toLowerCase();
      if (emailPart.length >= 3 && lowerPassword.includes(emailPart)) {
        errors.push('Password must not contain your email address');
      }
    }

    if (userData.name) {
      const nameParts = userData.name.toLowerCase().split(' ');
      for (const part of nameParts) {
        if (part.length >= 3 && lowerPassword.includes(part)) {
          errors.push('Password must not contain your name');
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateEmail = (email: string): boolean => {
  // Simple email validation that avoids ReDoS
  // Checks for: non-empty local part @ non-empty domain . non-empty TLD
  if (!email || email.length > 254) return false;

  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (!local || local.length > 64 || !domain || domain.length > 253) return false;

  // Check for at least one dot in domain and valid characters
  if (!domain.includes('.')) return false;

  // Check for valid characters (alphanumeric, dots, hyphens, underscores, plus)
  // Use simple character-by-character validation to avoid ReDoS
  const validLocalChars = /^[a-zA-Z0-9._+-]+$/;
  const validDomainChars = /^[a-zA-Z0-9.-]+$/;

  if (!validLocalChars.test(local) || !validDomainChars.test(domain)) return false;

  // Ensure domain has valid TLD (at least 2 chars after last dot)
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 1) return false;

  return true;
};

/**
 * Validate URL to prevent SSRF attacks
 */
export const validateUrl = (url: string, allowedProtocols: string[] = ['https']): boolean => {
  try {
    const parsed = new URL(url);

    // Check protocol
    if (!allowedProtocols.includes(parsed.protocol.replace(':', ''))) {
      return false;
    }

    // Prevent local network access (SSRF protection)
    const hostname = parsed.hostname.toLowerCase();
    const privatePatterns = [
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^localhost$/,
      /^0\.0\.0\.0$/,
    ];

    for (const pattern of privatePatterns) {
      if (pattern.test(hostname)) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate phone number format
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // Simple international phone number validation
  // Allows: +, digits, spaces, hyphens, parentheses
  const phonePattern = /^\+?[0-9\s\-()]{10,20}$/;
  return phonePattern.test(phone);
};

/**
 * Validate IP address (IPv4 or IPv6)
 */
export const validateIpAddress = (ip: string): boolean => {
  // IPv4
  const ipv4Pattern =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // IPv6 (simplified)
  const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
};

/**
 * Validate that input doesn't contain SQL injection patterns
 */
export const containsSqlInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--|\*\/|\/\*)/,
    /('|;|\\|\|\|)/,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
};

/**
 * Validate JWT token format (basic check)
 */
export const isValidJwtFormat = (token: string): boolean => {
  if (!token) return false;

  const parts = token.split('.');
  return parts.length === 3;
};
