import { decodeRange, methodRule } from 'basketry';
import { parseSeverity } from './utils';

const httpNoContentStatusRule = methodRule(
  ({ service, httpMethod, method, options }) => {
    if (!httpMethod) return;

    if (!method.returns && httpMethod.successCode.value !== 204) {
      const { range, sourceIndex } = decodeRange(
        httpMethod.successCode.loc || httpMethod.loc,
      );
      return {
        code: 'basketry/http-no-content-status',
        message: `Method "${httpMethod.name.value}" does not have a return type and must return an HTTP status code of 204.`,
        range,
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePaths[sourceIndex],
      };
    } else if (method.returns && httpMethod.successCode.value === 204) {
      const { range, sourceIndex } = decodeRange(
        httpMethod.successCode.loc || httpMethod.loc,
      );
      return {
        code: 'basketry/http-no-content-status',
        message: `Method "${httpMethod.name.value}" has a return type and must not return an HTTP status code of 204.`,
        range,
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePaths[sourceIndex],
        link: 'https://github.com/basketry/rules#http-status-codes',
      };
    }

    return undefined;
  },
);

export default httpNoContentStatusRule;
