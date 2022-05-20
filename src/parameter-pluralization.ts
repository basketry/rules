import { decodeRange, parameterRule } from 'basketry';
import { plural, singular, addUncountableRule } from 'pluralize';
import { parseSeverity } from './utils';

addUncountableRule(/data$/);

const code = 'basketry/parameter-pluralization';

const parameterPlurlaizationRule = parameterRule(
  ({ method, parameter, sourcePath, options }) => {
    if (
      parameter.isArray &&
      parameter.name.value !== plural(parameter.name.value)
    ) {
      return {
        code,
        message: `Parameter "${parameter.name.value}" (method "${
          method.name.value
        }") is an array and must be named "${plural(parameter.name.value)}"`,
        range: decodeRange(parameter.name.loc),
        severity: parseSeverity(options?.severity),
        sourcePath,
      };
    } else if (
      !parameter.isArray &&
      parameter.name.value !== singular(parameter.name.value)
    ) {
      return {
        code,
        message: `Parameter "${parameter.name.value}" (method "${
          method.name.value
        }") is an array and must be named "${singular(parameter.name.value)}"`,
        range: decodeRange(parameter.name.loc),
        severity: parseSeverity(options?.severity),
        sourcePath,
      };
    }

    return undefined;
  },
);

export default parameterPlurlaizationRule;
