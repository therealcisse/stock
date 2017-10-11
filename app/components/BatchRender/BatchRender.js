// @flow

import React from 'react';

import chunk from 'lodash.chunk';

import raf from 'requestAnimationFrame';

type Props = {
  index: number,
  currentIndex: number,
  renderItem: (item: any) => any,
  batch: Array<any>,
};

export default class BatchRender extends React.PureComponent<{
  renderItem: (item: any) => any,
  items: Array<any>,
}> {
  constructor(props) {
    super(props);

    const batches = chunk(props.items, 15);

    this.state = {
      currentIndex: 1,
      batches,
      length: batches.length,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.items !== nextProps.items) {
      const batches = chunk(nextProps.items, 15);

      this.setState({
        // currentIndex: 1,
        batches,
        length: batches.length,
      });
    }
  }

  nextBatch = () =>
    this.setState(
      ({ length, currentIndex }) =>
        length === currentIndex ? null : { currentIndex: currentIndex + 1 },
    );

  componentDidMount() {
    raf(this.nextBatch);
  }

  componentDidUpdate() {
    setTimeout(() => raf(this.nextBatch), 150);
  }

  render() {
    const { currentIndex, batches } = this.state;
    const { renderItem } = this.props;
    return batches.map((batch, index) => (
      <Batch
        key={index}
        index={index}
        currentIndex={currentIndex}
        batch={batch}
        renderItem={renderItem}
      />
    ));
  }
}

class Batch extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      el: this.getEl(),
    };
  }

  getEl = (props = this.props) => {
    const { index, currentIndex, renderItem, batch } = props;
    return index <= currentIndex ? batch.map(renderItem) : null;
  };

  componentWillReceiveProps(nextProps) {
    // When should be visible
    if (this.props.index < nextProps.currentIndex) {
      if (!this.state.el || this.props.batch !== nextProps.batch) {
        this.setState({ el: this.getEl(nextProps) });
      }
    }
  }

  render() {
    return this.state.el || [];
  }
}
