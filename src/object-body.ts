import { combineRules } from 'basketry';

import objectRequestBody from './object-request-body';
import objectResponseBody from './object-response-body';

const objectBodyRule = combineRules(objectRequestBody, objectResponseBody);

export default objectBodyRule;
