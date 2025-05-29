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

    if (mapProperties.key.value.isArray) {
      const { range, sourceIndex } = decodeRange(
        mapProperties.key.loc ?? mapProperties.loc ?? type.name.loc ?? type.loc,
      );
      violations.push({
        code: 'basketry/string-map-key',
        message: `Map key must not be an array.`,
        range,
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePaths[sourceIndex],
      });
    }

    if (
      mapProperties.key.value.kind === 'ComplexValue' ||
      mapProperties.key.value.typeName.value !== 'string'
    ) {
      const { range, sourceIndex } = decodeRange(
        mapProperties.key.loc ?? mapProperties.loc ?? type.name.loc ?? type.loc,
      );
      violations.push({
        code: 'basketry/string-map-key',
        message: `Map keys must be a string.`,
        range,
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePaths[sourceIndex],
      });
    }
  }

  return violations;
};

export default stringMapKeys;
