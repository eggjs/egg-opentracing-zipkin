'use strict';

const assert = require('assert');
const utility = require('utility');
const { HttpLogger } = require('zipkin-transport-http');
const zipkin = require('zipkin');

const map = {
  v1: {
    endpoint: '/api/v1/spans',
    jsonEncoder: zipkin.jsonEncoder.JSON_V1,
  },
  v2: {
    endpoint: '/api/v2/spans',
    jsonEncoder: zipkin.jsonEncoder.JSON_V2,
  },
};

class LogCollector {
  constructor(app) {
    const zipkinConfig = app.config.zipkin;

    let options = map[zipkinConfig.version];
    assert(options, `${zipkinConfig.version} is not supported, should be v1 or v2`);
    options = Object.assign({}, options);
    options.endpoint = zipkinConfig.endpoint + options.endpoint;

    this.logger = new HttpLogger(options);
  }

  collect(span) {
    this.logger.logSpan(convertToZipkinSpan(span));
  }
}

module.exports = LogCollector;

// https://github.com/openzipkin/zipkin-js/blob/master/packages/zipkin/src/model.js
function convertToZipkinSpan(span) {
  const result = {};
  result.traceId = utility.md5(span.traceId);
  result.parentId = span.parentSpanId;
  result.id = span.spanId;
  result.name = span.name;
  // it's microseconds
  result.timestamp = span.startTime * 1000;
  // it's microseconds
  result.duration = (span.finishTime - span.startTime) * 1000;
  result.tags = span.getTags();

  const kind = span.getTag('span.kind');
  if (kind) {
    result.kind = kind;
    result.localEndpoint = {
      serviceName: span.getTag('appname'),
      ipv4: span.getTag('local.ipv4'),
      ipv6: span.getTag('local.ipv6'),
      port: span.getTag('local.port'),
    };
    result.remoteEndpoint = {
      serviceName: span.getTag('peer.service'),
      ipv4: span.getTag('peer.ipv4'),
      ipv6: span.getTag('peer.ipv6'),
      port: span.getTag('peer.port'),
    };
  }

  result.annotations = [];
  result.debug = false;
  result.shared = false;
  return result;
}
