export const LCASE = 'abcdefghijklmnopqrstuvwxyz';
export const UCASE = LCASE.toUpperCase();
export const DIGITS = '0123456789';
export const ALPHA = LCASE + UCASE;
export const ALPHANUM = ALPHA + DIGITS;
export const CHARS = `${ALPHANUM}!@#$%^&*()`;
export const HEX_CHARS = DIGITS + 'abcdef';
export const PUNCTUATION = `.?!,;:`;
