import React from 'react';

import * as DataLoader from 'routes/Landing/DataLoader';

import compose from 'redux/lib/compose';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import Chart from 'utils/highcharts';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import find from 'lodash.findindex';

import padEnd from 'lodash.padend';

import { intlShape, injectIntl } from 'react-intl';

import messages from 'routes/Landing/messages';

import { Dates } from 'routes/Landing/utils';

const CHART_COLORS = ['#b9e88b', '#fac786', '#80eeef', '#dfb3eb', '#fd9fb0'];

const MONOCHROME_COLORS = ['#3b2c48', '#e0e0ea'];

const EMPTY = { total: 0.0, data: [] };

class Expenses extends React.Component {
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
    const { intl, data, business } = this.props;

    const isLoading = data.loading;

    const { total, data: expenses } = data.getExpensesReport || EMPTY;

    const labelFormatter = function() {
      return [
        '<div style="width:350px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">',
        '<span title="' +
          this.name +
          '" style="vertical-align:middle;float:left;width:200px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
          this.name +
          '</span>',
        '<span style="vertical-align:middle;float:right;padding-left:12px;width:150px;max-width:150px;min-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
          intl.formatNumber(this.y, { format: 'MAD' }) +
          ' MAD</span>',
        '</div>',
      ].join('');
    };

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
        className={cx(style.module, style.expenses, isLoading && style.loading)}
      >
        <div className={style.header} style={{ marginBottom: 50 }}>
          <div className={cx(style.title, style.inlineBlock)}>
            {intl.formatMessage(messages['ExpensesTitle'])}
          </div>

          {renderActions(this, { intl, date: { date, id, name, from, to } })}

          <div className={style.clear} />
        </div>

        <div className={style.moduleContent} style={{ display: 'flex' }}>
          <div className={cx(style.subContainer, style.expenseValues)}>
            <div className={cx(style.paid, style.moneySection)}>
              <div className={style.fancyMoney}>
                {intl.formatNumber(total, { format: 'MAD' })} MAD
              </div>
              <div className={cx(style.fancyText, style.upperCase)}>{name}</div>
            </div>
          </div>

          <div
            className={cx(style.subContainer, style.expenseCategories)}
            style={{ marginTop: -45 }}
          >
            <div className={style.chartContainer} style={{}}>
              <div className={cx(style.chart, style.inlineBlock)} style={{}}>
                <div className={style['highcharts-container']}>
                  {isLoading || expenses.length === 0 ? null : (
                    <Chart
                      config={{
                        chart: {
                          plotBackgroundColor: null,
                          plotBorderWidth: null,
                          plotShadow: false,
                          type: 'pie',

                          width: 600,
                          height: 200,
                        },
                        credits: {
                          enabled: false,
                        },
                        legend: {
                          enabled: true,
                          layout: 'vertical',
                          align: 'left',
                          verticalAlign: 'middle',
                          useHTML: true,
                          labelFormatter,
                        },
                        title: { text: null },
                        tooltip: {
                          useHTML: true,
                          backgroundColor: '#000',
                          color: '#fff',
                          borderColor: 'black',
                          borderRadius: 0,
                          borderWidth: 0,
                          formatter,
                        },
                        plotOptions: {
                          pie: {
                            innerSize: 80,
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                              enabled: false,
                            },
                            showInLegend: true,
                          },
                        },
                        series: [
                          {
                            name: 'Dépenses',
                            colorByPoint: true,
                            data: expenses,
                          },
                        ],
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={style.clear} />
        </div>
      </div>
    );
  }
}

function renderActions(self, { intl, date: { name } }) {
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

export default compose(injectIntl, DataLoader.expensesReport)(Expenses);
