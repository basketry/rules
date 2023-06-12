import { decodeRange, propertyRule } from 'basketry';
import { parseSeverity } from './utils';

const propertyDescriptionRule = propertyRule(
  ({ service, property, options }) => {
    if (!property.description) {
      return {
        code: 'basketry/property-description',
        message: `Property "${property.name.value}" is required to have a description.`,
        range: decodeRange(property.loc),
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePath,
        link: 'https://github.com/basketry/rules#descriptions',
      };
    }

    return undefined;
  },
);

export default propertyDescriptionRule;
