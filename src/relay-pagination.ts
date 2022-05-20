import { decodeRange, getTypeByName, isRequired, methodRule } from 'basketry';
import { snake } from 'case';
import { parseSeverity } from './utils';

const allowed = new Set(['value', 'values', 'data']);

const relayPaginationRule = methodRule(
  ({ method, service, sourcePath, options }) => {
    if (!method.returnType) return;

    const type = service.types.find(
      (t) => t.name.value === method.returnType?.typeName.value,
    );

    const returnType = options?.payload
      ? type?.properties.find((p) =>
          parseAllowed(options?.payload).has(snake(p.name.value)),
        )
      : method.returnType;

    if (!returnType?.isArray) return;

    const first = method.parameters.find(
      (p) =>
        snake(p.name.value) === 'first' &&
        p.typeName.value === 'integer' &&
        !isRequired(p),
    );
    const after = method.parameters.find(
      (p) =>
        snake(p.name.value) === 'after' &&
        p.typeName.value === 'string' &&
        !isRequired(p),
    );
    const last = method.parameters.find(
      (p) =>
        snake(p.name.value) === 'last' &&
        p.typeName.value === 'integer' &&
        !isRequired(p),
    );
    const before = method.parameters.find(
      (p) =>
        snake(p.name.value) === 'before' &&
        p.typeName.value === 'string' &&
        !isRequired(p),
    );

    if (!first || !after || !last || !before) {
      return {
        code: 'basketry/relay-pagination',
        message: `Method "${method.name.value}" must provide optional relay pagination parameters: first, after, last, and after.`,
        range: decodeRange(method.loc),
        severity: parseSeverity(options?.severity),
        sourcePath,
      };
    }

    return undefined;
  },
);

function parseAllowed(input: any): Set<string> {
  return new Set(getAllowed(input).map(snake));
}

function getAllowed(input: any): string[] {
  if (!input) return Array.from(allowed);
  return Array.isArray(input) ? input.map((x) => snake(`${x}`)) : [`${input}`];
}

export default relayPaginationRule;
