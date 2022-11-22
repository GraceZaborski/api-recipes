import { IncomingMessage } from 'http';
import { reqCustomProps } from './request-custom-props';

describe('reqCustomProps', () => {
  it('should map headers to respective fields', () => {
    const mockRequest = {
      originalUrl: '/mock-url',
      headers: {
        'x-beamery-user-id': 'mock-user-id',
        'x-b3-traceid': 'mock-trace-id',
        'x-b3-spanid': 'mock-span-id',
        'x-beamery-company-id': 'mock-company-id',
      },
    } as unknown as IncomingMessage;

    expect(reqCustomProps(mockRequest)).toMatchSnapshot();
  });

  it('should ignore missing headers', () => {
    const mockRequest = {
      originalUrl: '/mock-url',
      headers: {},
    } as unknown as IncomingMessage;

    expect(reqCustomProps(mockRequest)).toEqual({
      tags: ['api-campaigns'],
      url: { path: '/mock-url' },
    });
  });
});
