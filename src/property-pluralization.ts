import { decodeRange, propertyRule } from 'basketry';
import {
  isPlural,
  isSingular,
  plural,
  singular,
  addUncountableRule,
} from 'pluralize';
import { parseSeverity } from './utils';

addUncountableRule(/data$/);

const code = 'basketry/property-pluralization';

const propertyPlurlaizationRule = propertyRule(
  ({ type, property, sourcePath, options }) => {
    if (
      property.isArray &&
      property.name.value !== plural(property.name.value)
    ) {
      return {
        code,
        message: `Parameter "${property.name.value}" (type "${
          type.name.value
        }") is an array and must be named "${plural(property.name.value)}"`,
        range: decodeRange(property.name.loc),
        severity: parseSeverity(options?.severity),
        sourcePath,
      };
    } else if (
      !property.isArray &&
      property.name.value !== singular(property.name.value)
    ) {
      return {
        code,
        message: `Parameter "${property.name.value}" (type "${
          type.name.value
        }") is an array and must be named "${singular(property.name.value)}"`,
        range: decodeRange(property.name.loc),
        severity: parseSeverity(options?.severity),
        sourcePath,
      };
    }

    return undefined;
  },
);

export default propertyPlurlaizationRule;
