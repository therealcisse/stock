import emptyFunction from 'emptyFunction';

import { SERVER } from 'vars';

let nativeRequestAnimationFrame = null;

if (!SERVER) {
  nativeRequestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;
}

if (!nativeRequestAnimationFrame) {
  let lastTime = 0;

  nativeRequestAnimationFrame = function(callback) {
    let currTime = Date.now();
    let timeDelay = Math.max(0, 16 - (currTime - lastTime));
    lastTime = currTime + timeDelay;
    return setTimeout(function() {
      callback(Date.now());
    }, timeDelay);
  };
}

// Works around a rare bug in Safari 6 where the first request is never invoked.
nativeRequestAnimationFrame(emptyFunction);

export default callback => nativeRequestAnimationFrame(callback);
