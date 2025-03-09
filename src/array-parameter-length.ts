import { decodeRange, parameterRule } from 'basketry';
import { parseSeverity } from './utils';

const arrayParameterLengthRule = parameterRule(
  ({ service, method, parameter, options }) => {
    if (
      parameter.value.isArray &&
      !parameter.value.rules.find((rule) => rule.id === 'ArrayMaxItems')
    ) {
      const { range, sourceIndex } = decodeRange(parameter.name.loc);
      return {
        code: 'basketry/array-parameter-length',
        message: `Parameter "${parameter.name.value}" (method "${method.name.value}") is an array and must define a max array length.`,
        range,
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePaths[sourceIndex],
        link: 'https://github.com/basketry/rules#array-parameter-length',
      };
    }

    return undefined;
  },
);

export default arrayParameterLengthRule;
