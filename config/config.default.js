'use strict';

/**
 * egg-opentracing-zipkin default config
 * @member Config#zipkin
 * @property {String} endpoint - the host url of zipkin server
 * @property {String} version - the api version
 * @property {String} interval - how often to sync spans
 */
exports.zipkin = {
  endpoint: 'http://127.0.0.1:9411',
  version: 'v2',
  interval: 1000,
};

exports.opentracing = {
  collector: {
    zipkin: require('../lib/zipkin_collector'),
  },
};
