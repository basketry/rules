import { decodeRange, propertyRule } from 'basketry';
import { parseSeverity } from './utils';

const stringIdRule = propertyRule(({ service, property, options }) => {
  if (
    property.name.value.toLowerCase() === 'id' &&
    property.value.typeName.value !== 'string'
  ) {
    const { range, sourceIndex } = decodeRange(property.loc);
    return {
      code: 'basketry/string-id',
      message: 'Type IDs must be of type `string`',
      range,
      severity: parseSeverity(options?.severity),
      sourcePath: service.sourcePaths[sourceIndex],
      link: 'https://github.com/basketry/rules#string-ids',
    };
  }

  return undefined;
});

export default stringIdRule;
