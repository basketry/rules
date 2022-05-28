import { Parameter, Service, Violation } from 'basketry';
import * as build from './test-utils';
import offsetPaginationRule from './offset-pagination';

describe('basketry/offset-pagination', () => {
  it('returns an empty array on an empty service', () => {
    // ARRANGE
    const ir: Service = build.service({ interfaces: [] });

    // ACT
    const violations = offsetPaginationRule(ir, 'test.ext');

    // ASSERT
    expect(violations).toEqual<Violation[]>([]);
  });

  describe('when the return type is a non-envelope object', () => {
    const returnType = build.returnType({
      typeName: { value: 'widget' },
      isArray: false,
      isLocal: true,
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
      const violations = offsetPaginationRule(ir, 'test.ext');

      // ASSERT
      expect(violations).toEqual([]);
    });
  });

  describe('when the return type is an array', () => {
    const returnType = build.returnType({
      typeName: { value: 'widget' },
      isArray: true,
      isLocal: true,
    });
    const type = build.type({
      properties: [build.property({ name: { value: 'id' } })],
    });

    it('returns an empty array if paging parameters are supplied', () => {
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
      const violations = offsetPaginationRule(ir, 'test.ext');

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
        types: [type],
      });

      // ACT
      const violations = offsetPaginationRule(ir, 'test.ext');

      // ASSERT
      expect(violations).toEqual([violation()]);
    });
  });

  describe('when the return type is an array envelope', () => {
    const returnType = build.returnType({
      typeName: { value: 'envelope' },
      isArray: false,
      isLocal: true,
    });
    const envelope = build.envelope({ isArray: true });

    it('returns an empty array if paging parameters are supplied', () => {
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
        types: [envelope],
      });

      // ACT
      const violations = offsetPaginationRule(ir, 'test.ext');

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
      const violations = offsetPaginationRule(ir, 'test.ext');

      // ASSERT
      expect(violations).toEqual([violation()]);
    });
  });

  describe('when the return type is a non-array envelope', () => {
    const returnType = build.returnType({
      typeName: { value: 'envelope' },
      isArray: false,
      isLocal: true,
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
      const violations = offsetPaginationRule(ir, 'test.ext');

      // ASSERT
      expect(violations).toEqual([]);
    });
  });
});

const paginationParams = (): Parameter[] => [
  build.parameter({
    name: { value: 'offset' },
    typeName: { value: 'integer' },
    isArray: false,
  }),
  build.parameter({
    name: { value: 'limit' },
    typeName: { value: 'integer' },
    isArray: false,
  }),
];

const violation = (): Violation => ({
  code: 'basketry/offset-pagination',
  message:
    'Method "method" must define optional integer offset and limit parameters.',
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
