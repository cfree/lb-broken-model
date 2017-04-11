'use strict';

const chaiHttp = require('chai-http');
const chai = require('chai');
const sinon = require('sinon');
chai.use(chaiHttp);
const expect = chai.expect;
const app = require('../server/server');
const request = chai.request(app);
const nock = require('nock');

describe('/test', () => {
  describe('/1', () => {
    it('should fail with a 501', done => {
      request.get('/api/tests/1')
        .end((err, res) => {
          expect(res).to.have.status(501);
          done();
        });
    });
  });

  describe('/2', () => {
    it('should fail with a 502', done => {
      request.get('/api/tests/2')
        .end((err, res) => {
          expect(res).to.have.status(502);
          done();
        });
    });
  });

  describe('/3', () => {
    it('should fail with a 503', done => {
      request.get('/api/tests/3')
        .end((err, res) => {
          expect(res).to.have.status(503);
          done();
        });
    });

    it('should fail with a 504', done => {
      nock('http://aol.com')
        .get()
        .replyWithError('ECONNREFUSED');

      request.get('/api/tests/3')
        .end((err, res) => {
          expect(res).to.have.status(504);
          done();
        });
    });
  });
});