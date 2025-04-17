import { decodeRange, parameterRule } from 'basketry';
import { parseSeverity } from './utils';

const noHttpGetBodyRule = parameterRule(
  ({ parameter, httpParameter, method, httpMethod, service, options }) => {
    if (!httpParameter) return;
    if (!httpMethod) return;
    if (httpMethod.verb.value !== 'get') return;
    if (httpParameter.in.value !== 'body') return;

    return {
      code: 'basketry/no-http-get-body',
      message: `HTTP GET method "${method.name.value}" must not define a body parameter.`,
      range: decodeRange(parameter.loc),
      severity: parseSeverity(options?.severity),
      sourcePath: service.sourcePath,
      link: 'https://github.com/basketry/rules#no-http-get-body',
    };
  },
);

export default noHttpGetBodyRule;
