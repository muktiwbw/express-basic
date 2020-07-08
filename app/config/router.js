const express = require('express');

class Router {
  constructor(options = {}) {
    this.router = express.Router(options);
  }
}

module.exports = Router;