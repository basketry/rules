import { decodeRange, typeRule } from 'basketry';
import { parseSeverity } from './utils';

const noMixedProperties = typeRule(({ service, type, options }) => {
  const { mapProperties } = type;
  if (!mapProperties) return;

  const { range, sourceIndex } = decodeRange(type.name.loc ?? type.loc);

  if (type.properties.length) {
    return {
      code: 'basketry/no-mixed-properties',
      message:
        'Types may not have mixed properties. Choose between defined properties or a map.',
      range,
      severity: parseSeverity(options?.severity, 'error'),
      sourcePath: service.sourcePaths[sourceIndex],
    };
  }

  return;
});

export default noMixedProperties;
