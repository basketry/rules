import { decodeRange, methodRule } from 'basketry';
import { parseSeverity } from './utils';

const allowedCodes = new Set([200, 202, 204]);

const httpDeleteStatusRule = methodRule(({ service, httpMethod, options }) => {
  if (!httpMethod) return;

  if (
    httpMethod.verb.value === 'delete' &&
    !allowedCodes.has(httpMethod.successCode.value)
  ) {
    const { range, sourceIndex } = decodeRange(
      httpMethod.successCode.loc || httpMethod.loc,
    );
    return {
      code: 'basketry/http-delete-status',
      message: `HTTP status code for DELETE method "${
        httpMethod.name.value
      }" must be one of the following: ${Array.from(allowedCodes).join(', ')}.`,
      range,
      severity: parseSeverity(options?.severity),
      sourcePath: service.sourcePaths[sourceIndex],
      link: 'https://github.com/basketry/rules#http-status-codes',
    };
  }

  return;
});

export default httpDeleteStatusRule;
