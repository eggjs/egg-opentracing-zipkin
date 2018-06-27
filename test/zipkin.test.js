'use strict';

const mock = require('egg-mock');

describe('test/zipkin.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/zipkin-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, zipkin')
      .expect(200);
  });
});
