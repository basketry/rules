import {
  decodeRange,
  getTypeByName,
  isRequired,
  methodRule,
  Type,
} from 'basketry';
import { camel, snake } from 'case';
import { isArrayPayload, parseSeverity } from './utils';

const relayPaginationRule = methodRule(
  ({ method, httpMethod, service, sourcePath, options }) => {
    const verbs = options?.verb || options?.verbs || 'get';
    const allow =
      !httpMethod?.verb ||
      `${verbs}`.toLowerCase() === httpMethod.verb.value ||
      (Array.isArray(verbs) &&
        verbs
          .map((verb) => `${verb}`.toLowerCase())
          .includes(httpMethod.verb.value));

    if (!allow) return;
    if (!isArrayPayload(service, options, method.returnType)) return;

    const first = () =>
      method.parameters.find(
        (p) =>
          snake(p.name.value) === 'first' &&
          p.typeName.value === 'integer' &&
          !isRequired(p),
      );
    const after = () =>
      method.parameters.find(
        (p) =>
          snake(p.name.value) === 'after' &&
          p.typeName.value === 'string' &&
          !isRequired(p),
      );
    const last = () =>
      method.parameters.find(
        (p) =>
          snake(p.name.value) === 'last' &&
          p.typeName.value === 'integer' &&
          !isRequired(p),
      );
    const before = () =>
      method.parameters.find(
        (p) =>
          snake(p.name.value) === 'before' &&
          p.typeName.value === 'string' &&
          !isRequired(p),
      );
    const pageInfo = () =>
      getTypeByName(service, method.returnType?.typeName.value)
        ?.properties.filter((prop) => !prop.isPrimitive)
        .map((prop) => getTypeByName(service, prop.typeName.value))
        .filter((type): type is Type => !!type)
        .find((type) => {
          const hasPreviousPage = type.properties.find(
            (prop) =>
              camel(prop.name.value) === 'hasPreviousPage' &&
              prop.isPrimitive &&
              prop.typeName.value === 'boolean',
          );
          if (!hasPreviousPage) return false;

          const hasNextPage = type.properties.find(
            (prop) =>
              camel(prop.name.value) === 'hasNextPage' &&
              prop.isPrimitive &&
              prop.typeName.value === 'boolean',
          );
          if (!hasNextPage) return false;

          const startCursor = type.properties.find(
            (prop) =>
              camel(prop.name.value) === 'startCursor' &&
              prop.isPrimitive &&
              prop.typeName.value === 'string',
          );
          if (!startCursor) return false;

          const endCursor = type.properties.find(
            (prop) =>
              camel(prop.name.value) === 'endCursor' &&
              prop.isPrimitive &&
              prop.typeName.value === 'string',
          );
          return !!endCursor;
        });

    if (!first() || !after() || !last() || !before() || !pageInfo()) {
      return {
        code: 'basketry/relay-pagination',
        message: `Method "${method.name.value}" must define optional relay pagination parameters and return a "page info" object.`,
        range: decodeRange(method.loc),
        severity: parseSeverity(options?.severity),
        sourcePath,
      };
    }

    return undefined;
  },
);

export default relayPaginationRule;
