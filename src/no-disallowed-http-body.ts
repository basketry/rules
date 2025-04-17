import { combineRules } from 'basketry';

import noHttpDeleteBody from './no-http-delete-body';
import noHttpGetBody from './no-http-get-body';
import noHttpHeadBody from './no-http-head-body';
import noHttpOptionsBody from './no-http-options-body';
import noHttpTraceBodyRule from './no-http-trace-body';

const noDisallowedBodyRule = combineRules(
  noHttpDeleteBody,
  noHttpGetBody,
  noHttpHeadBody,
  noHttpOptionsBody,
  noHttpTraceBodyRule,
);

export default noDisallowedBodyRule;
