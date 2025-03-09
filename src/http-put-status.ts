import { decodeRange, methodRule } from 'basketry';
import { parseSeverity } from './utils';

const allowedCodes = new Set([200, 201, 202, 204]);

const httpPutStatusRule = methodRule(({ service, httpMethod, options }) => {
  if (!httpMethod) return;

  if (
    httpMethod.verb.value === 'put' &&
    !allowedCodes.has(httpMethod.successCode.value)
  ) {
    const { range, sourceIndex } = decodeRange(
      httpMethod.successCode.loc || httpMethod.loc,
    );
    return {
      code: 'basketry/http-put-status',
      message: `HTTP status code for PUT method "${
        httpMethod.name.value
      }" must be one of the following: ${Array.from(allowedCodes).join(', ')}.`,
      range,
      severity: parseSeverity(options?.severity),
      sourcePath: service.sourcePaths[sourceIndex],
      link: 'https://github.com/basketry/rules#http-status-codes',
    };
  }

  return undefined;
});

export default httpPutStatusRule;
