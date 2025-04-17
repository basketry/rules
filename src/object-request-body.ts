import {
  decodeRange,
  getTypeByName,
  getUnionByName,
  parameterRule,
} from 'basketry';
import { parseSeverity } from './utils';

const objectRequestBodyRule = parameterRule(
  ({ parameter, httpParameter, service, options }) => {
    if (!httpParameter) return;

    if (httpParameter.in.value !== 'body') return;

    const type = getTypeByName(service, parameter.typeName.value);
    if (type && !parameter.isArray) return;

    const union = getUnionByName(service, parameter.typeName.value);
    if (union && union.members.every((m) => !m.isArray && !m.isPrimitive)) {
      return;
    }

    return {
      code: 'basketry/object-request-body',
      message: `Body parameter "${parameter.name.value}" must be an object or a union of objects.`,
      range: decodeRange(parameter.loc),
      severity: parseSeverity(options?.severity),
      sourcePath: service.sourcePath,
      link: 'https://github.com/basketry/rules#object-request-body',
    };
  },
);

export default objectRequestBodyRule;
