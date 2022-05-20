import { decodeRange, propertyRule } from 'basketry';
import { parseSeverity } from './utils';

const stringIdRule = propertyRule(({ property, sourcePath, options }) => {
  if (property.name.value === 'id' && property.typeName.value !== 'string') {
    return {
      code: 'basketry/string-id',
      message: 'Type IDs must be of type `string`',
      range: decodeRange(property.loc),
      severity: parseSeverity(options?.severity),
      sourcePath,
    };
  }

  return undefined;
});

export default stringIdRule;
