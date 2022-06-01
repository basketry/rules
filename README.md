[![main](https://github.com/basketry/rules/workflows/build/badge.svg?branch=main&event=push)](https://github.com/basketry/rules/actions?query=workflow%3Abuild+branch%3Amain+event%3Apush)
[![master](https://img.shields.io/npm/v/@basketry/rules)](https://www.npmjs.com/package/@basketry/rules)

# Basketry Rules

Common rules for building [Basketry](https://github.com/basketry/basketry) pipelines. These rules may be used with any Basketry parser and may be combined with any other Basketry rules.

## Descriptions

| Rule                                        |                                                      |
| ------------------------------------------- | ---------------------------------------------------- |
| `@basketry/rules/lib/method-description`    | Requires all methods to have a description           |
| `@basketry/rules/lib/parameter-description` | Requires all method parameters to have a description |
| `@basketry/rules/lib/property-description`  | Requires all type properties to have a description   |
| `@basketry/rules/lib/type-description`      | Requires all types to have a description             |
| `@basketry/rules/lib/description`           | Combines all of the other description rules          |

### Options

By default, violations of these rules will be displayed as errors. This may be overridden with the `severity` option:

```json
{
  "rules": [
    {
      "rule": "@basketry/rules/lib/description",
      "options": { "severity": "warning" }
    }
  ]
}
```

## Array parameter length

| Rule                                         |                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------- |
| `@basketry/rules/lib/array-parameter-length` | Requires method array-typed parameters to specify max item lengths. |

### Options

By default, violations of this rule will be displayed as errors. This may be overridden with the `severity` option:

```json
{
  "rules": [
    {
      "rule": "@basketry/rules/lib/array-parameter-length",
      "options": { "severity": "warning" }
    }
  ]
}
```

## HTTP status codes

| Rule                                         |                                                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `@basketry/rules/lib/http-delete-status`     | Requires that HTTP DELETE status codes must be `200`, `202`, or `204`                                                     |
| `@basketry/rules/lib/http-get-status`        | Requires that HTTP GET status codes must be `200`, `204`, or `206`                                                        |
| `@basketry/rules/lib/http-patch-status`      | Requires that HTTP PATCH status codes must be `200`, `202`, or `204`                                                      |
| `@basketry/rules/lib/http-post-status`       | Requires that HTTP POST status codes must be `200`, `201`, `202`, or `204`                                                |
| `@basketry/rules/lib/http-put-status`        | Requires that HTTP PUT status codes must be `200`, `201`, `202`, or `204`                                                 |
| `@basketry/rules/lib/http-no-content-status` | Requires methods with no return type return status code of `204` AND that methods that do return data do not return `204` |
| `@basketry/rules/lib/http-status`            | Combines all of the other HTTP status code rules                                                                          |

### Options

By default, violations of these rules will be displayed as errors. This may be overridden with the `severity` option:

```json
{
  "rules": [
    {
      "rule": "@basketry/rules/lib/http-status",
      "options": { "severity": "warning" }
    }
  ]
}
```

## Pagination

| Rule                                    |                                                                                              |
| --------------------------------------- | -------------------------------------------------------------------------------------------- |
| `@basketry/rules/lib/offset-pagination` | Requires methods that return arrays provide `offest` and `limit` paremters                   |
| `@basketry/rules/lib/relay-pagination`  | Requires methods that return arrays provide `first`, `after`, `last`, and `before` paremters |

### Options

By default, violations of these rules will be displayed as errors. This may be overridden with the `severity` option. This rule allows for both bare array and evelope object return types. By default, the payload is expected to be in a property called `value`, `values`, or `data`. These expectations may be overridded with the `payload` option.

```json
{
  "rules": [
    {
      "rule": "@basketry/rules/lib/offset-pagination",
      "options": {
        "severity": "warning",
        "payload": ["result", "results"]
      }
    }
  ]
}
```

## String IDs

| Rule                            |                                                                   |
| ------------------------------- | ----------------------------------------------------------------- |
| `@basketry/rules/lib/string-id` | Requires that type properties named `id` must be of type `string` |

### Options

By default, violations of this rule will be displayed as errors. This may be overridden with the `severity` option:

```json
{
  "rules": [
    {
      "rule": "@basketry/rules/lib/string-id",
      "options": { "severity": "warning" }
    }
  ]
}
```

## Response envelopes

| Rule                                    |                                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `@basketry/rules/lib/response-envelope` | Requires that all methods return envelope objects that contain both an `errors` array and a payload property. |

### Options

By default, violations of these rules will be displayed as errors. This may be overridden with the `severity` option. This rule allows for both bare array and evelope object return types. By default, the payload is expected to be in a property called `value`, `values`, or `data`. These expectations may be overridded with the `payload` option. Note that other rules may enforce various pluralization requirements, so be sure to include both the plural and singular form of your payload name.

```json
{
  "rules": [
    {
      "rule": "@basketry/rules/lib/response-envelope",
      "options": {
        "severity": "warning",
        "payload": ["result", "results"]
      }
    }
  ]
}
```

## Pluralization

| Rule                                          |                                                                                                    |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `@basketry/rules/lib/parameter-pluralization` | Requires that array parameters have pluralized names and non-array parameters have singular names. |
| `@basketry/rules/lib/property-pluralization`  | Requires that array properties have pluralized names and non-array properties have singular names. |
| `@basketry/rules/lib/pluralization`           | Combines all of the other pluralization rules                                                      |

### Options

By default, violations of this rule will be displayed as errors. This may be overridden with the `severity` option:

```json
{
  "rules": [
    {
      "rule": "@basketry/rules/lib/string-id",
      "options": { "severity": "warning" }
    }
  ]
}
```

## Casing

| Rule                         |                                                                |
| ---------------------------- | -------------------------------------------------------------- |
| `@basketry/rules/lib/casing` | Defines casing requirements for the various parts of a service |

### Options

Casing values must be one of the following:

- `snake` - eg. some_item_name
- `pascal` - eg. SomeItemName
- `camel` - eg. someItemName
- `kebab` - eg. some-item-name
- `header` - eg. Some-Item-Name
- `constant'` - eg. SOME_ITEM_NAME

Any other casing value will be silently ignored.

The following opitons may be used to enforcing casing rules within the service:

- `enum`
- `enumValue`
- `path`
- `method`
- `parameter`
- `query`
- `header`
- `property`
- `type`

Note that if `query` or `header` are supplied when `parameter` is _also_ supplied, then the more specific rules for headers and query parameters will override the setting for all other parameters. If `query` or `header` are _not_ supplied, the the value for `parameter` will also be used for headers and query parameters.

By default, violations of this rule will be displayed as errors. This may be overridden with the `severity` option.

```json
{
  "rules": [
    {
      "rule": "@basketry/rules/lib/casing",
      "options": {
        "severity": "warning",
        "enum": "camel",
        "enumValue": "constant",
        "path": "kabab",
        "method": "camel",
        "parameter": "camel",
        "query": "kabab",
        "header": "header",
        "property": "camel",
        "type": "camel"
      }
    }
  ]
}
```

If a casing rule is not specified for a particular element, then any casing will be allowed. There are no default values.

Warning: changing the casing for enum values, paths, query parameters, and properties is a breaking change for HTTP (aka RESTful) services because those values are passed directly in the HTTP request or response. Query parameters are not technically case-sensitive. Enum, method, and type names are never included in HTTP traffic.

Also note that various Generators may emit code that is idiomatic to a particular language regardless of these casing rules; however, all generated code MUST send and receive values in the specified casing when communicating over service boundaries and/or respect the casing requirements of the protocol with which they do so.

---

Generated with [generator-ts-console](https://www.npmjs.com/package/generator-ts-console)
