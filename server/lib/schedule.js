var moment = require('moment');
moment.locale('nl')

//Dear future me:
//If you want to change the schedule for the next schoolyear
//first of all, change the big array down below
//secondly, change the GroupDB.addGroup function so that the first block has 8 lessons

module.exports.getLessonDate = function (period, numberInBlock, day) {
  const week = module.exports.schedule.filter((week) => {
    console.log(period + ":" + numberInBlock);
    return ((week.period + "") === (period + "") && (week.numberInBlock + "") === (numberInBlock + ""));
  })[0];

  if (week == null) {
    throw new Error("Schedule is wrong!");
  }

  return moment().year(week.year).week(week.weekNumber).day(day).toDate();
}


module.exports.schedule = [
  //block 1
  { weekNumber: 36, period: 1, numberInBlock: 1, year: 2018, },
  { weekNumber: 37, period: 1, numberInBlock: 2, year: 2018, },
  { weekNumber: 38, period: 1, numberInBlock: 3, year: 2018, },
  { weekNumber: 39, period: 1, numberInBlock: 4, year: 2018, },
  { weekNumber: 40, period: 1, numberInBlock: 5, year: 2018, },
  { weekNumber: 41, period: 1, numberInBlock: 6, year: 2018, },
  { weekNumber: 43, period: 1, numberInBlock: 7, year: 2018, },
  //block 2
  { weekNumber: 45, period: 2, numberInBlock: 1, year: 2018, },
  { weekNumber: 46, period: 2, numberInBlock: 2, year: 2018, },
  { weekNumber: 47, period: 2, numberInBlock: 3, year: 2018, },
  { weekNumber: 48, period: 2, numberInBlock: 4, year: 2018, },
  { weekNumber: 49, period: 2, numberInBlock: 5, year: 2018, },
  { weekNumber: 50, period: 2, numberInBlock: 6, year: 2018, },
  { weekNumber: 51, period: 2, numberInBlock: 7, year: 2018, },
  { weekNumber: 2, period: 2, numberInBlock: 8, year: 2019, },
  //block 3
  { weekNumber: 4, period: 3, numberInBlock: 1, year: 2019, },
  { weekNumber: 5, period: 3, numberInBlock: 2, year: 2019, },
  { weekNumber: 6, period: 3, numberInBlock: 3, year: 2019, },
  { weekNumber: 7, period: 3, numberInBlock: 4, year: 2019, },
  { weekNumber: 8, period: 3, numberInBlock: 5, year: 2019, },
  { weekNumber: 9, period: 3, numberInBlock: 6, year: 2019, },
  { weekNumber: 11, period: 3, numberInBlock: 7, year: 2019, },
  { weekNumber: 12, period: 3, numberInBlock: 8, year: 2019, },
  //block 4
  { weekNumber: 14, period: 4, numberInBlock: 1, year: 2019, },
  { weekNumber: 15, period: 4, numberInBlock: 2, year: 2019, },
  { weekNumber: 16, period: 4, numberInBlock: 3, year: 2019, },
  { weekNumber: 19, period: 4, numberInBlock: 4, year: 2019, },
  { weekNumber: 20, period: 4, numberInBlock: 5, year: 2019, },
  { weekNumber: 21, period: 4, numberInBlock: 6, year: 2019, },
  { weekNumber: 22, period: 4, numberInBlock: 7, year: 2019, },
  { weekNumber: 23, period: 4, numberInBlock: 8, year: 2019, },
];
