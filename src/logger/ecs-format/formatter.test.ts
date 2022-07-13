import { formatters } from './formatters';

describe('level', () => {
  const { level } = formatters;

  it('should format log level', () => {
    expect(level('mock-level')).toEqual({
      'log.level': 'mock-level',
    });
  });
});

describe('bindings', () => {
  const { bindings } = formatters;

  it('should format bindings', () => {
    expect(
      bindings({
        pid: 'mock-pid',
        hostname: 'mock-hostname',
      }),
    ).toMatchSnapshot();
  });

  it('should ignore missing fields', () => {
    expect(bindings({})).toEqual({});
  });
});

describe('log', () => {
  const { log } = formatters;

  it('should format error', () => {
    const error = new Error('mock-error');
    error.stack = 'mock-stack-trace';

    const req = {
      key: 'mock-key',
      error,
    };

    expect(log(req)).toMatchSnapshot();
  });

  it('should identify type error', () => {
    const error = new TypeError('mock-error');
    error.stack = 'mock-stack-trace';
    const req = {
      key: 'mock-key',
      error,
    };

    expect(log(req)).toMatchSnapshot();
  });

  it('should pass through error object unchanged', () => {
    const req = {
      error: { foo: 'bar' },
      key: 'mock-key',
    };

    expect(log(req)).toMatchSnapshot();
  });

  it('should format the event.duration to nanoseconds', () => {
    const req = {
      error: { foo: 'bar' },
      key: 'mock-key',
      'event.duration': 192,
    };

    expect(log(req)).toMatchSnapshot();
  });
});
