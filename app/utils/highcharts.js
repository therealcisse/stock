import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

const win = typeof global === 'undefined' ? window : global;

import Highcharts from 'highcharts';

function chartsFactory(chartType, Highcharts) {
  const displayName = 'Highcharts' + chartType;
  const result = createReactClass({
    displayName,

    propTypes: {
      config: PropTypes.object,
      isPureConfig: PropTypes.bool,
      neverReflow: PropTypes.bool,
      callback: PropTypes.func,
      domProps: PropTypes.object,
    },
    getDefaultProps: function() {
      return {
        callback: () => {},
        domProps: {},
      };
    },
    setChartRef: function(chartRef) {
      this.chartRef = chartRef;
    },
    renderChart: function(config) {
      if (!config) {
        throw new Error(
          'Config must be specified for the ' + displayName + ' component',
        );
      }
      let chartConfig = config.chart;
      this.chart = new Highcharts[chartType](
        {
          ...config,
          chart: {
            ...chartConfig,
            renderTo: this.chartRef,
          },
        },
        this.props.callback,
      );

      if (!this.props.neverReflow) {
        win &&
          win.requestAnimationFrame &&
          win.requestAnimationFrame(() => {
            this.chart && this.chart.options && this.chart.reflow();
          });
      }
    },

    shouldComponentUpdate(nextProps) {
      if (
        nextProps.neverReflow ||
        (nextProps.isPureConfig && this.props.config === nextProps.config)
      ) {
        return true;
      }
      this.renderChart(nextProps.config);
      return false;
    },

    getChart: function() {
      if (!this.chart) {
        throw new Error(
          'getChart() should not be called before the component is mounted',
        );
      }
      return this.chart;
    },

    componentDidMount: function() {
      this.renderChart(this.props.config);
    },

    componentWillUnmount() {
      this.chart.destroy();
    },

    render: function() {
      return <div ref={this.setChartRef} {...this.props.domProps} />;
    },
  });

  result.Highcharts = Highcharts;
  result.withHighcharts = Highcharts => {
    return chartsFactory(chartType, Highcharts);
  };
  return result;
}

export default chartsFactory('Chart', Highcharts);
