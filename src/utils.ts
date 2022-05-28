import {
  decodeRange,
  getTypeByName,
  isRequired,
  methodRule,
  ReturnType,
  Service,
  Severity,
} from 'basketry';
import { snake } from 'case';

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

const allowedPayloadProps = new Set(['value', 'values', 'data']);

export function isArrayPayload(
  service: Service,
  options: any,
  returnType: ReturnType | undefined,
): boolean {
  if (!returnType) return false;

  const type = getTypeByName(service, returnType.typeName.value);
  if (!type) return returnType.isArray;

  const errorProp = type.properties.find(
    (prop) => snake(prop.name.value) === 'errors' && prop.isArray,
  );
  if (!errorProp) return returnType.isArray;

  const payloadProp = type.properties.find((p) =>
    parseAllowedPayloadProps(options?.payload).has(snake(p.name.value)),
  );
  if (!payloadProp) return returnType.isArray;

  return payloadProp.isArray;
}

function parseAllowedPayloadProps(input: any): Set<string> {
  return new Set(getAllowedPayloadProps(input).map(snake));
}

function getAllowedPayloadProps(input: any): string[] {
  if (!input) return Array.from(allowedPayloadProps);
  return Array.isArray(input) ? input.map((x) => snake(`${x}`)) : [`${input}`];
}
