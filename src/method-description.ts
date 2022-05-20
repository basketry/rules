import { decodeRange, methodRule } from 'basketry';
import { parseSeverity } from './utils';

const methodDescriptionRule = methodRule(({ method, sourcePath, options }) => {
  if (!method.description) {
    return {
      code: 'basketry/method-description',
      message: `Method "${method.name.value}" is required to have a description.`,
      range: decodeRange(method.loc),
      severity: parseSeverity(options?.severity),
      sourcePath,
    };
  }

  return undefined;
});

export default methodDescriptionRule;
