import {
  decodeRange,
  getEnumByName,
  parseSeverity,
  Rule,
  Violation,
} from 'basketry';

const stringMapKeys: Rule = (service, options) => {
  const violations: Violation[] = [];

  for (const type of service.types) {
    const { mapProperties } = type;
    if (!mapProperties) continue;

    if (mapProperties.key.isArray) {
      violations.push({
        code: 'basketry/string-map-key',
        message: `Map key must not be an array.`,
        range: decodeRange(mapProperties.key.loc),
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePath,
      });
    }

    if (
      !mapProperties.key.isPrimitive ||
      mapProperties.key.typeName.value !== 'string'
    ) {
      violations.push({
        code: 'basketry/string-map-key',
        message: `Map keys must be a string.`,
        range: decodeRange(mapProperties.key.loc),
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePath,
      });
    }
  }

  return violations;
};

export default stringMapKeys;
