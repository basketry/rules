import { decodeRange, typeRule } from 'basketry';
import { parseSeverity } from './utils';

const noFreeFormObjects = typeRule(({ service, type, options }) => {
  const { mapProperties } = type;
  if (!mapProperties) return;

  if (
    mapProperties.value.value.kind === 'PrimitiveValue' &&
    mapProperties.value.value.typeName.value === 'untyped'
  ) {
    const { range, sourceIndex } = decodeRange(
      mapProperties.value.loc ?? mapProperties.loc ?? type.name.loc ?? type.loc,
    );

    return {
      code: 'basketry/no-free-form-objects',
      message: 'Map type must explicitly define a value schema.',
      range,
      severity: parseSeverity(options?.severity, 'error'),
      sourcePath: service.sourcePaths[sourceIndex],
    };
  }

  return;
});

export default noFreeFormObjects;
