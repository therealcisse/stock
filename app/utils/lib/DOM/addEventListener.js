import EventListener from 'EventListener';
import ReactDOM from 'react-dom';

export default function addEventListenerWrap(
  target,
  eventType,
  cb,
  capture = false,
) {
  /* eslint camelcase: 2 */
  const callback = ReactDOM.unstable_batchedUpdates
    ? function run(e) {
        ReactDOM.unstable_batchedUpdates(cb, e);
      }
    : cb;
  return capture
    ? EventListener.capture(target, eventType, callback)
    : EventListener.listen(target, eventType, callback);
}
