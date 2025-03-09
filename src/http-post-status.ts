import { decodeRange, methodRule } from 'basketry';
import { parseSeverity } from './utils';

const allowedCodes = new Set([200, 201, 202, 204]);

const httpPostStatusRule = methodRule(({ service, httpMethod, options }) => {
  if (!httpMethod) return;

  if (
    httpMethod.verb.value === 'post' &&
    !allowedCodes.has(httpMethod.successCode.value)
  ) {
    const { range, sourceIndex } = decodeRange(
      httpMethod.successCode.loc || httpMethod.loc,
    );
    return {
      code: 'basketry/http-post-status',
      message: `HTTP status code for POST method "${
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

export default httpPostStatusRule;
