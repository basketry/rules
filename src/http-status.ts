import { combineRules } from 'basketry';

import httpDeleteStatusRule from './http-delete-status';
import httpGetStatusRule from './http-get-status';
import httpNoContentStatusRule from './http-no-content-status';
import httpPatchStatusRule from './http-patch-status';
import httpPostStatusRule from './http-post-status';
import httpPutStatusRule from './http-put-status';

const descriptionrule = combineRules(
  httpDeleteStatusRule,
  httpGetStatusRule,
  httpNoContentStatusRule,
  httpPatchStatusRule,
  httpPostStatusRule,
  httpPutStatusRule,
);

export default descriptionrule;
