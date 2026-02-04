// Bangladesh phone number validation utilities

/**
 * Validates a Bangladesh phone number
 * Valid formats:
 * - 01XXXXXXXXX (11 digits starting with 01)
 * - +8801XXXXXXXXX (14 characters with country code)
 */
export const validateBangladeshPhone = (phone: string): boolean => {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, "");
  
  // Pattern for Bangladesh numbers
  // Either starts with 01 followed by 9 digits (total 11)
  // Or starts with +880 followed by 10 digits (total 14 chars)
  const bdPhoneRegex = /^(\+880|0)1[3-9]\d{8}$/;
  
  return bdPhoneRegex.test(cleaned);
};

/**
 * Formats a phone number to standard Bangladesh format
 */
export const formatBangladeshPhone = (phone: string): string => {
  const cleaned = phone.replace(/[\s-]/g, "");
  
  // If it starts with +880, keep it
  if (cleaned.startsWith("+880")) {
    return cleaned;
  }
  
  // If it starts with 880 (without +), add the +
  if (cleaned.startsWith("880")) {
    return "+" + cleaned;
  }
  
  // If it starts with 0, convert to +880 format
  if (cleaned.startsWith("0")) {
    return "+88" + cleaned;
  }
  
  return cleaned;
};

/**
 * Checks if phone is provided and valid for COD eligibility
 */
export const isPhoneValidForCOD = (phone: string | null | undefined): boolean => {
  if (!phone || phone.trim() === "") {
    return false;
  }
  return validateBangladeshPhone(phone);
};
