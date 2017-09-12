import debug from 'debug';

function createDebug(label) {
  const log = debug(label);

  Object.defineProperty(log, 'error', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function(...args) {
      if (!this._error) {
        this._error = debug(label + ':error');
      }
      return this._error(...args);
    }.bind(log),
  });

  return log;
}

export default createDebug;
