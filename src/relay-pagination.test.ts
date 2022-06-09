import { Parameter, Service, Violation } from 'basketry';
import * as build from './test-utils';
import relayPaginationRule from './relay-pagination';

describe('basketry/relay-pagination', () => {
  it('returns an empty array on an empty service', () => {
    // ARRANGE
    const ir: Service = build.service({ interfaces: [] });

    // ACT
    const violations = relayPaginationRule(ir, 'test.ext');

    // ASSERT
    expect(violations).toEqual<Violation[]>([]);
  });

  describe('when the return type is a non-envelope object', () => {
    const returnType = build.returnType({
      typeName: { value: 'widget' },
      isArray: false,
      isPrimitive: false,
    });
    const type = build.type({
      properties: [build.property({ name: { value: 'id' } })],
    });

    it('returns an empty array if paging parameters are not supplied', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          {
            name: 'interface',
            methods: [
              build.method({
                parameters: [],
                returnType,
              }),
            ],
            protocols: { http: [] },
          },
        ],
        types: [type],
      });

      // ACT
      const violations = relayPaginationRule(ir, 'test.ext');

      // ASSERT
      expect(violations).toEqual([]);
    });
  });

  describe('when the return type is an array', () => {
    const returnType = build.returnType({
      typeName: { value: 'widget' },
      isArray: true,
      isPrimitive: false,
    });
    const type = build.type({
      properties: [build.property({ name: { value: 'id' } })],
    });

    it('returns a violation even if paging parameters are supplied', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          {
            name: 'interface',
            methods: [
              build.method({
                parameters: paginationParams(),
                returnType,
              }),
            ],
            protocols: { http: [] },
          },
        ],
        types: [type],
      });

      // ACT
      const violations = relayPaginationRule(ir, 'test.ext');

      // ASSERT
      expect(violations).toEqual([violation()]);
    });

    it('returns a violation if paging parameters are not supplied', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          {
            name: 'interface',
            methods: [
              build.method({
                parameters: [],
                returnType,
              }),
            ],
            protocols: { http: [] },
          },
        ],
        types: [type],
      });

      // ACT
      const violations = relayPaginationRule(ir, 'test.ext');

      // ASSERT
      expect(violations).toEqual([violation()]);
    });
  });

  describe('when the return type is an array envelope', () => {
    const returnType = build.returnType({
      typeName: { value: 'envelope' },
      isArray: false,
      isPrimitive: false,
    });
    const pageInfo = build.type({
      name: { value: 'pageInfo' },
      properties: [
        build.property({
          name: { value: 'hasPreviousPage' },
          typeName: { value: 'boolean' },
          isPrimitive: true,
        }),
        build.property({
          name: { value: 'hasNextPage' },
          typeName: { value: 'boolean' },
          isPrimitive: true,
        }),
        build.property({
          name: { value: 'startCursor' },
          typeName: { value: 'string' },
          isPrimitive: true,
        }),
        build.property({
          name: { value: 'endCursor' },
          typeName: { value: 'string' },
          isPrimitive: true,
        }),
      ],
    });
    const envelope = build.envelope({
      isArray: true,
      extraProperties: [
        build.property({
          name: { value: 'pageInfo' },
          typeName: { value: 'pageInfo' },
          isPrimitive: false,
        }),
      ],
    });

    it('returns an empty array if paging parameters are supplied and page info is returned', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          {
            name: 'interface',
            methods: [
              build.method({
                parameters: paginationParams(),
                returnType,
              }),
            ],
            protocols: { http: [] },
          },
        ],
        types: [envelope, pageInfo],
      });

      // ACT
      const violations = relayPaginationRule(ir, 'test.ext');

      // ASSERT
      expect(violations).toEqual([]);
    });

    it('returns a violation if paging parameters are not supplied', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          {
            name: 'interface',
            methods: [
              build.method({
                parameters: [],
                returnType,
              }),
            ],
            protocols: { http: [] },
          },
        ],
        types: [envelope],
      });

      // ACT
      const violations = relayPaginationRule(ir, 'test.ext');

      // ASSERT
      expect(violations).toEqual([violation()]);
    });
  });

  describe('when the return type is a non-array envelope', () => {
    const returnType = build.returnType({
      typeName: { value: 'envelope' },
      isArray: false,
      isPrimitive: false,
    });
    const envelope = build.envelope({ isArray: false });

    it('returns an empty array if paging parameters are not supplied', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          {
            name: 'interface',
            methods: [
              build.method({
                parameters: [],
                returnType,
              }),
            ],
            protocols: { http: [] },
          },
        ],
        types: [envelope],
      });

      // ACT
      const violations = relayPaginationRule(ir, 'test.ext');

      // ASSERT
      expect(violations).toEqual([]);
    });
  });
});

const paginationParams = (): Parameter[] => [
  build.parameter({
    name: { value: 'first' },
    typeName: { value: 'integer' },
    isArray: false,
  }),
  build.parameter({
    name: { value: 'after' },
    typeName: { value: 'string' },
    isArray: false,
  }),
  build.parameter({
    name: { value: 'last' },
    typeName: { value: 'integer' },
    isArray: false,
  }),
  build.parameter({
    name: { value: 'before' },
    typeName: { value: 'string' },
    isArray: false,
  }),
];

const violation = (): Violation => ({
  code: 'basketry/relay-pagination',
  message:
    'Method "method" must define optional relay pagination parameters and return a "page info" object.',
  range: {
    end: {
      column: 1,
      line: 1,
      offset: 0,
    },
    start: {
      column: 1,
      line: 1,
      offset: 0,
    },
  },
  severity: 'error',
  sourcePath: 'test.ext',
});
