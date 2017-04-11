'use strict';

const request = require('request');

module.exports = function(Test) {
  Test.sampleRemoteMethod1 = (callback) => {
    // 1 Test failure
    const customErr = new Error('This doesn\'t work');
    customErr.status = 501;

    callback(customErr);
  };

  Test.remoteMethod('sampleRemoteMethod1', {
    http: {
      path: '/1/',
      verb: 'get',
    },
    returns: {
      arg: 'body',  
      type: 'object',
      root: true,
    },
  });

  Test.sampleRemoteMethod2 = (callback) => {
    // 2 Test failure with middle
    request('http://aol.com', (err, res, body) => {
      const customErr = new Error('This also doesn\'t work');
      customErr.status = 502;
      callback(customErr);
    });
  };

  Test.remoteMethod('sampleRemoteMethod2', {
    http: {
      path: '/2/',
      verb: 'get',
    },
    returns: {
      arg: 'body',  
      type: 'object',
      root: true,
    },
  });

  Test.sampleRemoteMethod3 = (callback) => {
    // 3 Test failure with middle using promises
    const requestPromise = new Promise((resolve, reject) => {
      request('http://aol.com', (err, res, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    });

    return requestPromise.then(data => {
      const customErr = new Error('This doesn\'t work either');
      customErr.status = 503;
      return callback(customErr);
    })
    .catch(err => {
      const customErr = new Error('Still not working');
      customErr.status = 504;
      return callback(customErr);
    });
  };

  Test.remoteMethod('sampleRemoteMethod3', {
    http: {
      path: '/3/',
      verb: 'get',
    },
    returns: {
      arg: 'body',  
      type: 'object',
      root: true,
    },
  });
};
