import {
  Method,
  Parameter,
  Property,
  ReturnType,
  Service,
  Type,
} from 'basketry';

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
    name: { value: 'envelope' },
    properties: [
      property({
        name: { value: 'errors' },
        isArray: true,
        isPrimitive: false,
      }),
      property({
        name: { value: payload },
        isArray,
        isPrimitive: false,
      }),
      ...(extraProperties || []),
    ],
  });
}

export function method(defaults: Partial<Method> = {}): Method {
  return {
    kind: 'Method',
    name: { value: 'method' },
    security: [],
    returnType: undefined,
    parameters: [],
    loc: '1;1;0',
    ...defaults,
  };
}

export function type(defaults: Partial<Type> = {}): Type {
  return {
    kind: 'Type',
    name: { value: 'type' },
    properties: [],
    rules: [],
    loc: '1;1;0',
    ...defaults,
  };
}

export function returnType(defaults: Partial<ReturnType> = {}): ReturnType {
  return {
    typeName: { value: 'string' },
    isArray: false,
    isPrimitive: true,
    rules: [],
    loc: '1;1;0',
    ...defaults,
  } as ReturnType;
}

export function property(defaults: Partial<Property> = {}): Property {
  return {
    name: { value: 'prop' },
    isArray: false,
    isPrimitive: true,
    rules: [],
    typeName: { value: 'string' },
    loc: '1;1;0',
    ...defaults,
  } as Property;
}

export function parameter(defaults: Partial<Parameter> = {}): Parameter {
  return {
    name: { value: 'param' },
    isArray: false,
    isPrimitive: true,
    rules: [],
    typeName: { value: 'string' },
    loc: '1;1;0',
    ...defaults,
  } as Parameter;
}

export function service(defaults: Partial<Service> = {}): Service {
  return {
    kind: 'Service',
    basketry: '1.1-rc',
    title: { value: 'test' },
    majorVersion: { value: 1 },
    sourcePath: 'test.ext',
    interfaces: [],
    types: [],
    enums: [],
    unions: [],
    loc: '1;1;0',
    ...defaults,
  };
}
