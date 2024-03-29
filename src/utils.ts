import { getTypeByName, ReturnType, Service, Severity } from 'basketry';
import { camel, constant, header, kebab, pascal, snake } from 'case';

export type Casing =
  | 'snake'
  | 'pascal'
  | 'camel'
  | 'kebab'
  | 'header'
  | 'constant';

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

export function parseCasing(casing: any): Casing | undefined {
  switch (casing) {
    case 'snake':
    case 'pascal':
    case 'camel':
    case 'kebab':
    case 'header':
    case 'constant':
      return casing;
    default:
      return undefined;
  }
}

export function applyCasing(input: string, casing: Casing | undefined): string {
  switch (casing) {
    case 'snake':
      return snake(input);
    case 'pascal':
      return pascal(input);
    case 'camel':
      return camel(input);
    case 'kebab':
      return kebab(input);
    case 'header':
      return header(input);
    case 'constant':
      return constant(input);
    default:
      return input;
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

export function getList(maybeArray: any): Set<string> | undefined {
  if (Array.isArray(maybeArray)) {
    return new Set(
      (maybeArray as any[])
        .filter((x: any): x is string => typeof x === 'string')
        .map((x) => snake(x)),
    );
  } else {
    return undefined;
  }
}
