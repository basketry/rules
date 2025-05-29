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

    if (httpParameter.location.value !== 'body') return;

    const type = getTypeByName(service, parameter.value.typeName.value);
    if (type && !parameter.value.isArray) return;

    const union = getUnionByName(service, parameter.value.typeName.value);
    if (union?.members.every((m) => !m.isArray && m.kind === 'ComplexValue')) {
      return;
    }

    const { range, sourceIndex } = decodeRange(
      parameter.name.loc ?? parameter.loc,
    );

    return {
      code: 'basketry/object-request-body',
      message: `Body parameter "${parameter.name.value}" must be an object or a union of objects.`,
      range,
      severity: parseSeverity(options?.severity),
      sourcePath: service.sourcePaths[sourceIndex],
      link: 'https://github.com/basketry/rules#object-request-body',
    };
  },
);

export default objectRequestBodyRule;
