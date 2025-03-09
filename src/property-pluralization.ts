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
const link = 'https://github.com/basketry/rules#pluralization';

const propertyPlurlaizationRule = propertyRule(
  ({ service, type, property, options }) => {
    if (
      property.value.isArray &&
      property.name.value !== plural(property.name.value)
    ) {
      const { range, sourceIndex } = decodeRange(property.loc);
      return {
        code,
        message: `Parameter "${property.name.value}" (type "${
          type.name.value
        }") is an array and must be named "${plural(property.name.value)}"`,
        range,
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePaths[sourceIndex],
        link,
      };
    } else if (
      !property.value.isArray &&
      property.name.value !== singular(property.name.value)
    ) {
      const { range, sourceIndex } = decodeRange(property.loc);
      return {
        code,
        message: `Parameter "${property.name.value}" (type "${
          type.name.value
        }") is not an array and must be named "${singular(
          property.name.value,
        )}"`,
        range,
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePaths[sourceIndex],
        link,
      };
    }

    return undefined;
  },
);

export default propertyPlurlaizationRule;
