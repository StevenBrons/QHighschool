const moment = require("moment");
moment.locale("nl");

exports.getLessonDate = function (schoolYear, period, numberInBlock, day) {
  const week = exports.schedule.filter(week => {
    return (
      week.period + "" === period + "" &&
      week.numberInBlock + "" === numberInBlock + "" &&
      schoolYear === week.schoolYear
    );
  })[0];

  if (week == null) {
    throw new Error(`Schedule is wrong! Could not find match for: ${schoolYear}, ${period}, ${numberInBlock}, ${day}`);
  }
  const weeknummer = typeof week.weekNumber === "function" ? week.weekNumber(day) : week.weekNumber;

  return moment()
    .year(week.year)
    .isoWeek(weeknummer)
    .day(day)
    .toDate();
};

exports.getCurrentSchoolYear = () => {
  return "2020/2021";
};

exports.isEnrollable = group => {
  return group.schoolYear == exports.getCurrentSchoolYear();
}

exports.shouldBeSynced = group => {
  if (process.env.NODE_ENV) {
    //production
    return group.schoolYear + "" === "2020/2021";
  } else {
    //develop
    return group.schoolYear == exports.getCurrentSchoolYear();
  }
};

exports.schedule = [
  //PERIOD 1 2018/2019
  {
    weekNumber: 35,
    period: 1,
    numberInBlock: 1,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 36,
    period: 1,
    numberInBlock: 2,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 37,
    period: 1,
    numberInBlock: 3,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 38,
    period: 1,
    numberInBlock: 4,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 39,
    period: 1,
    numberInBlock: 5,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 40,
    period: 1,
    numberInBlock: 6,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 41,
    period: 1,
    numberInBlock: 7,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 43,
    period: 1,
    numberInBlock: 8,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 44,
    period: 1,
    numberInBlock: 9,
    year: 2018,
    schoolYear: "2018/2019"
  },
  //PERIOD 2 2018/2019
  {
    weekNumber: 45,
    period: 2,
    numberInBlock: 1,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 46,
    period: 2,
    numberInBlock: 2,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 47,
    period: 2,
    numberInBlock: 3,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 48,
    period: 2,
    numberInBlock: 4,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 49,
    period: 2,
    numberInBlock: 5,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 50,
    period: 2,
    numberInBlock: 6,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 51,
    period: 2,
    numberInBlock: 7,
    year: 2018,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 2,
    period: 2,
    numberInBlock: 8,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 3,
    period: 2,
    numberInBlock: 9,
    year: 2019,
    schoolYear: "2018/2019"
  },
  //PERIOD 3 2018/2019
  {
    weekNumber: 4,
    period: 3,
    numberInBlock: 1,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 5,
    period: 3,
    numberInBlock: 2,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 6,
    period: 3,
    numberInBlock: 3,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 7,
    period: 3,
    numberInBlock: 4,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 8,
    period: 3,
    numberInBlock: 5,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 9,
    period: 3,
    numberInBlock: 6,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 11,
    period: 3,
    numberInBlock: 7,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 12,
    period: 3,
    numberInBlock: 8,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 13,
    period: 3,
    numberInBlock: 9,
    year: 2019,
    schoolYear: "2018/2019"
  },
  //PERIOD 4 2018/2019
  {
    weekNumber: 14,
    period: 4,
    numberInBlock: 1,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 15,
    period: 4,
    numberInBlock: 2,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 16,
    period: 4,
    numberInBlock: 3,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 19,
    period: 4,
    numberInBlock: 4,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 20,
    period: 4,
    numberInBlock: 5,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 21,
    period: 4,
    numberInBlock: 6,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 22,
    period: 4,
    numberInBlock: 7,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 23,
    period: 4,
    numberInBlock: 8,
    year: 2019,
    schoolYear: "2018/2019"
  },
  {
    weekNumber: 24,
    period: 4,
    numberInBlock: 9,
    year: 2019,
    schoolYear: "2018/2019"
  },










  //PERIOD 1 2019/2020
  {
    weekNumber: 35,
    period: 1,
    numberInBlock: 1,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 36,
    period: 1,
    numberInBlock: 2,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 37,
    period: 1,
    numberInBlock: 3,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 38,
    period: 1,
    numberInBlock: 4,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 39,
    period: 1,
    numberInBlock: 5,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 40,
    period: 1,
    numberInBlock: 6,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 41,
    period: 1,
    numberInBlock: 7,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 43,
    period: 1,
    numberInBlock: 8,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 44,
    period: 1,
    numberInBlock: 9,
    year: 2019,
    schoolYear: "2019/2020"
  },
  //PERIOD 2 2019/2020
  {
    weekNumber: 45,
    period: 2,
    numberInBlock: 1,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 46,
    period: 2,
    numberInBlock: 2,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 47,
    period: 2,
    numberInBlock: 3,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 48,
    period: 2,
    numberInBlock: 4,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 49,
    period: 2,
    numberInBlock: 5,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 50,
    period: 2,
    numberInBlock: 6,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 51,
    period: 2,
    numberInBlock: 7,
    year: 2019,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 2,
    period: 2,
    numberInBlock: 8,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 3,
    period: 2,
    numberInBlock: 9,
    year: 2020,
    schoolYear: "2019/2020"
  },
  //PERIOD 3 2019/2020
  {
    weekNumber: 4,
    period: 3,
    numberInBlock: 1,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 5,
    period: 3,
    numberInBlock: 2,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 6,
    period: 3,
    numberInBlock: 3,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 7,
    period: 3,
    numberInBlock: 4,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 8,
    period: 3,
    numberInBlock: 5,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 10,
    period: 3,
    numberInBlock: 6,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 11,
    period: 3,
    numberInBlock: 7,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 12,
    period: 3,
    numberInBlock: 8,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 13,
    period: 3,
    numberInBlock: 9,
    year: 2020,
    schoolYear: "2019/2020"
  },
  //PERIOD 4 2019/2020
  {
    weekNumber: 14,
    period: 4,
    numberInBlock: 1,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 15,
    period: 4,
    numberInBlock: 2,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 16,
    period: 4,
    numberInBlock: 3,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    period: 4,
    numberInBlock: 4,
    year: 2020,
    schoolYear: "2019/2020",
    weekNumber: (day) => {
      switch (day) {
        case "maandag":
          return 17;
        case "dinsdag":
          return 17;
        case "woensdag":
          return 19;
        case "donderdag":
          return 19;
        case "vrijdag":
          return 19;
      }
    }
  },
  {
    weekNumber: 20,
    period: 4,
    numberInBlock: 5,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 21,
    period: 4,
    numberInBlock: 6,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 22,
    period: 4,
    numberInBlock: 7,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 23,
    period: 4,
    numberInBlock: 8,
    year: 2020,
    schoolYear: "2019/2020"
  },
  {
    weekNumber: 24,
    period: 4,
    numberInBlock: 9,
    year: 2020,
    schoolYear: "2019/2020"
  },








  //PERIOD 1 2020/2021
  {
    weekNumber: 36,
    period: 1,
    numberInBlock: 1,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 37,
    period: 1,
    numberInBlock: 2,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 38,
    period: 1,
    numberInBlock: 3,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 39,
    period: 1,
    numberInBlock: 4,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 40,
    period: 1,
    numberInBlock: 5,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 41,
    period: 1,
    numberInBlock: 6,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 42,
    period: 1,
    numberInBlock: 7,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 44,
    period: 1,
    numberInBlock: 8,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 45,
    period: 1,
    numberInBlock: 9,
    year: 2020,
    schoolYear: "2020/2021"
  },
  //PERIOD 2 2020/2021
  {
    weekNumber: 46,
    period: 2,
    numberInBlock: 1,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 47,
    period: 2,
    numberInBlock: 2,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 48,
    period: 2,
    numberInBlock: 3,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 49,
    period: 2,
    numberInBlock: 4,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 50,
    period: 2,
    numberInBlock: 5,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 51,
    period: 2,
    numberInBlock: 6,
    year: 2020,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 1,
    period: 2,
    numberInBlock: 7,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 2,
    period: 2,
    numberInBlock: 8,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 3,
    period: 2,
    numberInBlock: 9,
    year: 2021,
    schoolYear: "2020/2021"
  },
  //PERIOD 3 2020/2021
  {
    weekNumber: 4,
    period: 3,
    numberInBlock: 1,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 5,
    period: 3,
    numberInBlock: 2,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 6,
    period: 3,
    numberInBlock: 3,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 8,
    period: 3,
    numberInBlock: 4,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 9,
    period: 3,
    numberInBlock: 5,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 10,
    period: 3,
    numberInBlock: 6,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 11,
    period: 3,
    numberInBlock: 7,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 12,
    period: 3,
    numberInBlock: 8,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 13,
    period: 3,
    numberInBlock: 9,
    year: 2021,
    schoolYear: "2020/2021"
  },
  //PERIOD 4 2020/2021
  {
    weekNumber: 14,
    period: 4,
    numberInBlock: 1,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 15,
    period: 4,
    numberInBlock: 2,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 16,
    period: 4,
    numberInBlock: 3,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 19,
    period: 4,
    numberInBlock: 4,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 20,
    period: 4,
    numberInBlock: 5,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 21,
    period: 4,
    numberInBlock: 6,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 22,
    period: 4,
    numberInBlock: 7,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 23,
    period: 4,
    numberInBlock: 8,
    year: 2021,
    schoolYear: "2020/2021"
  },
  {
    weekNumber: 24,
    period: 4,
    numberInBlock: 9,
    year: 2021,
    schoolYear: "2020/2021"
  },

];
