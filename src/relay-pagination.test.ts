import {
  Interface,
  Parameter,
  ReturnValue,
  Service,
  Violation,
} from 'basketry';
import * as build from './test-utils';
import relayPaginationRule from './relay-pagination';

const name = build.stringLiteral('someMethod');

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
        interfaces: [withoutPagination(returns)],
        types: [type],
      });

      // ACT
      const violations = relayPaginationRule(ir, 'test.ext');

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

    it('returns a violation even if paging parameters are supplied', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [withPagination(returns)],
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
        interfaces: [withoutPagination(returns)],
        types: [type],
      });

      // ACT
      const violations = relayPaginationRule(ir, 'test.ext');

      // ASSERT
      expect(violations).toEqual([violation()]);
    });
  });

  describe('when the return type is an array envelope', () => {
    const envelope = build.envelope({
      isArray: true,
      extraProperties: [
        build.property({
          name: build.stringLiteral('pageInfo'),
          value: build.complexValue({
            typeName: pageInfo().name,
          }),
        }),
      ],
    });
    const returns = build.returnValue({
      value: build.complexValue({
        typeName: envelope.name,
      }),
    });

    it('returns an empty array if paging parameters are supplied and page info is returned', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [withPagination(returns)],
        types: [envelope, pageInfo()],
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
      const violations = relayPaginationRule(ir, 'test.ext');

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
        interfaces: [withoutPagination(returns)],
        types: [envelope],
      });

      // ACT
      const violations = relayPaginationRule(ir, 'test.ext');

      // ASSERT
      expect(violations).toEqual([]);
    });
  });

  describe('when an allow list is supplied', () => {
    const options = {
      allow: [name.value],
    };
    const envelope = build.envelope({
      isArray: true,
      extraProperties: [
        build.property({
          name: build.stringLiteral('pageInfo'),
          value: build.complexValue({
            typeName: pageInfo().name,
          }),
        }),
      ],
    });
    const returns = build.returnValue({
      value: build.complexValue({
        typeName: envelope.name,
      }),
    });

    it('returns a violation if an unpaged method is in the allow list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [withoutPagination(returns)],
        types: [envelope, pageInfo()],
      });

      // ACT
      const violations = relayPaginationRule(ir, options);

      // ASSERT
      expect(violations).toEqual([violation()]);
    });

    it('returns an empty array if a paged method is in the allow list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [withPagination(returns)],
        types: [envelope, pageInfo()],
      });

      // ACT
      const violations = relayPaginationRule(ir, options);

      // ASSERT
      expect(violations).toEqual([]);
    });

    it('returns an empty array if an unpaged method is not in the allow list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [withoutPagination(returns)],
        types: [envelope, pageInfo()],
      });

      // ACT
      const violations = relayPaginationRule(ir, {
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
    const envelope = build.envelope({
      isArray: true,
      extraProperties: [
        build.property({
          name: build.stringLiteral('pageInfo'),
          value: build.complexValue({
            typeName: pageInfo().name,
          }),
        }),
      ],
    });
    const returns = build.returnValue({
      value: build.complexValue({
        typeName: envelope.name,
      }),
    });

    it('returns an empty array if an unpaged method is in the deny list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [withoutPagination(returns)],
        types: [envelope, pageInfo()],
      });

      // ACT
      const violations = relayPaginationRule(ir, options);

      // ASSERT
      expect(violations).toEqual([]);
    });

    it('returns an empty array if a paged method is in the deny list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [withPagination(returns)],
        types: [envelope, pageInfo()],
      });

      // ACT
      const violations = relayPaginationRule(ir, options);

      // ASSERT
      expect(violations).toEqual([]);
    });

    it('returns a violation if an unpaged method is not in the deny list', () => {
      // ARRANGE
      const ir: Service = build.service({
        interfaces: [withoutPagination(returns)],
        types: [envelope, pageInfo()],
      });

      // ACT
      const violations = relayPaginationRule(ir, {
        deny: ['some_other_method_name'],
      });

      // ASSERT
      expect(violations).toEqual([violation()]);
    });
  });
});

const withPagination = (returns: ReturnValue): Interface =>
  build.int({
    name: build.stringLiteral('interface'),
    methods: [
      build.method({
        name,
        parameters: paginationParams(),
        returns,
      }),
    ],
  });

const withoutPagination = (returns: ReturnValue): Interface =>
  build.int({
    name: build.stringLiteral('interface'),
    methods: [
      build.method({
        name,
        parameters: [],
        returns,
      }),
    ],
  });

const paginationParams = (): Parameter[] => [
  build.parameter({
    name: build.stringLiteral('first'),
    value: build.primitiveValue({
      typeName: build.primitiveLiteral('integer'),
      isOptional: build.trueLiteral(true),
    }),
  }),
  build.parameter({
    name: build.stringLiteral('after'),
    value: build.primitiveValue({
      typeName: build.primitiveLiteral('string'),
      isOptional: build.trueLiteral(true),
    }),
  }),
  build.parameter({
    name: build.stringLiteral('last'),
    value: build.primitiveValue({
      typeName: build.primitiveLiteral('integer'),
      isOptional: build.trueLiteral(true),
    }),
  }),
  build.parameter({
    name: build.stringLiteral('before'),
    value: build.primitiveValue({
      typeName: build.primitiveLiteral('string'),
      isOptional: build.trueLiteral(true),
    }),
  }),
];

function pageInfo() {
  return build.type({
    name: build.stringLiteral('pageInfo'),
    properties: [
      build.property({
        name: build.stringLiteral('hasPreviousPage'),
        value: build.primitiveValue({
          typeName: build.primitiveLiteral('boolean'),
        }),
      }),
      build.property({
        name: build.stringLiteral('hasNextPage'),
        value: build.primitiveValue({
          typeName: build.primitiveLiteral('boolean'),
        }),
      }),
      build.property({
        name: build.stringLiteral('startCursor'),
        value: build.primitiveValue({
          typeName: build.primitiveLiteral('string'),
        }),
      }),
      build.property({
        name: build.stringLiteral('endCursor'),
        value: build.primitiveValue({
          typeName: build.primitiveLiteral('string'),
        }),
      }),
    ],
  });
}

const violation = (): Violation => ({
  code: 'basketry/relay-pagination',
  message: `Method "${name.value}" must define optional relay pagination parameters and return a "page info" object.`,
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
