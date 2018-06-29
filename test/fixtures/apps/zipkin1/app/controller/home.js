'use strict';

const Controller = require('egg').Controller;
const sleep = require('mz-modules/sleep');


class HomeController extends Controller {
  async index() {
    const result = await this.ctx.curl('http://127.0.0.1:8001');
    this.ctx.body = result.data;
  }

  async span() {
    const span = this.ctx.tracer.startSpan('test');
    await sleep(1000);
    span.finish();
    this.ctx.body = 'done';
  }
}

module.exports = HomeController;
