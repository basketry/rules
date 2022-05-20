import { decodeRange, methodRule } from 'basketry';
import { parseSeverity } from './utils';

const allowedCodes = new Set([200, 201, 202, 204]);

const httpPutStatusRule = methodRule(({ httpMethod, sourcePath, options }) => {
  if (!httpMethod) return;

  if (
    httpMethod.verb.value === 'put' &&
    !allowedCodes.has(httpMethod.successCode.value)
  ) {
    return {
      code: 'basketry/http-put-status',
      message: `HTTP status code for PUT method "${
        httpMethod.name.value
      }" must be one of the following: ${Array.from(allowedCodes).join(', ')}.`,
      range: decodeRange(httpMethod.successCode.loc || httpMethod.loc),
      severity: parseSeverity(options?.severity),
      sourcePath,
    };
  }

  return undefined;
});

export default httpPutStatusRule;
