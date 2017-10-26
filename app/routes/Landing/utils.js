import messages from 'routes/Landing/messages';
import moment from 'moment';

// import getMoment from 'getMoment';
//
// import invariant from 'invariant';
//
// const END = new Date(2000, 0, 1);
//
// export const extrapolate = function(locale) {
//   const moment = getMoment(locale, #<{(| createFn = |)}># moment => moment.utc);
//
//   const end = moment(END).startOf('day');
//
//   const today = moment().startOf('day');
//   const startOfThisWeek = moment(today)
//     .startOf('week')
//     .startOf('day');
//   const startOfThisMonth = moment(today)
//     .startOf('month')
//     .startOf('day');
//   const startOfThisYear = moment(today)
//     .startOf('year')
//     .startOf('day');
//
//   const periods = [
//     {
//       id: `day-${today.day()}`,
//       title: getDayOfWeekTitle(0),
//       to: null,
//       from: +today,
//     },
//   ];
//
//   if (today.isSame(startOfThisWeek)) {
//     function isInFirstWeekOfThisMonth(d) {
//       return (
//         d.isSameOrAfter(startOfThisMonth) &&
//         d.isSameOrBefore(endOfFirstWeekOfThisMonth)
//       );
//     }
//
//     const endOfFirstWeekOfThisMonth = moment(startOfThisMonth).add(1, 'week');
//
//     let d = moment(today)
//       .add(-1, 'day')
//       .startOf('day');
//     let yesterday = true;
//     while (d.isAfter(end) && isInFirstWeekOfThisMonth(d)) {
//       periods.push({
//         id: `day-${d.day()}`,
//         title: yesterday ? 'hier' : d.format('dddd'),
//         to: +moment(d).endOf('day'),
//         from: +d,
//       });
//       d = moment(d)
//         .add(-1, 'day')
//         .startOf('day');
//       yesterday = false;
//     }
//   } else {
//     // Add all days of this week
//     [-1, -2, -3, -4, -5, -6].forEach(function(index) {
//       const startOfDay = moment(today)
//         .add(index, 'days')
//         .startOf('day');
//
//       if (
//         startOfDay.isAfter(end) &&
//         !isLastWeek(startOfDay) &&
//         !isLastMonth(startOfDay)
//       ) {
//         periods.push({
//           id: `day-${startOfDay.day()}`,
//           title: getDayOfWeekTitle(index),
//           to: +moment(startOfDay).endOf('day'),
//           from: +startOfDay,
//         });
//       }
//     });
//   }
//
//   // Add all weeks of this month
//   [-1, -2, -3].forEach(function(index) {
//     const endOfWeek = moment(today)
//       .add(index, 'weeks')
//       .endOf('week')
//       .endOf('day');
//
//     if (endOfWeek.isAfter(end) && !isLastMonth(endOfWeek)) {
//       periods.push({
//         id: `week-${endOfWeek.week()}`,
//         title: getWeekOfMonthTitle(index),
//         to: +endOfWeek,
//         from: +moment(endOfWeek)
//           .startOf('week')
//           .startOf('day'),
//       });
//     }
//   });
//
//   // Add all months of this year
//   [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11].forEach(function(index) {
//     const startOfMonth = moment(today)
//       .add(index, 'months')
//       .startOf('month')
//       .startOf('day');
//
//     if (startOfMonth.isAfter(end) && !isLastYear(startOfMonth)) {
//       periods.push({
//         id: `month-${startOfMonth.month()}`,
//         title: getMonthOfYearTitle(index),
//         to: +moment(startOfMonth)
//           .endOf('month')
//           .endOf('day'),
//         from: +startOfMonth,
//       });
//     }
//   });
//
//   // Add all years upto end
//   let curYear = startOfThisYear
//     .add(-1, 'year')
//     .startOf('year')
//     .startOf('day');
//   while (curYear.isAfter(end)) {
//     periods.push({
//       id: `year-${curYear.year()}`,
//       title: String(curYear.year()),
//       to: +moment(curYear)
//         .endOf('year')
//         .endOf('day'),
//       from: +curYear,
//     });
//
//     curYear = curYear
//       .add(-1, 'year')
//       .startOf('year')
//       .startOf('day');
//   }
//
//   return periods;
//
//   function isLastWeek(date) {
//     return moment(date).isBefore(startOfThisWeek);
//   }
//
//   function isLastMonth(date) {
//     return moment(date).isBefore(startOfThisMonth);
//   }
//
//   function isLastYear(date) {
//     return moment(date).isBefore(startOfThisYear);
//   }
//
//   function getDayOfWeekTitle(index) {
//     switch (index) {
//       case 0:
//         return `aujourd'hui`;
//       case -1:
//         return 'hier';
//     }
//     return moment()
//       .day(today.day() + index)
//       .format('dddd');
//   }
//
//   function getWeekOfMonthTitle(index) {
//     switch (index) {
//       case -1:
//         return 'la semaine derniere';
//     }
//     return `il y a ${Math.abs(index)} semaines`;
//   }
//
//   function getMonthOfYearTitle(index) {
//     return moment()
//       .month(today.month() + index)
//       .format('MMMM YYYY');
//   }
// };
//
// export const durations = [
//   {
//     duration: 1,
//     label: 'Une journée',
//   },
//   {
//     duration: 3,
//     label: '3 jours',
//   },
//   {
//     duration: 7,
//     label: '1 semaine',
//   },
//   {
//     duration: 14,
//     label: '2 semaines',
//   },
//   {
//     duration: 30.417,
//     label: '1 mois',
//   },
//   {
//     duration: 60.833,
//     label: '2 mois',
//   },
//   {
//     duration: 91.25,
//     label: '3 mois',
//   },
//   {
//     duration: 182.5,
//     label: '6 mois',
//   },
//   {
//     duration: 273.75,
//     label: '9 mois',
//   },
//   {
//     duration: 365.2422,
//     label: '1 an',
//   },
//   {
//     duration: 547.501,
//     label: '18 mois',
//   },
//   {
//     duration: 730,
//     label: '2 ans',
//   },
//   {
//     duration: 1095,
//     label: '3 ans',
//   },
//   {
//     duration: -1,
//     label: 'Plus de 3 ans',
//   },
// ];

export const Dates = intl => [
  {
    id: 12,
    name:
      intl && intl.formatMessage(messages['Dates_Last_x_days'], { days: 30 }),
    getValue() {
      return {
        from: +moment()
          .subtract(30, 'days')
          .startOf('day'),
        to: undefined,
      };
    },
  },

  {
    id: 5,
    name: intl && intl.formatMessage(messages['Dates_This_month']),
    getValue() {
      return {
        from: +moment()
          .startOf('month')
          .startOf('day'),
        to: +moment()
          .endOf('month')
          .endOf('day'),
      };
    },
  },

  {
    id: 6,
    name: intl && intl.formatMessage(messages['Dates_This_quarter']),
    getValue() {
      return {
        from: +moment()
          .startOf('quarter')
          .startOf('day'),
        to: +moment()
          .endOf('quarter')
          .endOf('day'),
      };
    },
  },

  {
    id: 7,
    name: intl && intl.formatMessage(messages['Dates_This_year']),
    getValue() {
      return {
        from: +moment()
          .startOf('year')
          .startOf('day'),
        to: +moment()
          .endOf('year')
          .endOf('day'),
      };
    },
  },

  {
    id: 9,
    name: intl && intl.formatMessage(messages['Dates_Last_month']),
    getValue() {
      return {
        from: +moment()
          .subtract(1, 'month')
          .startOf('month')
          .startOf('day'),
        to: +moment()
          .subtract(1, 'month')
          .endOf('month')
          .endOf('day'),
      };
    },
  },

  {
    id: 10,
    name: intl && intl.formatMessage(messages['Dates_Last_quarter']),
    getValue() {
      return {
        from: +moment()
          .subtract(1, 'quarter')
          .startOf('quarter')
          .startOf('day'),
        to: +moment()
          .subtract(1, 'quarter')
          .endOf('quarter')
          .endOf('day'),
      };
    },
  },

  {
    id: 11,
    name: intl && intl.formatMessage(messages['Dates_Last_year']),
    getValue() {
      return {
        from: +moment()
          .subtract(1, 'year')
          .startOf('year')
          .startOf('day'),
        to: +moment()
          .subtract(1, 'year')
          .endOf('year')
          .endOf('day'),
      };
    },
  },
];
