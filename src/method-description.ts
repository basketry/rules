import { decodeRange, methodRule } from 'basketry';
import { parseSeverity } from './utils';

const methodDescriptionRule = methodRule(({ service, method, options }) => {
  if (!method.description) {
    const { range, sourceIndex } = decodeRange(method.loc);
    return {
      code: 'basketry/method-description',
      message: `Method "${method.name.value}" is required to have a description.`,
      range,
      severity: parseSeverity(options?.severity),
      sourcePath: service.sourcePaths[sourceIndex],
      link: 'https://github.com/basketry/rules#descriptions',
    };
  }

  return undefined;
});

export default methodDescriptionRule;
