import { getSignatureToolConfig } from './signature';
import { getUnsubscribeToolConfig } from './unsubscribe';
import { getToolRegistrationCode } from './unlayer-tools-utils';
export * from './unlayer-tools-utils';
export * from './signature';
export * from './unsubscribe';

export const getAllConfigs = ({ user = {}, company = {} }) => {
  const configs = [
    getSignatureToolConfig({ user, company }),
    getUnsubscribeToolConfig({ user, company }),
  ];

  return configs.map((c) => getToolRegistrationCode(c));
};
