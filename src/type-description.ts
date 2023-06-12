import { decodeRange, typeRule } from 'basketry';
import { parseSeverity } from './utils';

const typeDescriptionRule = typeRule(({ service, type, options }) => {
  if (!type.description) {
    return {
      code: 'basketry/type-description',
      message: `Type "${type.name.value}" is required to have a description.`,
      range: decodeRange(type.loc),
      severity: parseSeverity(options?.severity),
      sourcePath: service.sourcePath,
      link: 'https://github.com/basketry/rules#descriptions',
    };
  }

  return undefined;
});

export default typeDescriptionRule;
