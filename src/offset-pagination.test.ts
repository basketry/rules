import { Parameter, Service, Violation } from 'basketry';
import * as build from './test-utils';
import offsetPaginationRule from './offset-pagination';

const name = build.stringLiteral('someMethod');

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
    const returns = build.returnValue({
      value: build.complexValue({
        typeName: build.stringLiteral('widget'),
      }),
    });
    const type = build.type({
      properties: [build.property({ name: build.stringLiteral('id') })],
    });

    it('returns an empty array if paging parameters are not supplied', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          build.int({
            name: build.stringLiteral('interface'),
            methods: [
              build.method({
                name,
                parameters: [],
                returns,
              }),
            ],
          }),
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
    const returns = build.returnValue({
      value: build.complexValue({
        typeName: build.stringLiteral('widget'),
        isArray: build.trueLiteral(true),
      }),
    });
    const type = build.type({
      properties: [build.property({ name: build.stringLiteral('id') })],
    });

    it('returns an empty array if paging parameters are supplied', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          build.int({
            name: build.stringLiteral('interface'),
            methods: [
              build.method({
                name,
                parameters: paginationParams(),
                returns,
              }),
            ],
          }),
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
          build.int({
            name: build.stringLiteral('interface'),
            methods: [
              build.method({
                name,
                parameters: [],
                returns,
              }),
            ],
          }),
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
    const envelope = build.envelope({ isArray: true });
    const returns = build.returnValue({
      value: build.complexValue({
        typeName: envelope.name,
      }),
    });

    it('returns an empty array if paging parameters are supplied', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          build.int({
            name: build.stringLiteral('interface'),
            methods: [
              build.method({
                name,
                parameters: paginationParams(),
                returns,
              }),
            ],
          }),
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
          build.int({
            name: build.stringLiteral('interface'),
            methods: [
              build.method({
                name,
                parameters: [],
                returns,
              }),
            ],
          }),
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
    const envelope = build.envelope({ isArray: false });
    const returns = build.returnValue({
      value: build.complexValue({
        typeName: envelope.name,
      }),
    });

    it('returns an empty array if paging parameters are not supplied', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          build.int({
            name: build.stringLiteral('interface'),
            methods: [
              build.method({
                name,
                parameters: [],
                returns,
              }),
            ],
          }),
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

    const envelope = build.envelope({ isArray: true });
    const returns = build.returnValue({
      value: build.complexValue({
        typeName: envelope.name,
      }),
    });

    it('returns a violation if an unpaged method is in the allow list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          build.int({
            name: build.stringLiteral('interface'),
            methods: [
              build.method({
                name,
                parameters: [],
                returns,
              }),
            ],
          }),
        ],
        types: [envelope],
      });

      // ACT
      const violations = offsetPaginationRule(ir, options);

      // ASSERT
      expect(violations).toEqual([violation()]);
    });

    it('returns an empty array if a paged method is in the allow list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          build.int({
            name: build.stringLiteral('interface'),
            methods: [
              build.method({
                name,
                parameters: paginationParams(),
                returns,
              }),
            ],
          }),
        ],
        types: [envelope],
      });

      // ACT
      const violations = offsetPaginationRule(ir, options);

      // ASSERT
      expect(violations).toEqual([]);
    });

    it('returns an empty array if an unpaged method is not in the allow list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          build.int({
            name: build.stringLiteral('interface'),
            methods: [
              build.method({
                name,
                parameters: [],
                returns,
              }),
            ],
          }),
        ],
        types: [envelope],
      });

      // ACT
      const violations = offsetPaginationRule(ir, {
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

    const envelope = build.envelope({ isArray: true });
    const returns = build.returnValue({
      value: build.complexValue({
        typeName: envelope.name,
      }),
    });

    it('returns an empty array if an unpaged method is in the deny list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          build.int({
            name: build.stringLiteral('interface'),
            methods: [
              build.method({
                name,
                parameters: [],
                returns,
              }),
            ],
          }),
        ],
        types: [envelope],
      });

      // ACT
      const violations = offsetPaginationRule(ir, options);

      // ASSERT
      expect(violations).toEqual([]);
    });

    it('returns an empty array if a paged method is in the deny list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          build.int({
            name: build.stringLiteral('interface'),
            methods: [
              build.method({
                name,
                parameters: paginationParams(),
                returns,
              }),
            ],
          }),
        ],
        types: [envelope],
      });

      // ACT
      const violations = offsetPaginationRule(ir, options);

      // ASSERT
      expect(violations).toEqual([]);
    });

    it('returns a violation if an unpaged method is not in the deny list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [
          build.int({
            name: build.stringLiteral('interface'),
            methods: [
              build.method({
                name,
                parameters: [],
                returns,
              }),
            ],
          }),
        ],
        types: [envelope],
      });

      // ACT
      const violations = offsetPaginationRule(ir, {
        deny: ['some_other_method_name'],
      });

      // ASSERT
      expect(violations).toEqual([violation()]);
    });
  });
});

const paginationParams = (): Parameter[] => [
  build.parameter({
    name: build.stringLiteral('offset'),
    value: build.primitiveValue({
      typeName: build.primitiveLiteral('integer'),
    }),
  }),
  build.parameter({
    name: build.stringLiteral('limit'),
    value: build.primitiveValue({
      typeName: build.primitiveLiteral('integer'),
    }),
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
