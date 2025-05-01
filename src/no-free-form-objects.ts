import { decodeRange, typeRule } from 'basketry';
import { parseSeverity } from './utils';

const noFreeFormObjects = typeRule(({ service, type, options }) => {
  const { mapProperties } = type;
  if (!mapProperties) return;

  if (
    mapProperties.value.isPrimitive &&
    mapProperties.value.typeName.value === 'untyped'
  ) {
    return {
      code: 'basketry/no-free-form-objects',
      message: 'Map type must explicitly define a value schema.',
      range: decodeRange(
        mapProperties.value.loc ??
          mapProperties.loc ??
          type.name.loc ??
          type.loc,
      ),
      severity: parseSeverity(options?.severity, 'error'),
      sourcePath: service.sourcePath,
    };
  }

  return;
});

export default noFreeFormObjects;
