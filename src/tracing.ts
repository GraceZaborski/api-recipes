import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from '@opentelemetry/core';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import * as process from 'process';
import configuration from './config/configuration';
const config = configuration();

const { telemetry } = config;

const opentelSDK = new NodeSDK({
  metricReader: new PrometheusExporter({
    port: telemetry.port,
    endpoint: telemetry.endpoint,
  }),
  spanProcessor: new SimpleSpanProcessor(new TraceExporter()),
  contextManager: new AsyncLocalStorageContextManager(),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new PinoInstrumentation(),
    new HttpInstrumentation(),
    new NestInstrumentation(),
    new FastifyInstrumentation(),
  ],
});

export default opentelSDK;

process.on('SIGTERM', () => {
  opentelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
