'use strict';

const request = require('request');
const CommandsFactory = require('hystrixjs').commandFactory;
const hystrixConfig = require('hystrixjs').hystrixConfig;
hystrixConfig.init({'hystrix.promise.implementation': Promise});

module.exports = function(Test) {
  Test.sampleRemoteMethod0 = (callback) => {
    // 1 Test success
    callback(null, 'Success');
  };

  Test.remoteMethod('sampleRemoteMethod0', {
    http: {
      path: '/0/',
      verb: 'get',
    },
    returns: {
      arg: 'body',  
      type: 'object',
      root: true,
    },
  });
  
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
        console.log('ERR', err);
        if (err) {
          reject(err);
        } else if (res.statusCode && res.statusCode === 500) {
          return reject(res.statusCode);
        } else {
          resolve(body);
        }
      });
    });

    return requestPromise.then(data => {
      return callback(null, 'This worked');
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

  Test.sampleRemoteMethod4 = (callback) => {
    // 4 Test failure with middle using promises and hystrixjs

    const requestPromise = () => new Promise((resolve, reject) => {
      request('http://aol.com', (err, res, body) => {
        console.log('ERR', err);
        if (err) {
          return reject(err);
        } else if (res.statusCode && res.statusCode === 500) {
          return reject(res.statusCode);
        } else {
          return resolve(body);
        }
      });
    });

    const serviceCommand = CommandsFactory.getOrCreate('Service started')
      .run(requestPromise)
      .fallbackTo((data) => {
        console.error('Fell back');
        return Promise.reject(data);
      })
      .build();

    return serviceCommand.execute()
      .then(data => {
        const customErr = new Error('Nope');
        customErr.status = 505;
        return callback(customErr);
      })
      .catch(err => {
        const customErr = new Error('Still no');
        customErr.status = 506;
        return callback(customErr);
      });
  };

  Test.remoteMethod('sampleRemoteMethod4', {
    http: {
      path: '/4/',
      verb: 'get',
    },
    returns: {
      arg: 'body',  
      type: 'object',
      root: true,
    },
  });
};
