import {
  decodeRange,
  getEnumByName,
  getTypeByName,
  isRequired,
  Property,
  Rule,
  Type,
  Violation,
} from 'basketry';
import { snake } from 'case';
import { parseSeverity } from './utils';

const code = 'basketry/json-api-error';
const link = 'https://jsonapi.org/format/#error-objects';

const jsonApiErrorRule: Rule = (service, options) => {
  const severity = parseSeverity(options?.severity);

  const violations: Violation[] = [];
  const error = service.types.find(
    (type) => snake(type.name.value) === 'error',
  );
  if (!error) {
    violations.push({
      code,
      message: 'Service must define an `error` type.',
      severity,
      sourcePath: service.sourcePath,
      range: decodeRange(service.loc),
      link,
    });
    return violations;
  }

  function check(
    type: Type,
    path: string,
    opt?: {
      allowEnums?: boolean;
      allowArray?: boolean;
      required?: boolean;
      allowNumeric?: boolean;
    },
  ): void {
    const prop = getProperty(type, path);
    if (prop) {
      if (opt?.required && !isRequired(prop)) {
        violations.push({
          code,
          message: `Property \`${path}\` must be required.`,
          severity,
          sourcePath: service.sourcePath,
          range: decodeRange(prop.loc),
          link,
        });
        return;
      }

      if (prop.isArray && !opt?.allowArray) {
        violations.push({
          code,
          message: `Property \`${path}\` must not be an array.`,
          severity,
          sourcePath: service.sourcePath,
          range: decodeRange(prop.loc),
          link,
        });
        return;
      }

      const isString = prop.isPrimitive && prop.typeName.value === 'string';
      const isNumeric =
        prop.isPrimitive &&
        (prop.typeName.value === 'double' ||
          prop.typeName.value === 'float' ||
          prop.typeName.value === 'integer' ||
          prop.typeName.value === 'long' ||
          prop.typeName.value === 'number');
      if (isString) return;
      if (isNumeric && opt?.allowNumeric) return;
      const isEnum = !!getEnumByName(service, prop.typeName.value);
      if (isEnum && opt?.allowEnums) return;

      violations.push({
        code,
        message: `Property \`${path}\` must be a string${
          opt?.allowEnums ? ' or enum' : ''
        }${opt?.allowNumeric ? ' or numeric type' : ''}.`,
        severity,
        sourcePath: service.sourcePath,
        range: decodeRange(prop.typeName.loc),
        link,
      });
    } else if (opt?.required) {
      violations.push({
        code,
        message: `Property \`${path}\` must be defined.`,
        severity,
        sourcePath: service.sourcePath,
        range: decodeRange(type.loc),
        link,
      });
    }
  }

  function getSubType(type: Type | undefined, prop: string): Type | undefined {
    if (!type) return undefined;
    return getTypeByName(
      service,
      type?.properties.find((p) => snake(p.name.value) === snake(prop))
        ?.typeName.value,
    );
  }

  function getProperty(type: Type, name: string): Property | undefined {
    let currentType: Type | undefined = type;
    let prop: Property | undefined;
    for (const n of name.split('.')) {
      prop = currentType?.properties.find(
        (p) => snake(p.name.value) === snake(n),
      );
      if (!prop) return undefined;

      currentType = getTypeByName(service, prop.typeName.value);
    }
    return prop;
  }

  function checkError(err: Type): void {
    check(err, 'id');
    check(err, 'status', { allowNumeric: options?.strict === false });
    check(err, 'code', { allowEnums: options?.strict === false });
    check(err, 'title');
    check(err, 'detail');

    const links = getSubType(err, 'links');
    if (links) checkLinks(links);

    const source = getSubType(err, 'source');
    if (source) checkSource(source);

    restrict(err, [
      'id',
      'links',
      'status',
      'code',
      'title',
      'detail',
      'source',
      'meta',
    ]);
  }

  function checkSource(src: Type): void {
    check(src, 'pointer');
    check(src, 'parameter');
    check(src, 'header');

    restrict(src, ['pointer', 'parameter', 'header']);
  }

  function checkLinks(links: Type): void {
    checkLink(getProperty(links, 'about'));
    checkLink(getProperty(links, 'type'));

    restrict(links, ['about', 'type']);
  }

  function checkLink(lnk: Property | undefined): void {
    if (!lnk) return;

    if (lnk.isPrimitive) {
      if (lnk.typeName.value !== 'string') {
        violations.push({
          code,
          message: `Property \`${lnk.name.value}\` must be a string or an object.`,
          severity,
          sourcePath: service.sourcePath,
          range: decodeRange(lnk.typeName.loc),
          link,
        });
      }
    } else {
      const type = getTypeByName(service, lnk.typeName.value);
      if (!type) return;

      check(type, 'href', { required: true });
      check(type, 'rel');
      check(type, 'title');
      check(type, 'type');
      check(type, 'hreflang', { allowArray: true });

      checkLink(getProperty(type, 'describedby'));

      restrict(type, [
        'href',
        'rel',
        'describedby',
        'title',
        'type',
        'hreflang',
        'meta',
      ]);
    }
  }

  checkError(error);

  function restrict(type: Type, props: string[]): void {
    const knownProperties = new Set(props.map((p) => snake(p)));
    // Check for non-standard properties
    for (const prop of type.properties) {
      if (!knownProperties.has(snake(prop.name.value))) {
        violations.push({
          code,
          message: `Property \`${
            prop.name.value
          }\` is not allowed. Allowed properties are ${props
            .map((p) => `\`${p}\``)
            .join(
              ', ',
            )}. Define non-standard meta-information in \`error.meta\`.`,
          severity,
          sourcePath: service.sourcePath,
          range: decodeRange(prop.name.loc),
          link,
        });
      }
    }
  }

  return violations;
};

export default jsonApiErrorRule;
