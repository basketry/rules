import {
  decodeRange,
  getTypeByName,
  getUnionByName,
  methodRule,
} from 'basketry';
import { parseSeverity } from './utils';

const objectResponseBodyRule = methodRule(({ method, service, options }) => {
  const returnType = method.returnType;
  if (!returnType) return;

  const type = getTypeByName(service, returnType.typeName.value);
  if (type && !returnType.isArray) return;

  const union = getUnionByName(service, returnType.typeName.value);
  if (union && union.members.every((m) => !m.isArray && !m.isPrimitive)) return;

  return {
    code: 'basketry/object-response-body',
    message: `Method "${method.name.value}" must return an object or a union of objects.`,
    range: decodeRange(method.loc),
    severity: parseSeverity(options?.severity),
    sourcePath: service.sourcePath,
    link: 'https://github.com/basketry/rules#object-response-body',
  };
});

export default objectResponseBodyRule;
