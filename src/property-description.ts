import { decodeRange, propertyRule } from 'basketry';
import { parseSeverity } from './utils';

const propertyDescriptionRule = propertyRule(
  ({ property, sourcePath, options }) => {
    if (!property.description) {
      return {
        code: 'basketry/property-description',
        message: `Property "${property.name.value}" is required to have a description.`,
        range: decodeRange(property.loc),
        severity: parseSeverity(options?.severity),
        sourcePath,
      };
    }

    return undefined;
  },
);

export default propertyDescriptionRule;
