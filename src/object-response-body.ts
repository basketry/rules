import {
  decodeRange,
  getTypeByName,
  getUnionByName,
  methodRule,
} from 'basketry';
import { parseSeverity } from './utils';

const objectResponseBodyRule = methodRule(({ method, service, options }) => {
  const returnValue = method.returns;
  if (!returnValue) return;

  const type = getTypeByName(service, returnValue.value.typeName.value);
  if (type && !returnValue.value.isArray) return;

  const union = getUnionByName(service, returnValue.value.typeName.value);
  if (union?.members.every((m) => !m.isArray && m.kind === 'ComplexValue')) {
    return;
  }

  const { range, sourceIndex } = decodeRange(method.name.loc ?? method.loc);

  return {
    code: 'basketry/object-response-body',
    message: `Method "${method.name.value}" must return an object or a union of objects.`,
    range,
    severity: parseSeverity(options?.severity),
    sourcePath: service.sourcePaths[sourceIndex],
    link: 'https://github.com/basketry/rules#object-response-body',
  };
});

export default objectResponseBodyRule;
