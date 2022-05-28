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
}: {
  isArray: boolean;
  payload?: string;
}): Type {
  return type({
    name: { value: 'envelope' },
    properties: [
      property({
        name: { value: 'errors' },
        isArray: true,
      }),
      property({
        name: { value: payload },
        isArray,
      }),
    ],
  });
}

export function method(defaults: Partial<Method> = {}): Method {
  return {
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
    isLocal: false,
    isUnknown: false,
    rules: [],
    loc: '1;1;0',
    ...defaults,
  };
}

export function property(defaults: Partial<Property> = {}): Property {
  return {
    name: { value: 'prop' },
    isArray: false,
    isLocal: false,
    isUnknown: false,
    rules: [],
    typeName: { value: 'string' },
    loc: '1;1;0',
    ...defaults,
  };
}

export function parameter(defaults: Partial<Parameter> = {}): Parameter {
  return {
    name: { value: 'param' },
    isArray: false,
    isLocal: false,
    isUnknown: false,
    rules: [],
    typeName: { value: 'string' },
    loc: '1;1;0',
    ...defaults,
  };
}

export function service(defaults: Partial<Service> = {}): Service {
  return {
    basketry: '1',
    title: { value: 'test' },
    majorVersion: { value: 1 },
    interfaces: [],
    types: [],
    enums: [],
    loc: '1;1;0',
    ...defaults,
  };
}
