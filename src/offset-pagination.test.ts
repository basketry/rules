import { Parameter, Service, Violation } from 'basketry';
import * as build from './test-utils';
import offsetPaginationRule from './offset-pagination';

const name = { value: 'someMethod' };

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
                name,
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
      isPrimitive: false,
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
                name,
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
                name,
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
      isPrimitive: false,
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
                name,
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
                name,
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
                name,
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

  describe('when an allow list is supplied', () => {
    const options = {
      allow: [name.value],
    };

    const returnType = build.returnType({
      typeName: { value: 'envelope' },
      isArray: false,
      isPrimitive: false,
    });
    const envelope = build.envelope({
      isArray: true,
    });

    it('returns a violation if an unpaged method is in the allow list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          {
            name: 'interface',
            methods: [
              build.method({
                name,
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
      const violations = offsetPaginationRule(ir, 'test.ext', options);

      // ASSERT
      expect(violations).toEqual([violation()]);
    });

    it('returns an empty array if a paged method is in the allow list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          {
            name: 'interface',
            methods: [
              build.method({
                name,
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
      const violations = offsetPaginationRule(ir, 'test.ext', options);

      // ASSERT
      expect(violations).toEqual([]);
    });

    it('returns an empty array if an unpaged method is not in the allow list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          {
            name: 'interface',
            methods: [
              build.method({
                name,
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
      const violations = offsetPaginationRule(ir, 'test.ext', {
        allow: ['some_other_method_name'],
      });

      // ASSERT
      expect(violations).toEqual([]);
    });
  });

  describe('when a deny list is supplied', () => {
    const options = {
      deny: [name.value],
    };

    const returnType = build.returnType({
      typeName: { value: 'envelope' },
      isArray: false,
      isPrimitive: false,
    });
    const envelope = build.envelope({
      isArray: true,
    });

    it('returns an empty array if an unpaged method is in the deny list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          {
            name: 'interface',
            methods: [
              build.method({
                name,
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
      const violations = offsetPaginationRule(ir, 'test.ext', options);

      // ASSERT
      expect(violations).toEqual([]);
    });

    it('returns an empty array if a paged method is in the deny list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          {
            name: 'interface',
            methods: [
              build.method({
                name,
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
      const violations = offsetPaginationRule(ir, 'test.ext', options);

      // ASSERT
      expect(violations).toEqual([]);
    });

    it('returns a violation if an unpaged method is not in the deny list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          {
            name: 'interface',
            methods: [
              build.method({
                name,
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
      const violations = offsetPaginationRule(ir, 'test.ext', {
        deny: ['some_other_method_name'],
      });

      // ASSERT
      expect(violations).toEqual([violation()]);
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
  message: `Method "${name.value}" must define optional integer offset and limit parameters.`,
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
  link: 'https://github.com/basketry/rules#pagination',
});
