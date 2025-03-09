import { decodeRange, parameterRule } from 'basketry';
import { plural, singular, addUncountableRule } from 'pluralize';
import { parseSeverity } from './utils';

addUncountableRule(/data$/);

const code = 'basketry/parameter-pluralization';
const link = 'https://github.com/basketry/rules#pluralization';

const parameterPlurlaizationRule = parameterRule(
  ({ service, method, parameter, options }) => {
    if (
      parameter.value.isArray &&
      parameter.name.value !== plural(parameter.name.value)
    ) {
      const { range, sourceIndex } = decodeRange(parameter.loc);
      return {
        code,
        message: `Parameter "${parameter.name.value}" (method "${
          method.name.value
        }") is an array and must be named "${plural(parameter.name.value)}"`,
        range,
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePaths[sourceIndex],
        link,
      };
    } else if (
      !parameter.value.isArray &&
      parameter.name.value !== singular(parameter.name.value)
    ) {
      const { range, sourceIndex } = decodeRange(parameter.loc);
      return {
        code,
        message: `Parameter "${parameter.name.value}" (method "${
          method.name.value
        }") is not an array and must be named "${singular(
          parameter.name.value,
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

export default parameterPlurlaizationRule;
