// South African ID number validator
// Format: YYMMDD SSSS C A Z  (13 digits)
//   YYMMDD = date of birth, SSSS = gender sequence, C = citizenship (0/1),
//   A = legacy digit, Z = Luhn checksum digit.

/**
 * Validate a South African ID number.
 * @param {string} rawId
 * @returns {string|null} A human-readable error message, or null if the ID is valid.
 */
export function validateSAID(rawId) {
  const id = String(rawId || '').replace(/\s+/g, '');

  if (!id) return 'ID Number is required.';
  if (!/^\d+$/.test(id)) return `ID Number must contain digits only (you entered "${rawId}").`;
  if (id.length < 13) return `ID Number is too short: ${id.length} digits entered, 13 required.`;
  if (id.length > 13) return `ID Number is too long: ${id.length} digits entered, 13 required.`;

  // Date of birth check
  const yy = parseInt(id.substring(0, 2), 10);
  const mm = parseInt(id.substring(2, 4), 10);
  const dd = parseInt(id.substring(4, 6), 10);
  const currentYY = new Date().getFullYear() % 100;
  const fullYear = yy <= currentYY ? 2000 + yy : 1900 + yy;
  const dob = new Date(Date.UTC(fullYear, mm - 1, dd));
  if (
    mm < 1 || mm > 12 ||
    dob.getUTCFullYear() !== fullYear ||
    dob.getUTCMonth() !== mm - 1 ||
    dob.getUTCDate() !== dd
  ) {
    return `ID Number has an invalid date of birth (${id.substring(0, 6)} is not a real YYMMDD date).`;
  }

  // Citizenship digit
  const citizenship = id.charAt(10);
  if (citizenship !== '0' && citizenship !== '1') {
    return 'ID Number is invalid: 11th digit (citizenship) must be 0 or 1.';
  }

  // Luhn checksum
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    let digit = parseInt(id.charAt(12 - i), 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  if (sum % 10 !== 0) {
    return 'ID Number is invalid: checksum failed. Please re-check the digits (possible typo).';
  }

  return null;
}

export default validateSAID;
