import { decodeRange, getTypeByName, isRequired, methodRule } from 'basketry';
import { snake } from 'case';
import { parseSeverity } from './utils';

const allowed = new Set(['value', 'values', 'data']);

const offsetPaginationRule = methodRule(
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

    const offset = method.parameters.find(
      (p) =>
        snake(p.name.value) === 'offset' &&
        p.typeName.value === 'integer' &&
        !isRequired(p),
    );
    const limit = method.parameters.find(
      (p) =>
        snake(p.name.value) === 'limit' &&
        p.typeName.value === 'integer' &&
        !isRequired(p),
    );

    if (!offset || !limit) {
      return {
        code: 'basketry/offset-pagination',
        message: `Method "${method.name.value}" must provide optional integer offset and limit parameters.`,
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

export default offsetPaginationRule;
