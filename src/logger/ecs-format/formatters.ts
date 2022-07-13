// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { formatError } from '@elastic/ecs-helpers';

interface LogObject {
  error: Record<string, unknown>;
  ecs: { version: string };
  'event.duration': number;
}

const NANOSECONDS = 1000000;

function bindings(bindingsObject: Record<string, unknown>) {
  const { pid, hostname, ...ecsBindings } = bindingsObject;

  if (pid !== undefined) {
    ecsBindings.process = { pid };
  }

  if (hostname !== undefined) {
    ecsBindings.host = { hostname };
  }

  return ecsBindings;
}

function level(label: string) {
  return { 'log.level': label };
}

function log(object: LogObject) {
  const { error, ...ecsObject } = object;
  ecsObject.ecs = { version: '1.6.0' };

  if (ecsObject['event.duration'] !== undefined) {
    // event.duration is in milliseconds
    ecsObject['event.duration'] *= NANOSECONDS;
  }

  // mutates
  formatError(ecsObject, error);

  return ecsObject;
}

export const formatters = {
  bindings,
  level,
  // eslint-disable-next-line @typescript-eslint/ban-types
  log: (o: object) => log(o as LogObject),
};
