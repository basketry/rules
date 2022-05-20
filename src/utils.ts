import { Severity } from 'basketry';

export function parseSeverity(
  input: any,
  fallback: Severity = 'error',
): Severity {
  switch (input) {
    case 'info':
    case 'warning':
    case 'error':
      return input;
    default:
      return fallback;
  }
}
