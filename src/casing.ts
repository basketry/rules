import {
  allEnums,
  allEnumMembers,
  allHttpRoutes,
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
        const { range, sourceIndex } = decodeRange(name.loc);
        violations.push({
          code: 'basketry/enum-casing',
          message: `Enum name "${name.value}" must be ${casing} cased: "${correct}"`,
          range,
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePaths[sourceIndex],
          link,
        });
      }
    }
  }

  if (options?.enumValue) {
    for (const { member } of allEnumMembers(service, options)) {
      const casing = parseCasing(options?.enumValue);
      const correct = applyCasing(member.content.value, casing);
      if (member.content.value !== correct) {
        const { range, sourceIndex } = decodeRange(member.loc);
        violations.push({
          code: 'basketry/enum-member-casing',
          message: `Enum member "${member.content.value}" must be ${casing} cased: "${correct}"`,
          range,
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePaths[sourceIndex],
          link,
        });
      }
    }
  }

  if (options?.path) {
    for (const {
      httpRoute: { pattern },
    } of allHttpRoutes(service, options)) {
      for (const segment of pattern.value.split('/')) {
        if (
          segment.startsWith(':') ||
          (segment.startsWith('{') && segment.endsWith('}'))
        ) {
          continue;
        }
        const casing = parseCasing(options?.path);
        const correct = applyCasing(segment, casing);
        if (segment !== correct) {
          const { range, sourceIndex } = decodeRange(pattern.loc);
          violations.push({
            code: 'basketry/route-casing',
            message: `Path segment "${segment}" must be ${casing} cased: "${correct}"`,
            range,
            severity: parseSeverity(options?.severity),
            sourcePath: service.sourcePaths[sourceIndex],
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
        const { range, sourceIndex } = decodeRange(name.loc);
        violations.push({
          code: 'basketry/method-casing',
          message: `Method name "${name.value}" must be ${casing} cased: "${correct}"`,
          range,
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePaths[sourceIndex],
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
      if (options?.header && httpParameter?.location?.value === 'header') {
        continue;
      }
      if (options?.query && httpParameter?.location?.value === 'query') {
        continue;
      }

      const casing = parseCasing(options?.parameter);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        const { range, sourceIndex } = decodeRange(name.loc);
        violations.push({
          code: 'basketry/parameter-casing',
          message: `Parameter name "${name.value}" must be ${casing} cased: "${correct}"`,
          range,
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePaths[sourceIndex],
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
      if (httpParameter?.location?.value !== 'header') continue;

      const casing = parseCasing(options?.header);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        const { range, sourceIndex } = decodeRange(name.loc);
        violations.push({
          code: 'basketry/header-casing',
          message: `Header name "${name.value}" must be ${casing} cased: "${correct}"`,
          range,
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePaths[sourceIndex],
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
      if (httpParameter?.location?.value !== 'query') continue;

      const casing = parseCasing(options?.query);
      const correct = applyCasing(name.value, casing);
      if (name.value !== correct) {
        const { range, sourceIndex } = decodeRange(name.loc);
        violations.push({
          code: 'basketry/query-casing',
          message: `Query parameter "${name.value}" must be ${casing} cased: "${correct}"`,
          range,
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePaths[sourceIndex],
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
        const { range, sourceIndex } = decodeRange(name.loc);
        violations.push({
          code: 'basketry/property-casing',
          message: `Property name "${name.value}" must be ${casing} cased: "${correct}"`,
          range,
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePaths[sourceIndex],
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
        const { range, sourceIndex } = decodeRange(name.loc);
        violations.push({
          code: 'basketry/type-casing',
          message: `Type name "${name.value}" must be ${casing} cased: "${correct}"`,
          range,
          severity: parseSeverity(options?.severity),
          sourcePath: service.sourcePaths[sourceIndex],
          link,
        });
      }
    }
  }

  return violations;
};

export default casingRule;
