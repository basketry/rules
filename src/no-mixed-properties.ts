import { decodeRange, typeRule } from 'basketry';
import { parseSeverity } from './utils';

const noMixedProperties = typeRule(({ service, type, options }) => {
  const { mapProperties } = type;
  if (!mapProperties) return;

  if (type.properties.length) {
    return {
      code: 'basketry/no-mixed-properties',
      message:
        'Types may not have mixed properties. Choose between defined properties or a map.',
      range: decodeRange(type.name.loc ?? type.loc),
      severity: parseSeverity(options?.severity, 'error'),
      sourcePath: service.sourcePath,
    };
  }

  return;
});

export default noMixedProperties;
