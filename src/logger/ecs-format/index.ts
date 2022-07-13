import { Options } from 'pino-http';
import { reqCustomProps } from './request-custom-props';
import { formatters } from './formatters';
import { serializers } from './serializers';

type ECSFormatOptions = Omit<
  Options,
  | 'customAttributeKeys'
  | 'messageKey'
  | 'timestamp'
  | 'reqCustomProps'
  | 'serializers'
  | 'formatters'
>;

export const ecsFormat = (options?: ECSFormatOptions): Options => ({
  ...options,
  customAttributeKeys: {
    req: 'http.request',
    res: 'http.response',
    responseTime: 'event.duration',
  },
  messageKey: 'message',
  timestamp: () => `,"@timestamp":"${new Date().toISOString()}"`,
  customProps: reqCustomProps,
  serializers,
  formatters,
});
