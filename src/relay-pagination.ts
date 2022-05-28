import { decodeRange, isRequired, methodRule } from 'basketry';
import { snake } from 'case';
import { isArrayPayload, parseSeverity } from './utils';

const relayPaginationRule = methodRule(
  ({ method, service, sourcePath, options }) => {
    if (!isArrayPayload(service, options, method.returnType)) return;

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
        message: `Method "${method.name.value}" must define optional relay pagination parameters: first, after, last, and after.`,
        range: decodeRange(method.loc),
        severity: parseSeverity(options?.severity),
        sourcePath,
      };
    }

    return undefined;
  },
);

export default relayPaginationRule;
