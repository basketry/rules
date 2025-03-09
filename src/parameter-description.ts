import { decodeRange, parameterRule } from 'basketry';
import { parseSeverity } from './utils';

const parameterDescriptionRule = parameterRule(
  ({ service, parameter, options }) => {
    if (!parameter.description) {
      const { range, sourceIndex } = decodeRange(parameter.loc);
      return {
        code: 'basketry/parameter-description',
        message: `Parameter "${parameter.name.value}" is required to have a description.`,
        range,
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePaths[sourceIndex],
        link: 'https://github.com/basketry/rules#descriptions',
      };
    }

    return undefined;
  },
);

export default parameterDescriptionRule;
