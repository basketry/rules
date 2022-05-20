import { combineRules } from 'basketry';

import parameterPlurlaizationRule from './parameter-pluralization';
import propertyPlurlaizationRule from './property-pluralization';

const descriptionrule = combineRules(
  parameterPlurlaizationRule,
  propertyPlurlaizationRule,
);

export default descriptionrule;
