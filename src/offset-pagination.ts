import { decodeRange, isRequired, methodRule } from 'basketry';
import { snake } from 'case';
import { getList, isArrayPayload, parseSeverity } from './utils';

const offsetPaginationRule = methodRule(
  ({ method, httpMethod, service, options }) => {
    const allowList = getList(options?.allow);
    if (allowList && !allowList.has(snake(method.name.value))) return;

    const denyList = getList(options?.deny);
    if (denyList && denyList.has(snake(method.name.value))) return;

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
        message: `Method "${method.name.value}" must define optional integer offset and limit parameters.`,
        range: decodeRange(method.loc),
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePath,
        link: 'https://github.com/basketry/rules#pagination',
      };
    }

    return undefined;
  },
);

export default offsetPaginationRule;
