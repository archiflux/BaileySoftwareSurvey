/**
 * Validation utility functions
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

export interface ValidationError {
  field: string;
  message: string;
}

export const getEmailError = (email: string): string | undefined => {
  if (!validateRequired(email)) {
    return 'Email is required';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

export const getRequiredError = (fieldName: string, value: any): string | undefined => {
  if (!validateRequired(value)) {
    return `${fieldName} is required`;
  }
  return undefined;
};

export const getMinLengthError = (
  fieldName: string,
  value: string,
  minLength: number
): string | undefined => {
  if (!validateMinLength(value, minLength)) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return undefined;
};

export const getMaxLengthError = (
  fieldName: string,
  value: string,
  maxLength: number
): string | undefined => {
  if (!validateMaxLength(value, maxLength)) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  return undefined;
};
