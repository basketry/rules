import { decodeRange, parameterRule } from 'basketry';
import { parseSeverity } from './utils';

const noHttpDeleteBodyRule = parameterRule(
  ({ parameter, httpParameter, method, httpMethod, service, options }) => {
    if (!httpParameter) return;
    if (!httpMethod) return;
    if (httpMethod.verb.value !== 'delete') return;
    if (httpParameter.in.value !== 'body') return;

    return {
      code: 'basketry/no-http-delete-body',
      message: `HTTP DELETE method "${method.name.value}" must not define a body parameter.`,
      range: decodeRange(parameter.loc),
      severity: parseSeverity(options?.severity),
      sourcePath: service.sourcePath,
      link: 'https://github.com/basketry/rules#no-http-delete-body',
    };
  },
);

export default noHttpDeleteBodyRule;
