import { decodeRange, methodRule } from 'basketry';
import { snake } from 'case';
import { parseSeverity } from './utils';

const allowed = new Set(['value', 'values', 'data']);

const responseEnvelopeRule = methodRule(({ method, service, options }) => {
  if (!method.returns) return;
  const type = service.types.find(
    (t) => t.name.value === method.returns?.value.typeName.value,
  );

  const errors = type?.properties.find((p) => snake(p.name.value) === 'errors');

  const payload = type?.properties.find((p) =>
    parseAllowed(options?.payload).has(snake(p.name.value)),
  );

  if (!errors?.value.isArray || !payload) {
    const { range, sourceIndex } = decodeRange(method.returns.loc);
    return {
      code: 'basketry/response-envelope',
      message: `Method "${
        method.name.value
      }" must return an envelope with at least an errors array and payload property with one of the following names: ${getAllowed(
        options?.payload,
      ).join(', ')}.`,
      range,
      severity: parseSeverity(options?.severity),
      sourcePath: service.sourcePaths[sourceIndex],
      link: 'https://github.com/basketry/rules#response-envelopes',
    };
  }

  return undefined;
});

function parseAllowed(input: any): Set<string> {
  return new Set(getAllowed(input).map(snake));
}

function getAllowed(input: any): string[] {
  if (!input) return Array.from(allowed);
  return Array.isArray(input) ? input.map((x) => snake(`${x}`)) : [`${input}`];
}

export default responseEnvelopeRule;
