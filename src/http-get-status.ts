import { decodeRange, methodRule } from 'basketry';
import { parseSeverity } from './utils';

const allowedCodes = new Set([200, 204, 206]);

const httpGetStatusRule = methodRule(({ service, httpMethod, options }) => {
  if (!httpMethod) return;

  if (
    httpMethod.verb.value === 'get' &&
    !allowedCodes.has(httpMethod.successCode.value)
  ) {
    return {
      code: 'basketry/http-get-status',
      message: `HTTP status code for GET method "${
        httpMethod.name.value
      }" must be one of the following: ${Array.from(allowedCodes).join(', ')}.`,
      range: decodeRange(httpMethod.successCode.loc || httpMethod.loc),
      severity: parseSeverity(options?.severity),
      sourcePath: service.sourcePath,
      link: 'https://github.com/basketry/rules#http-status-codes',
    };
  }

  return undefined;
});

export default httpGetStatusRule;
