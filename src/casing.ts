import {
  allEnums,
  allEnumValues,
  allHttpPaths,
  allMethods,
  allParameters,
  allProperties,
  allTypes,
  decodeRange,
  Rule,
  Violation,
} from 'basketry';
import { applyCasing, parseCasing, parseSeverity } from './utils';

const casingRule: Rule = (service, sourcePath, options) => {
  const violations: Violation[] = [];

  if (options?.enum) {
    for (const {
      enum: { name },
    } of allEnums(service, sourcePath, options)) {
      const casing = parseCasing(options?.enum);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        violations.push({
          code: 'basketry/enum-casing',
          message: `Enum name "${name.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(name.loc),
          severity: parseSeverity(options?.severity),
          sourcePath,
        });
      }
    }
  }

  if (options?.enumValue) {
    for (const { value } of allEnumValues(service, sourcePath, options)) {
      const casing = parseCasing(options?.enumValue);
      const correct = applyCasing(value.value, casing);
      if (value.value !== correct) {
        violations.push({
          code: 'basketry/enum-value-casing',
          message: `Enum value "${value.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(value.loc),
          severity: parseSeverity(options?.severity),
          sourcePath,
        });
      }
    }
  }

  if (options?.path) {
    for (const {
      httpPath: { path },
    } of allHttpPaths(service, sourcePath, options)) {
      for (const segment of path.value.split('/')) {
        if (
          segment.startsWith(':') ||
          (segment.startsWith('{') && segment.endsWith('}'))
        ) {
          continue;
        }
        const casing = parseCasing(options?.path);
        const correct = applyCasing(segment, casing);
        if (segment !== correct) {
          violations.push({
            code: 'basketry/path-casing',
            message: `Path segment "${segment}" must be ${casing} cased: "${correct}"`,
            range: decodeRange(path.loc),
            severity: parseSeverity(options?.severity),
            sourcePath,
          });
        }
      }
    }
  }

  if (options?.method) {
    for (const {
      method: { name },
    } of allMethods(service, sourcePath, options)) {
      const casing = parseCasing(options?.method);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        violations.push({
          code: 'basketry/method-casing',
          message: `Method name "${name.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(name.loc),
          severity: parseSeverity(options?.severity),
          sourcePath,
        });
      }
    }
  }

  if (options?.parameter) {
    for (const {
      parameter: { name },
      httpParameter,
    } of allParameters(service, sourcePath, options)) {
      if (options?.header && httpParameter?.in?.value === 'header') continue;
      if (options?.query && httpParameter?.in?.value === 'query') continue;

      const casing = parseCasing(options?.parameter);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        violations.push({
          code: 'basketry/parameter-casing',
          message: `Parameter name "${name.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(name.loc),
          severity: parseSeverity(options?.severity),
          sourcePath,
        });
      }
    }
  }

  if (options?.header) {
    for (const {
      parameter: { name },
      httpParameter,
    } of allParameters(service, sourcePath, options)) {
      if (httpParameter?.in?.value !== 'header') continue;

      const casing = parseCasing(options?.header);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        violations.push({
          code: 'basketry/header-casing',
          message: `Header name "${name.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(name.loc),
          severity: parseSeverity(options?.severity),
          sourcePath,
        });
      }
    }
  }

  if (options?.query) {
    for (const {
      parameter: { name },
      httpParameter,
    } of allParameters(service, sourcePath, options)) {
      if (httpParameter?.in?.value !== 'query') continue;

      const casing = parseCasing(options?.query);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        violations.push({
          code: 'basketry/query-casing',
          message: `Query parameter "${name.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(name.loc),
          severity: parseSeverity(options?.severity),
          sourcePath,
        });
      }
    }
  }

  if (options?.property) {
    for (const {
      property: { name },
    } of allProperties(service, sourcePath, options)) {
      const casing = parseCasing(options?.property);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        violations.push({
          code: 'basketry/property-casing',
          message: `Property name "${name.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(name.loc),
          severity: parseSeverity(options?.severity),
          sourcePath,
        });
      }
    }
  }

  if (options?.type) {
    for (const {
      type: { name },
    } of allTypes(service, sourcePath, options)) {
      const casing = parseCasing(options?.type);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        violations.push({
          code: 'basketry/type-casing',
          message: `Type name "${name.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(name.loc),
          severity: parseSeverity(options?.severity),
          sourcePath,
        });
      }
    }
  }

  return violations;
};

export default casingRule;
