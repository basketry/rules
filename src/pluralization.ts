import { combineRules } from 'basketry';

import parameterPlurlaizationRule from './parameter-pluralization';
import propertyPlurlaizationRule from './property-pluralization';

const descriptionRule = combineRules(
  parameterPlurlaizationRule,
  propertyPlurlaizationRule,
);

export default descriptionRule;
