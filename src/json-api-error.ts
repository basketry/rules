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
    const { range, sourceIndex } = decodeRange(service.loc);
    violations.push({
      code,
      message: 'Service must define an `error` type.',
      severity,
      sourcePath: service.sourcePaths[sourceIndex],
      range,
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
      if (opt?.required && !isRequired(prop.value)) {
        const { range, sourceIndex } = decodeRange(prop.name.loc ?? prop.loc);
        violations.push({
          code,
          message: `Property \`${path}\` must be required.`,
          severity,
          sourcePath: service.sourcePaths[sourceIndex],
          range,
          link,
        });
      } else if (prop.value.isArray && !opt?.allowArray) {
        const { range, sourceIndex } = decodeRange(
          prop.value.isArray.loc ?? prop.name.loc ?? prop.loc,
        );
        violations.push({
          code,
          message: `Property \`${path}\` must not be an array.`,
          severity,
          sourcePath: service.sourcePaths[sourceIndex],
          range,
          link,
        });
      } else {
        const isString =
          prop.value.kind === 'PrimitiveValue' &&
          prop.value.typeName.value === 'string';
        const isNumeric =
          prop.value.kind === 'PrimitiveValue' &&
          (prop.value.typeName.value === 'double' ||
            prop.value.typeName.value === 'float' ||
            prop.value.typeName.value === 'integer' ||
            prop.value.typeName.value === 'long' ||
            prop.value.typeName.value === 'number');
        if (isString) return;
        if (isNumeric && opt?.allowNumeric) return;
        const isEnum = !!getEnumByName(service, prop.value.typeName.value);
        if (isEnum && opt?.allowEnums) return;

        const { range, sourceIndex } = decodeRange(
          prop.value.typeName.loc ?? prop.name.loc ?? prop.loc,
        );
        violations.push({
          code,
          message: `Property \`${path}\` must be a string${
            opt?.allowEnums ? ' or enum' : ''
          }${opt?.allowNumeric ? ' or numeric type' : ''}.`,
          severity,
          sourcePath: service.sourcePaths[sourceIndex],
          range,
          link,
        });
      }
    } else if (opt?.required) {
      const { range, sourceIndex } = decodeRange(type.name.loc ?? type.loc);
      violations.push({
        code,
        message: `Property \`${path}\` must be defined.`,
        severity,
        sourcePath: service.sourcePaths[sourceIndex],
        range,
        link,
      });
    }
  }

  function getSubType(type: Type | undefined, prop: string): Type | undefined {
    if (!type) return undefined;
    return getTypeByName(
      service,
      type?.properties.find((p) => snake(p.name.value) === snake(prop))?.value
        .typeName.value,
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

      currentType = getTypeByName(service, prop.value.typeName.value);
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

    if (lnk.value.kind === 'PrimitiveValue') {
      if (lnk.value.typeName.value !== 'string') {
        const { range, sourceIndex } = decodeRange(
          lnk.value.typeName.loc ?? lnk.name.loc ?? lnk.loc,
        );
        violations.push({
          code,
          message: `Property \`${lnk.name.value}\` must be a string or an object.`,
          severity,
          sourcePath: service.sourcePaths[sourceIndex],
          range,
          link,
        });
      }
    } else {
      const type = getTypeByName(service, lnk.value.typeName.value);
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
        const { range, sourceIndex } = decodeRange(prop.name.loc ?? prop.loc);

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
          sourcePath: service.sourcePaths[sourceIndex],
          range,
          link,
        });
      }
    }
  }

  return violations;
};

export default jsonApiErrorRule;
