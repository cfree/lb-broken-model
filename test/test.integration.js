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
  describe('/0', () => {
    it('should succeed with a 200', done => {
      request.get('/api/tests/0')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

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
    it('should intercept a request, then fail with a 502', done => {
      request.get('/api/tests/2')
        .end((err, res) => {
          expect(res).to.have.status(502);
          done();
        });
    });
  });

  describe('/3', () => {
    it('uses promises and should intercept a request, then succeed with a 200', done => {
      nock('http://aol.com')
        .get('/')
        .reply(201)
        .log(console.log);

      request.get('/api/tests/3')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('uses promises and should intercept a request, then fail with a 504', done => {
      nock('http://aol.com')
        .get('/')
        .reply(500)
        .log(console.log);

      request.get('/api/tests/3')
        .end((err, res) => {
          expect(res).to.have.status(504);
          done();
        });
    });

    it('uses promises and should intercept a request, then fail with a 504', done => {
      nock('http://aol.com')
        .get('/')
        .replyWithError('ECONNREFUSED')
        .log(console.log);

      request.get('/api/tests/3')
        .end((err, res) => {
          expect(res).to.have.status(504);
          done();
        });
    });
  });

  describe('/4', () => {
    it('uses hystrixjs & promises and should fail with a 505', done => {
      nock('http://aol.com')
        .get('/')
        .reply(200, {})
        .log(console.log);

      request.get('/api/tests/4')
        .end((err, res) => {
          expect(res).to.have.status(505);
          done();
        });
    });

    it('uses hystrixjs & promises and should intercept a request, then fail with a 506', done => {
      nock('http://aol.com')
        .get('/')
        .reply(500)
        .log(console.log);

      request.get('/api/tests/4')
        .end((err, res) => {
          expect(res).to.have.status(506);
          done();
        });
    });

    it('uses hystrixjs & promises and should intercept a request, then fail with a 506', done => {
      nock('http://aol.com')
        .get('/')
        .replyWithError('ECONNREFUSED')
        .log(console.log);

      request.get('/api/tests/4')
        .end((err, res) => {
          expect(res).to.have.status(506);
          done();
        });
    });
  });
});