import { combineRules } from 'basketry';

import enumPlurlaizationRule from './enum-pluralization';
import parameterPlurlaizationRule from './parameter-pluralization';
import propertyPlurlaizationRule from './property-pluralization';

const descriptionRule = combineRules(
  enumPlurlaizationRule,
  parameterPlurlaizationRule,
  propertyPlurlaizationRule,
);

export default descriptionRule;
