'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const result = await this.ctx.curl('http://127.0.0.1:8001');
    this.ctx.body = result.data;
  }
}

module.exports = HomeController;
