'use strict';
const request = require('supertest');
const app = require('../app');

describe('/login', () => {
  test('ログインのためのリンクが含まれる', () => {
    return request(app)
      .get('/login')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/"\/login"/)
      .expect(200);
  });
});