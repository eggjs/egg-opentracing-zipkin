# egg-opentracing-zipkin

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-opentracing-zipkin.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-opentracing-zipkin
[travis-image]: https://img.shields.io/travis/eggjs/egg-opentracing-zipkin.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-opentracing-zipkin
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-opentracing-zipkin.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-opentracing-zipkin?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-opentracing-zipkin.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-opentracing-zipkin
[snyk-image]: https://snyk.io/test/npm/egg-opentracing-zipkin/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-opentracing-zipkin
[download-image]: https://img.shields.io/npm/dm/egg-opentracing-zipkin.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-opentracing-zipkin

Report trace infomation to zipkin server in Egg.js.

## Install

```bash
$ npm i egg-opentracing-zipkin --save
```

## Usage

egg-opentracing-zipkin depends on [egg-opentracing](https://github.com/eggjs/egg-opentracing), you should enable these plugin.

```js
// {app_root}/config/plugin.js
exports.opentracing = {
  enable: true,
  package: 'egg-opentracing',
};
exports.zipkin = {
  enable: true,
  package: 'egg-opentracing-zipkin',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.zipkin = {
  endpoint: 'http://locahost:9411',
  version: 'v2',
  interval: 1000,
};
```

- endpoint: the hostname of zipkin server.
- version: zipkin API server, default is v2.
- interval: how often to sync spans

see [config/config.default.js](config/config.default.js) for more detail.

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
