import { serializers } from './serializers';

describe('http.response', () => {
  const responseSerializer = serializers['http.response'];

  it('should transform statusCode to status_code', () => {
    const mockResponse = {
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 200,
    };

    expect(responseSerializer(mockResponse)).toMatchSnapshot();
  });
});

describe('http.request', () => {
  const requestSerializer = serializers['http.request'];

  it('should replace id with `cf-request-id`', () => {
    const mockRequest = {
      id: 'mock-id',
      url: '/mock-url',
      headers: {
        'cf-request-id': 'mock-id-cf',
      },
    };

    expect(requestSerializer(mockRequest)).toMatchSnapshot();
  });

  it('should replace id with `x-request-id`', () => {
    const mockRequest = {
      id: 'mock-id',
      url: '/mock-url',
      headers: {
        'x-request-id': 'mock-id-x',
      },
    };

    expect(requestSerializer(mockRequest)).toMatchSnapshot();
  });

  it('should fallback to id', () => {
    const mockRequest = {
      id: 'mock-id',
      url: '/mock-url',
      headers: {},
    };

    expect(requestSerializer(mockRequest)).toMatchSnapshot();
  });

  it('should redact sensitive headers', () => {
    const mockRequest = {
      id: 'mock-id',
      url: '/mock-url',
      headers: {
        'x-token-payload': 'sensitive-data',
        authorization: 'sensitive-data',
        'proxy-authorization': 'sensitive-data',
        'proxy-authenticate': 'sensitive-data',
        'www-authenticate': 'sensitive-data',
        'x-beamery-user-id': 'mock-user',
      },
    };

    expect(requestSerializer(mockRequest)).toMatchSnapshot();
  });
});
