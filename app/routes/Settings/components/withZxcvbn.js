import React from 'react';

import load from '../utils/loadZxcvbn';

export default function withZxcvbn(Component) {
  return class extends React.Component {
    static displayName = `ZXCVBN(${Component.displayName ||
      Component.name ||
      'Component'})`;
    state = {};
    async componentWillMount() {
      this.setState({
        zxcvbn: await load(),
      });
    }
    render() {
      const { zxcvbn } = this.state;
      return zxcvbn ? <Component zxcvbn={zxcvbn} {...this.props} /> : null;
    }
  };
}
