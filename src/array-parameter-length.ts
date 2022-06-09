import { decodeRange, parameterRule } from 'basketry';
import { parseSeverity } from './utils';

const arrayParameterLengthRule = parameterRule(
  ({ method, parameter, sourcePath, options }) => {
    if (
      parameter.isArray &&
      !parameter.rules.find((rule) => rule.id === 'array-max-items')
    ) {
      return {
        code: 'basketry/array-parameter-length',
        message: `Parameter "${parameter.name.value}" (method "${method.name.value}") is an array and must define a max array length.`,
        range: decodeRange(parameter.name.loc),
        severity: parseSeverity(options?.severity),
        sourcePath,
        link: 'https://github.com/basketry/rules#array-parameter-length',
      };
    }

    return undefined;
  },
);

export default arrayParameterLengthRule;
