# Broken Model

## Findings

While testing responses in Loopback using promises, it was noticed that Loopback reports unhandled errors to the console despite the request succeeding. Somewhat related is the `UnhandledPromiseRejectionWarning` error when a promise successfully finishes. 

Success (using promises): 
```
(node:21617) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: Callback was already called.
```

Failure (all requests):
```
Unhandled error for request GET /tests/3: Error: Still not working
    at requestPromise.then.catch.err (.../server/models/test.js:86:25)
    at process._tickCallback (internal/process/next_tick.js:103:7
```

The following is a sample of output from the integration tests:

```
> mocha --recursive './test/**/*.integration.js'



  /test
    /1
Unhandled error for request GET /tests/1: Error: This doesn't work
    at Function.Test.sampleRemoteMethod1 (.../server/models/test.js:8:23)
    at SharedMethod.invoke (.../node_modules/strong-remoting/lib/shared-method.js:270:25)
    at HttpContext.invoke (.../node_modules/strong-remoting/lib/http-context.js:297:12)
    at phaseInvoke (.../node_modules/strong-remoting/lib/remote-objects.js:649:9)
    at runHandler (.../node_modules/strong-remoting/node_modules/loopback-phase/lib/phase.js:135:5)
    at iterate (.../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:146:13)
    at Object.async.eachSeries (.../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:162:9)
    at runHandlers (.../node_modules/strong-remoting/node_modules/loopback-phase/lib/phase.js:144:13)
    at iterate (.../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:146:13)
    at .../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:157:25
    at .../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:154:25
    at execStack (.../node_modules/strong-remoting/lib/remote-objects.js:494:7)
    at RemoteObjects.execHooks (.../node_modules/strong-remoting/lib/remote-objects.js:498:10)
    at phaseBeforeInvoke (.../node_modules/strong-remoting/lib/remote-objects.js:645:10)
    at runHandler (.../node_modules/strong-remoting/node_modules/loopback-phase/lib/phase.js:135:5)
    at iterate (.../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:146:13)
    at .../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:157:25
    at reportSharedCtorError (.../node_modules/strong-remoting/lib/remote-objects.js:641:5)
    at runHandler (.../node_modules/strong-remoting/node_modules/loopback-phase/lib/phase.js:135:5)
    at iterate (.../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:146:13)
    at Object.async.eachSeries (.../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:162:9)
    at runHandlers (.../node_modules/strong-remoting/node_modules/loopback-phase/lib/phase.js:144:13)
    at iterate (.../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:146:13)
    at Object.async.eachSeries (.../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:162:9)
    at Phase.run (.../node_modules/strong-remoting/node_modules/loopback-phase/lib/phase.js:148:9)
    at .../node_modules/strong-remoting/node_modules/loopback-phase/lib/phase-list.js:256:13
    at iterate (.../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:146:13)
    at .../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:157:25
    at .../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:154:25
    at Object.async.eachSeries (.../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:142:20)
    at runHandlers (.../node_modules/strong-remoting/node_modules/loopback-phase/lib/phase.js:144:13)
    at iterate (.../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:146:13)
    at .../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:157:25
    at .../node_modules/strong-remoting/node_modules/loopback-phase/node_modules/async/lib/async.js:154:25
    at .../node_modules/strong-remoting/lib/remote-objects.js:625:7
    at _combinedTickCallback (internal/process/next_tick.js:67:7)
    at process._tickCallback (internal/process/next_tick.js:98:9)
      ✓ should fail with a 501 (40ms)
    /2
Unhandled error for request GET /tests/2: Error: This also doesn't work
    at Request.request [as _callback] (.../server/models/test.js:29:25)
    at Request.self.callback (.../node_modules/request/request.js:188:22)
    at emitTwo (events.js:106:13)
    at Request.emit (events.js:191:7)
    at Request.<anonymous> (.../node_modules/request/request.js:1171:10)
    at emitOne (events.js:96:13)
    at Request.emit (events.js:188:7)
    at IncomingMessage.<anonymous> (.../node_modules/request/request.js:1091:12)
    at IncomingMessage.g (events.js:291:16)
    at emitNone (events.js:91:20)
    at IncomingMessage.emit (events.js:185:7)
    at endReadableNT (_stream_readable.js:974:12)
    at _combinedTickCallback (internal/process/next_tick.js:74:11)
    at process._tickCallback (internal/process/next_tick.js:98:9)
      ✓ should fail with a 502 (624ms)
    /3
Unhandled error for request GET /tests/3: Error: This doesn't work either
    at requestPromise.then.data (.../server/models/test.js:60:25)
    at process._tickCallback (internal/process/next_tick.js:103:7)
      ✓ should fail with a 503 (593ms)
Unhandled error for request GET /tests/3: Error: Still not working
    at requestPromise.then.catch.err (.../server/models/test.js:65:25)
    at process._tickCallback (internal/process/next_tick.js:103:7)
      ✓ should fail with a 504


  ...
```