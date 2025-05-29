import { decodeRange, parameterRule } from 'basketry';
import { parseSeverity } from './utils';

const noHttpHeadBodyRule = parameterRule(
  ({ parameter, httpParameter, method, httpMethod, service, options }) => {
    if (!httpParameter) return;
    if (!httpMethod) return;
    if (httpMethod.verb.value !== 'head') return;
    if (httpParameter.location.value !== 'body') return;

    const { range, sourceIndex } = decodeRange(
      parameter.name.loc ?? parameter.loc,
    );

    return {
      code: 'basketry/no-http-head-body',
      message: `HTTP HEAD method "${method.name.value}" must not define a body parameter.`,
      range,
      severity: parseSeverity(options?.severity),
      sourcePath: service.sourcePaths[sourceIndex],
      link: 'https://github.com/basketry/rules#no-http-head-body',
    };
  },
);

export default noHttpHeadBodyRule;
