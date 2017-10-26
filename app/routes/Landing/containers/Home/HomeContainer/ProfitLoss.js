import React from 'react';

import * as DataLoader from 'routes/Landing/DataLoader';

import compose from 'redux/lib/compose';

import style from 'routes/Landing/styles/ProfitLoss.scss';

import cx from 'classnames';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import find from 'lodash.findindex';

import Chart from 'utils/highcharts';

import uniq from 'lodash.uniq';

import { Dates } from 'routes/Landing/utils';

import { intlShape, injectIntl } from 'react-intl';

import messages from 'routes/Landing/messages';

import moment from 'moment';

const CHART_COLORS = ['#b9e88b', '#fac786', '#80eeef', '#dfb3eb', '#fd9fb0'];

const MONOCHROME_COLORS = ['#3b2c48', '#e0e0ea'];

const EMPTY = {
  categories: [],
  totalExpenses: 0.0,
  totalSales: 0.0,
  expenses: [],
  sales: [],
  result: [],
};

class ProfitLoss extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.dates = Dates(props.intl);
    this.state = {
      date: this.props.date,
      ...(function(self) {
        const index = find(self.dates, ({ id }) => id === self.props.date);
        const d = self.dates[index];
        return { ...d.getValue(), id: d.id, name: d.name };
      })(this),
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.date !== nextProps.date) {
      this.setState({
        date: nextProps.date,
        ...(function(self) {
          const index = find(self.dates, ({ id }) => id === nextProps.date);
          const d = self.dates[index];
          return { ...d.getValue(), id: d.id, name: d.name };
        })(this),
      });
    }
  }
  _onDate = ({ id, from, to }) => {
    this.props.onDate(id);
  };
  render() {
    const { date, id, name, from, to } = this.state;
    const { intl, data } = this.props;

    const isLoading = data.loading;

    const { categories, totalExpenses, totalSales, sales, expenses, result } =
      data.getResult || EMPTY;

    const formatter = function() {
      return [
        '<div style="display: table;padding:30px;z-index:1;">',
        '<div style="display: table-row;color: #fff;">' +
          intl.formatNumber(this.y, { format: 'MAD' }) +
          ' MAD</div>',
        '<br/>',
        '<div style="display: table-row;color: #fff;">' +
          this.point.name +
          '</div>',
        '</div>',
      ].join('');
    };

    return (
      <div
        className={cx(
          style.module,
          style.profitLoss,
          isLoading && style.loading,
        )}
      >
        <div>
          <div className={style.reportlist}>
            <div>
              <div className={cx(style.stage, style['stage-default'])}>
                <div className={style['stage-header']}>
                  <span className={style['page-title']}>
                    {intl.formatMessage(messages['ProfitLossTitle'])}
                  </span>

                  {renderActions(this, {
                    intl,
                    style,
                    date: { date, id, name, from, to },
                  })}
                </div>

                <div className={cx(style['stage-content'], style.reportsStage)}>
                  <div className={style.chartTable}>
                    <div
                      className={cx(style.floatLeft, style.reportChartNumbers)}
                    >
                      <div className={style.reportChartDescription}>
                        <div className={style.netProfitValue}>
                          {intl.formatNumber(totalSales - totalExpenses, {
                            format: 'MAD',
                          })}{' '}
                          MAD
                        </div>
                        <div className={style.netProfitText}>
                          {intl.formatMessage(
                            messages['NetIncomeTitle'],
                          )}&nbsp;&nbsp;&nbsp;
                        </div>
                      </div>

                      <div
                        style={{ marginTop: 25 }}
                        className={cx(
                          style.reportChartDescription,
                          style.incomeExpenseChart,
                        )}
                      >
                        <div className={style.totalIncomeSection}>
                          <div className={style.incomeValue}>
                            {intl.formatNumber(totalSales, {
                              format: 'MAD',
                            })}{' '}
                            MAD
                          </div>
                          <div className={style.incomeText}>
                            {intl.formatMessage(messages['IncomeTitle'])}
                          </div>
                        </div>
                        <div className={style.totalExpensesSection}>
                          <div className={style.expensesValue}>
                            {intl.formatNumber(totalExpenses, {
                              format: 'MAD',
                            })}{' '}
                            MAD
                          </div>
                          <div className={style.expensesText}>
                            {intl.formatMessage(messages['ExpensesTitle'])}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={cx(
                        style.rightAligned,
                        style.reportChartTD,
                        style.floatLeft,
                      )}
                    >
                      <div className={style.mainChartContainer}>
                        <div
                          className={style['highcharts-container']}
                          style={{}}
                        >
                          <Chart
                            config={{
                              chart: {
                                width: 600,
                                height: 200,
                              },
                              title: {
                                text: null,
                              },
                              xAxis: [
                                {
                                  categories,
                                  // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                  //     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                  crosshair: [false, false, true],

                                  lineWidth: 0,
                                  minorGridLineWidth: 0,
                                  lineColor: 'transparent',

                                  minorTickLength: 0,
                                  tickLength: 0,
                                },
                              ],
                              yAxis: [
                                {
                                  // Primary yAxis
                                  labels: {
                                    // format: '{value}k',
                                    formatter: function() {
                                      // return intl.formatNumber(this.value, { format: 'MONEY', });
                                      return this.value / 1000 + 'k';
                                    },
                                    style: {
                                      color: Chart.Highcharts.getOptions()
                                        .colors[1],
                                    },
                                  },
                                  title: {
                                    text: null,
                                  },
                                },
                                {
                                  opposite: true,
                                  title: {
                                    text: null,
                                  },
                                },
                              ],
                              credits: {
                                enabled: false,
                              },
                              // tooltip: {
                              //     // shared: true
                              // },
                              legend: {
                                enabled: false,
                              },
                              plotOptions: {
                                series: {
                                  stacking: 'normal',
                                },
                              },
                              series: [
                                {
                                  name: "Chiffres d'affaires",
                                  type: 'column',
                                  data: sales, // [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                                  tooltip: {
                                    enabled: false,
                                  },
                                },
                                {
                                  name: 'Dépenses',
                                  type: 'column',
                                  data: expenses, // [-7.0, -6.9, -9.5, -14.5, -18.2, -21.5, -25.2, -26.5, -23.3, -18.3, -13.9, -9.6],
                                  tooltip: {
                                    enabled: false,
                                  },
                                },
                                {
                                  name: 'Résultat',
                                  type: 'line',
                                  color: '#000',
                                  data: result, // [7.0, -6.9, 9.5, -14.5, 18.2, -21.5, -25.2, 26.5, -23.3, 18.3, 13.9, -9.6],
                                  tooltip: {
                                    useHTML: true,
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    borderColor: 'black',
                                    borderRadius: 0,
                                    borderWidth: 0,
                                    formatter,
                                  },
                                },
                              ],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function renderActions(self, { intl, style, date: { name } }) {
  return (
    <Dropdown className={style['floatRight']}>
      <Dropdown.Toggle
        title={name}
        className={`${style['fancyText']} ${style[
          'ddijitDropDownButton'
        ]} ${style['bbutton']}  ${style['unselectable']} `}
      />

      <Dropdown.Menu>
        {self.dates.map(({ id, getValue, name }) => {
          return (
            <MenuItem
              onSelect={() => self._onDate({ id, name, ...getValue() })}
              eventKey={id}
            >
              {name}
            </MenuItem>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default compose(injectIntl, DataLoader.result)(ProfitLoss);
