import { decodeRange, methodRule } from 'basketry';
import { parseSeverity } from './utils';

const allowedCodes = new Set([200, 202, 204]);

const httpPatchStatusRule = methodRule(
  ({ httpMethod, sourcePath, options }) => {
    if (!httpMethod) return;

    if (
      httpMethod.verb.value === 'patch' &&
      !allowedCodes.has(httpMethod.successCode.value)
    ) {
      return {
        code: 'basketry/http-patch-status',
        message: `HTTP status code for PATCH method "${
          httpMethod.name.value
        }" must be one of the following: ${Array.from(allowedCodes).join(
          ', ',
        )}.`,
        range: decodeRange(httpMethod.successCode.loc || httpMethod.loc),
        severity: parseSeverity(options?.severity),
        sourcePath,
      };
    }

    return undefined;
  },
);

export default httpPatchStatusRule;
