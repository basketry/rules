import { combineRules } from 'basketry';

import methodDescriptionRule from './method-description';
import parameterDescriptionRule from './parameter-description';
import propertyDescriptionRule from './property-description';
import typeDescriptionRule from './type-description';

const descriptionrule = combineRules(
  methodDescriptionRule,
  parameterDescriptionRule,
  propertyDescriptionRule,
  typeDescriptionRule,
);

export default descriptionrule;
