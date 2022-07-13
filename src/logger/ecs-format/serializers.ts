import { IncomingHttpHeaders } from 'http';

type ResponseSerializeObject = Record<string, unknown> & {
  statusCode?: number;
};

type RequestSerializeObject = Record<string, unknown> & {
  id: string;
  headers: IncomingHttpHeaders;
};

const SENSITIVE_HEADERS = [
  'x-token-payload',
  'authorization',
  'proxy-authorization',
  'proxy-authenticate',
  'www-authenticate',
];

const redactProps = <T extends Record<string, unknown>>(
  props: string[],
  data: T,
) =>
  props.reduce<T>(
    (res, key) => (res[key] ? { ...res, [key]: '[REDACTED]' } : res),
    data,
  );

function serializeResponse(object: ResponseSerializeObject) {
  const { statusCode, ...response } = object;

  return {
    ...response,
    status_code: statusCode,
  };
}

function serializeRequest(object: RequestSerializeObject) {
  const { id, ...request } = object;

  request.headers = redactProps(SENSITIVE_HEADERS, request.headers);

  return {
    ...request,
    id:
      request.headers['cf-request-id'] || request.headers['x-request-id'] || id,
    url: undefined,
  };
}

export const serializers = {
  'http.response': serializeResponse,
  'http.request': serializeRequest,
};
