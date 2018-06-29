'use strict';

const assert = require('assert');
const http = require('http');
const mock = require('egg-mock');
const sleep = require('mz-modules/sleep');
const toArray = require('stream-to-array');


describe('test/zipkin.test.js', () => {
  let app1;
  let app2;
  let server;
  before(async () => {
    app1 = mock.cluster({
      baseDir: 'apps/zipkin1',
      port: 8000,
    });
    await app1.ready();
    app2 = mock.cluster({
      baseDir: 'apps/zipkin2',
      port: 8001,
    });
    await app2.ready();
  });
  before(() => {
    server = mockZipkinServer(9411);
    return server.start();
  });

  after(() => app1.close());
  after(() => app2.close());
  after(() => server.stop());
  afterEach(() => server.restore());
  afterEach(mock.restore);

  it('should GET /', async () => {
    await app1.httpRequest()
      .get('/')
      .expect(200);

    await sleep(5000);
    console.log(server.spans);
    const [ app1span1, app1span2 ] = server.spans[0];
    const [ app2span ] = server.spans[1];

    assert(app1span1.traceId);
    assert(app1span1.id);
    assert(app1span1.parentId);
    assert(app1span1.parentId === app1span2.id);
    assert(app1span1.name === 'http_client');
    assert(app1span1.kind === 'CLIENT');
    assert(typeof app1span1.timestamp === 'number');
    assert(typeof app1span1.duration === 'number');
    assert(app1span1.localEndpoint.serviceName === 'zipkin1');
    assert(app1span1.localEndpoint.ipv4);
    assert(app1span1.remoteEndpoint.ipv4);
    assert(app1span1.remoteEndpoint.port);
    assert(app1span1.tags.appname === 'zipkin1');

    assert(app1span2.traceId);
    assert(app1span2.id);
    assert(app1span2.name === 'http_server');
    assert(app1span2.kind === 'SERVER');
    assert(typeof app1span2.timestamp === 'number');
    assert(typeof app1span2.duration === 'number');
    assert(app1span2.localEndpoint.serviceName === 'zipkin1');
    assert(app1span2.localEndpoint.ipv4);
    assert(app1span2.remoteEndpoint.ipv6);
    assert(app1span2.remoteEndpoint.port);
    assert(app1span2.tags.appname === 'zipkin1');

    assert(app2span.traceId);
    assert(app2span.id);
    assert(app2span.parentId);
    assert(app2span.parentId === app1span1.id);
    assert(app2span.name === 'http_server');
    assert(app2span.kind === 'SERVER');
    assert(typeof app2span.timestamp === 'number');
    assert(typeof app2span.duration === 'number');
    assert(app2span.localEndpoint.serviceName === 'zipkin2');
    assert(app2span.localEndpoint.ipv4);
    assert(app2span.remoteEndpoint.ipv6);
    assert(app2span.remoteEndpoint.port);
    assert(app2span.tags.appname === 'zipkin2');
  });

  it('should not contain kind when the tag of span.kind is empty', async () => {
    await app1.httpRequest()
      .get('/span')
      .expect(200);

    await sleep(1000);
    const [ span ] = server.spans[2];
    assert(!span.kind);
    assert(span.name === 'test');
  });
});

function mockZipkinServer(port) {
  const result = {
    spans: [],
    restore() {
      result.spans = [];
    },
  };
  const server = http.createServer((req, res) => {
    toArray(req)
      .then(body => {
        result.spans.push(JSON.parse(body.toString()));
        res.writeHead(202, { 'Content-Type': 'text/application' });
        res.end('ok');
      });
  });
  result.start = () => {
    return new Promise(resolve => {
      server.listen(port, () => {
        resolve();
      });
    });
  };
  result.stop = () => {
    return new Promise(resolve => {
      server.close(() => {
        resolve();
      });
    });
  };
  return result;
}
