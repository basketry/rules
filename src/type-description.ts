import { decodeRange, typeRule } from 'basketry';
import { parseSeverity } from './utils';

const typeDescriptionRule = typeRule(({ type, sourcePath, options }) => {
  if (!type.description) {
    return {
      code: 'basketry/type-description',
      message: `Type "${type.name.value}" is required to have a description.`,
      range: decodeRange(type.loc),
      severity: parseSeverity(options?.severity),
      sourcePath,
    };
  }

  return undefined;
});

export default typeDescriptionRule;
