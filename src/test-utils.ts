import {
  ComplexValue,
  IntegerLiteral,
  Interface,
  MemberValue,
  Method,
  Parameter,
  Primitive,
  PrimitiveLiteral,
  PrimitiveValue,
  Property,
  ReturnValue,
  Service,
  StringLiteral,
  TrueLiteral,
  Type,
} from 'basketry';

export function stringLiteral(value: string): StringLiteral {
  return { kind: 'StringLiteral', value };
}

export function integerLiteral(value: number): IntegerLiteral {
  return { kind: 'IntegerLiteral', value };
}

export function primitiveLiteral(value: Primitive): PrimitiveLiteral {
  return { kind: 'PrimitiveLiteral', value };
}

export function trueLiteral(value: boolean): TrueLiteral | undefined {
  return value ? { kind: 'TrueLiteral', value: true } : undefined;
}

export function envelope({
  isArray,
  payload = 'data',
  extraProperties,
}: {
  isArray: boolean;
  payload?: string;
  extraProperties?: Property[];
}): Type {
  return type({
    name: stringLiteral('envelope'),
    properties: [
      property({
        name: stringLiteral('errors'),
        value: complexValue({
          typeName: stringLiteral('error'),
          isArray: trueLiteral(true),
        }),
      }),
      property({
        name: stringLiteral(payload),
        value: complexValue({
          typeName: stringLiteral('widget'),
          isArray: trueLiteral(isArray),
        }),
      }),
      ...(extraProperties || []),
    ],
  });
}

export function method(defaults: Partial<Method> = {}): Method {
  return {
    kind: 'Method',
    name: stringLiteral('method'),
    security: [],
    returns: undefined,
    parameters: [],
    loc: '1;1;0',
    ...defaults,
  };
}

export function int(defaults: Partial<Interface> = {}): Interface {
  return {
    kind: 'Interface',
    name: stringLiteral('interface'),
    methods: [],
    ...defaults,
  };
}

export function type(defaults: Partial<Type> = {}): Type {
  return {
    kind: 'Type',
    name: stringLiteral('type'),
    properties: [],
    rules: [],
    loc: '1;1;0',
    ...defaults,
  };
}

export function primitiveValue(
  defaults: Partial<PrimitiveValue> = {},
): PrimitiveValue {
  return {
    kind: 'PrimitiveValue',
    typeName: primitiveLiteral('string'),
    rules: [],
    ...defaults,
  };
}

export function complexValue(
  defaults: Partial<ComplexValue> = {},
): ComplexValue {
  return {
    kind: 'ComplexValue',
    typeName: stringLiteral('type'),
    rules: [],
    ...defaults,
  };
}

export function returnValue(defaults: Partial<ReturnValue> = {}): ReturnValue {
  return {
    kind: 'ReturnValue',
    value: primitiveValue(),
    loc: '1;1;0',
    ...defaults,
  };
}

export function property(defaults: Partial<Property> = {}): Property {
  return {
    kind: 'Property',
    name: stringLiteral('prop'),
    value: primitiveValue(),
    loc: '1;1;0',
    ...defaults,
  };
}

export function parameter(defaults: Partial<Parameter> = {}): Parameter {
  return {
    kind: 'Parameter',
    name: stringLiteral('param'),
    value: primitiveValue(),
    loc: '1;1;0',
    ...defaults,
  };
}

export function service(defaults: Partial<Service> = {}): Service {
  return {
    kind: 'Service',
    basketry: '0.2',
    title: stringLiteral('test'),
    majorVersion: { kind: 'IntegerLiteral', value: 1 },
    sourcePaths: ['test.ext'],
    interfaces: [],
    types: [],
    enums: [],
    unions: [],
    loc: '1;1;0',
    ...defaults,
  };
}
