// @flow

class Clock {
  deltaSeconds = 0;

  addDeltaSeconds = (seconds: number) => {
    this.deltaSeconds += seconds;
    return this;
  };

  getNow = () => {
    return Date.now() + this.deltaSeconds;
  };
}

export default new Clock();
