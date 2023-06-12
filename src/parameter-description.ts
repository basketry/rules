import { decodeRange, parameterRule } from 'basketry';
import { parseSeverity } from './utils';

const parameterDescriptionRule = parameterRule(
  ({ service, parameter, options }) => {
    if (!parameter.description) {
      return {
        code: 'basketry/parameter-description',
        message: `Parameter "${parameter.name.value}" is required to have a description.`,
        range: decodeRange(parameter.loc),
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePath,
        link: 'https://github.com/basketry/rules#descriptions',
      };
    }

    return undefined;
  },
);

export default parameterDescriptionRule;
