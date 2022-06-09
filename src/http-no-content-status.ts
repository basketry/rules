import { decodeRange, methodRule } from 'basketry';
import { parseSeverity } from './utils';

const httpNoContentStatusRule = methodRule(
  ({ httpMethod, method, sourcePath, options }) => {
    if (!httpMethod) return;

    if (!method.returnType && httpMethod.successCode.value !== 204) {
      return {
        code: 'basketry/http-no-content-status',
        message: `Method "${httpMethod.name.value}" does not have a return type and must return an HTTP status code of 204.`,
        range: decodeRange(httpMethod.successCode.loc || httpMethod.loc),
        severity: parseSeverity(options?.severity),
        sourcePath,
      };
    } else if (method.returnType && httpMethod.successCode.value === 204) {
      return {
        code: 'basketry/http-no-content-status',
        message: `Method "${httpMethod.name.value}" has a return type and must not return an HTTP status code of 204.`,
        range: decodeRange(httpMethod.successCode.loc || httpMethod.loc),
        severity: parseSeverity(options?.severity),
        sourcePath,
        link: 'https://github.com/basketry/rules#http-status-codes',
      };
    }

    return undefined;
  },
);

export default httpNoContentStatusRule;
