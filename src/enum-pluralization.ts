import { decodeRange, enumRule } from 'basketry';
import { addUncountableRule, singular } from 'pluralize';
import { parseSeverity } from './utils';

addUncountableRule(/data$/);

const code = 'basketry/enum-pluralization';
const link = 'https://github.com/basketry/rules#pluralization';

const enumPlurlaizationRule = enumRule(
  ({ service, enum: { name }, options }) => {
    if (name.value !== singular(name.value)) {
      return {
        code,
        message: `Enum name should be singular: "${singular(name.value)}"`,
        range: decodeRange(name.loc),
        severity: parseSeverity(options?.severity),
        sourcePath: service.sourcePath,
        link,
      };
    }

    return undefined;
  },
);

export default enumPlurlaizationRule;
