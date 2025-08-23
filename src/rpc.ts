#!/usr/bin/env node

import { RPC, Rule } from 'basketry';

import arrayParameterLengthRule from './array-parameter-length';
import casingRule from './casing';
import descriptionRule from './description';
import enumPlurlaizationRule from './enum-pluralization';
import httpDeleteStatusRule from './http-delete-status';
import httpGetStatusRule from './http-get-status';
import httpNoContentStatusRule from './http-no-content-status';
import httpPatchStatusRule from './http-patch-status';
import httpPutStatusRule from './http-put-status';
import httpStatusRule from './http-status';
import jsonApiErrorRule from './json-api-error';
import methodDescriptionRule from './method-description';
import noDisallowedBodyRule from './no-disallowed-http-body';
import noFreeFormObjectsRule from './no-free-form-objects';
import noHttpDeleteBodyRule from './no-http-delete-body';
import noHttpGetBodyRule from './no-http-get-body';
import noHttpOptionsBodyRule from './no-http-options-body';
import noHttpTraceBodyRule from './no-http-trace-body';
import noMixedPropertiesRule from './no-mixed-properties';
import noNullPropertiesRule from './no-null-properties';
import objectBodyRule from './object-body';
import objectRequestBodyRule from './object-request-body';
import objectResponseBodyRule from './object-response-body';
import offsetPaginationRule from './offset-pagination';
import parameterDescriptionRule from './parameter-description';
import parameterPlurlaizationRule from './parameter-pluralization';
import pluralizationRule from './pluralization';
import propertyDescriptionRule from './property-description';
import propertyPlurlaizationRule from './property-pluralization';
import relayPaginationRule from './relay-pagination';
import responseEnvelopeRule from './response-envelope';
import stringIdRule from './string-id';
import stringMapKeysRule from './string-map-key';
import typeDescriptionRule from './type-description';

const rule: Rule = (service, options) => {
  switch (process.argv[2]) {
    case 'array-parameter-length':
      return arrayParameterLengthRule(service, options);
    case 'casing':
      return casingRule(service, options);
    case 'description':
      return descriptionRule(service, options);
    case 'enum-pluralization':
      return enumPlurlaizationRule(service, options);
    case 'http-delete-status':
      return httpDeleteStatusRule(service, options);
    case 'http-get-status':
      return httpGetStatusRule(service, options);
    case 'http-no-content-status':
      return httpNoContentStatusRule(service, options);
    case 'http-patch-status':
      return httpPatchStatusRule(service, options);
    case 'http-put-status':
      return httpPutStatusRule(service, options);
    case 'http-status':
      return httpStatusRule(service, options);
    case 'json-api-error':
      return jsonApiErrorRule(service, options);
    case 'method-description':
      return methodDescriptionRule(service, options);
    case 'no-disallowed-body':
      return noDisallowedBodyRule(service, options);
    case 'no-free-form-objects':
      return noFreeFormObjectsRule(service, options);
    case 'no-http-delete-body':
      return noHttpDeleteBodyRule(service, options);
    case 'no-http-get-body':
      return noHttpGetBodyRule(service, options);
    case 'no-http-options-body':
      return noHttpOptionsBodyRule(service, options);
    case 'no-http-trace-body':
      return noHttpTraceBodyRule(service, options);
    case 'no-mixed-properties':
      return noMixedPropertiesRule(service, options);
    case 'no-null-properties':
      return noNullPropertiesRule(service, options);
    case 'object-body':
      return objectBodyRule(service, options);
    case 'object-request-body':
      return objectRequestBodyRule(service, options);
    case 'object-response-body':
      return objectResponseBodyRule(service, options);
    case 'offset-pagination':
      return offsetPaginationRule(service, options);
    case 'parameter-description':
      return parameterDescriptionRule(service, options);
    case 'parameter-pluralization':
      return parameterPlurlaizationRule(service, options);
    case 'pluralization':
      return pluralizationRule(service, options);
    case 'property-description':
      return propertyDescriptionRule(service, options);
    case 'property-pluralization':
      return propertyPlurlaizationRule(service, options);
    case 'relay-pagination':
      return relayPaginationRule(service, options);
    case 'response-envelope':
      return responseEnvelopeRule(service, options);
    case 'string-id':
      return stringIdRule(service, options);
    case 'string-map-key':
      return stringMapKeysRule(service, options);
    case 'type-description':
      return typeDescriptionRule(service, options);
    default:
      // TODO: return "rule not found" error
      return [];
  }
};

new RPC({ rule }).execute();
