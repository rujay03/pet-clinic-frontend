/**
 * Password validation utility
 * Returns an error message if password is invalid, or null if valid
 */
export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return null;
};

/**
 * Get all password requirements with their validation status
 */
export const getPasswordRequirements = (password: string) => {
  return [
    {
      text: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      text: "One uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      text: "One lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      text: "One number",
      met: /[0-9]/.test(password),
    },
    {
      text: "One special character (!@#$%^&*(),.?\":{}|<>)",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];
};

/**
 * Format phone number to numeric only
 */
export const formatPhoneNumber = (value: string): string => {
  return value.replace(/\D/g, "");
};

/**
 * Check if password is strong (meets all requirements)
 */
export const isPasswordStrong = (password: string): boolean => {
  return validatePassword(password) === null;
};

