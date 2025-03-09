import { decodeRange, propertyRule } from 'basketry';
import { parseSeverity } from './utils';

const propertyDescriptionRule = propertyRule(
  ({ service, property, options }) => {
    if (!property.description) {
      const { range, sourceIndex } = decodeRange(property.loc);
      return {
        code: 'basketry/property-description',
        message: `Property "${property.name.value}" is required to have a description.`,
        range,
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePaths[sourceIndex],
        link: 'https://github.com/basketry/rules#descriptions',
      };
    }

    return undefined;
  },
);

export default propertyDescriptionRule;
