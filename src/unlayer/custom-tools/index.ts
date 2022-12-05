import { getSignatureToolConfig } from './signature';
import { getUnsubscribeToolConfig } from './unsubscribe';
import { getToolRegistrationCode } from './unlayer-tools-utils';
import { getVideoToolConfig } from './video';
export * from './unlayer-tools-utils';
export * from './signature';
export * from './unsubscribe';

export const getAllConfigs = ({ user = {}, company = {} }) => {
  const configs = [
    getVideoToolConfig(),
    getSignatureToolConfig({ user, company }),
    getUnsubscribeToolConfig({ user, company }),
  ];

  return configs.map((c) => getToolRegistrationCode(c));
};
