import { IncomingMessage } from 'http';

type RequestDTO = Record<string, unknown> & {
  url: {
    path: string;
  };
};

export function reqCustomProps(req: IncomingMessage) {
  const { headers, originalUrl } = req as IncomingMessage & {
    originalUrl: string;
  };
  const requestDTO: RequestDTO = {
    url: { path: originalUrl },
  };
  const userId = headers['x-beamery-user-id'];
  const traceId = headers['x-b3-traceid'];
  const spanId = headers['x-b3-spanid'];
  const companyId = headers['x-beamery-company-id'];

  if (userId !== undefined) {
    requestDTO['user.id'] = userId;
  }

  if (traceId !== undefined) {
    requestDTO['trace.id'] = traceId;
  }

  if (spanId !== undefined) {
    requestDTO['span.id'] = spanId;
  }

  if (companyId !== undefined) {
    requestDTO['beamery.company.id'] = companyId;
  }

  return requestDTO;
}
