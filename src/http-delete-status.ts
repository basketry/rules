import { decodeRange, methodRule } from 'basketry';
import { parseSeverity } from './utils';

const allowedCodes = new Set([200, 202, 204]);

const httpDeleteStatusRule = methodRule(
  ({ httpMethod, sourcePath, options }) => {
    if (!httpMethod) return;

    if (
      httpMethod.verb.value === 'delete' &&
      !allowedCodes.has(httpMethod.successCode.value)
    ) {
      return {
        code: 'basketry/http-delete-status',
        message: `HTTP status code for DELETE method "${
          httpMethod.name.value
        }" must be one of the following: ${Array.from(allowedCodes).join(
          ', ',
        )}.`,
        range: decodeRange(httpMethod.successCode.loc || httpMethod.loc),
        severity: parseSeverity(options?.severity),
        sourcePath,
      };
    }

    return;
  },
);

export default httpDeleteStatusRule;
