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

const link = 'https://github.com/basketry/rules#casing';

const casingRule: Rule = (service, options) => {
  const violations: Violation[] = [];

  if (options?.enum) {
    for (const {
      enum: { name },
    } of allEnums(service, options)) {
      const casing = parseCasing(options?.enum);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        violations.push({
          code: 'basketry/enum-casing',
          message: `Enum name "${name.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(name.loc),
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePath,
          link,
        });
      }
    }
  }

  if (options?.enumValue) {
    for (const { value } of allEnumValues(service, options)) {
      const casing = parseCasing(options?.enumValue);
      const correct = applyCasing(value.content.value, casing);
      if (value.content.value !== correct) {
        violations.push({
          code: 'basketry/enum-value-casing',
          message: `Enum value "${value.content.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(value.loc),
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePath,
          link,
        });
      }
    }
  }

  if (options?.path) {
    for (const {
      httpPath: { path },
    } of allHttpPaths(service, options)) {
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
            sourcePath: service.sourcePath,
            link,
          });
        }
      }
    }
  }

  if (options?.method) {
    for (const {
      method: { name },
    } of allMethods(service, options)) {
      const casing = parseCasing(options?.method);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        violations.push({
          code: 'basketry/method-casing',
          message: `Method name "${name.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(name.loc),
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePath,
          link,
        });
      }
    }
  }

  if (options?.parameter) {
    for (const {
      parameter: { name },
      httpParameter,
    } of allParameters(service, options)) {
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
          sourcePath: service.sourcePath,
          link,
        });
      }
    }
  }

  if (options?.header) {
    for (const {
      parameter: { name },
      httpParameter,
    } of allParameters(service, options)) {
      if (httpParameter?.in?.value !== 'header') continue;

      const casing = parseCasing(options?.header);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        violations.push({
          code: 'basketry/header-casing',
          message: `Header name "${name.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(name.loc),
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePath,
          link,
        });
      }
    }
  }

  if (options?.query) {
    for (const {
      parameter: { name },
      httpParameter,
    } of allParameters(service, options)) {
      if (httpParameter?.in?.value !== 'query') continue;

      const casing = parseCasing(options?.query);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        violations.push({
          code: 'basketry/query-casing',
          message: `Query parameter "${name.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(name.loc),
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePath,
          link,
        });
      }
    }
  }

  if (options?.property) {
    for (const {
      property: { name },
    } of allProperties(service, options)) {
      const casing = parseCasing(options?.property);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        violations.push({
          code: 'basketry/property-casing',
          message: `Property name "${name.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(name.loc),
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePath,
          link,
        });
      }
    }

    for (const type of service.types) {
      if (!type.mapProperties?.requiredKeys.length) continue;

      for (const requiredKey of type.mapProperties.requiredKeys) {
        const casing = parseCasing(options?.property);
        const correct = applyCasing(requiredKey.value, casing);
        if (requiredKey.value !== correct) {
          violations.push({
            code: 'basketry/property-casing',
            message: `Property name "${requiredKey.value}" must be ${casing} cased: "${correct}"`,
            range: decodeRange(requiredKey.loc),
            severity: parseSeverity(options?.severity),
            sourcePath: service.sourcePath,
            link,
          });
        }
      }
    }
  }

  if (options?.type) {
    for (const {
      type: { name },
    } of allTypes(service, options)) {
      const casing = parseCasing(options?.type);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        violations.push({
          code: 'basketry/type-casing',
          message: `Type name "${name.value}" must be ${casing} cased: "${correct}"`,
          range: decodeRange(name.loc),
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePath,
          link,
        });
      }
    }
  }

  return violations;
};

export default casingRule;
