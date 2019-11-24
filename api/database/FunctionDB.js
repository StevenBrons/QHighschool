const Enrollment = require("../dec/EnrollmentDec");
const Lesson = require("../dec/LessonDec");
const Evaluation = require("../dec/EvaluationDec");
const Group = require("../dec/CourseGroupDec");
const Subject = require("../dec/SubjectDec");
const LoggedIn = require("../dec/LoggedInDec");
const Course = require("../dec/CourseDec");
const Participant = require("../dec/ParticipantDec");
const User = require("../dec/UserDec");
const Op = require("sequelize").Op;
const groupDb = require("./GroupDB");

const graphConnection = require("../office/graphConnection");
const officeEndpoints = require("../office/officeEndpoints");
const schedule = require("../lib/schedule");

const moment = require("moment");
moment.locale("nl");

function formatCourseId(courseId = "") {
  return "#M" + (courseId + "").padStart(4, "0");
}

exports.createUser = async accessToken => {
  const user = await graphConnection.getOwnDetails(accessToken);

  if (/beekdallyceum\.nl$/g.test(user.email)) {
    user.school = "Beekdal";
  }
  if (/candea\.nl$/g.test(user.email)) {
    user.school = "Candea College";
  }
  if (/quadraam\.nl$/g.test(user.email)) {
    user.school = "Centraal Bureau";
  }
  if (/lyceumelst\.nl$/g.test(user.email)) {
    user.school = "Lyceum Elst";
  }
  if (/liemerscollege\.nl$/g.test(user.email)) {
    user.school = "Liemers College";
  }
  if (/lorentzlyceum\.nl$/g.test(user.email)) {
    user.school = "Lorentz Lyceum";
  }
  if (/maartenvanrossem\.nl$/g.test(user.email)) {
    user.school = "Maarten van Rossem";
  }
  if (/montessoriarnhem\.nl$/g.test(user.email)) {
    user.school = "Montessori College";
  }
  if (/olympuscollege\.nl$/g.test(user.email)) {
    user.school = "Olympus College";
  }
  if (/produsarnhem\.nl$/g.test(user.email)) {
    user.school = "Produs";
  }
  if (/gymnasiumarnhem\.nl$/g.test(user.email)) {
    user.school = "Stedelijk Gymnasium Arnhem";
  }
  if (/symbion-vo\.nl$/g.test(user.email)) {
    user.school = "Symbion";
  }
  if (/vmbo-venster\.nl$/g.test(user.email)) {
    user.school = "'t Venster";
  }
  if (/hetwesteraam\.nl$/g.test(user.email)) {
    user.school = "Het Westeraam";
  }

  if (user.school == null) {
    throw new Error("WRONG EMAIL " + user.email);
  }

  if (
    !/ll\.beekdallyceum\.nl$/g.test(user.email) &&
    !/ll\.candea\.nl$/g.test(user.email) &&
    !/ll\.quadraam\.nl$/g.test(user.email) &&
    !/ll\.lyceumelst\.nl$/g.test(user.email) &&
    !/ll\.liemerscollege\.nl$/g.test(user.email) &&
    !/ll\.lorentzlyceum\.nl$/g.test(user.email) &&
    !/ll\.maartenvanrossem\.nl$/g.test(user.email) &&
    !/ll\.montessoriarnhem\.nl$/g.test(user.email) &&
    !/ll\.olympuscollege\.nl$/g.test(user.email) &&
    !/ll\.produsarnhem\.nl$/g.test(user.email) &&
    !/ll\.gymnasiumarnhem\.nl$/g.test(user.email) &&
    !/ll\.symbion-vo\.nl$/g.test(user.email) &&
    !/ll\.vmbo-venster\.nl$/g.test(user.email) &&
    !/ll\.hetwesteraam\.nl$/g.test(user.email) &&
    user.jobTitle !== "Leerling"
  ) {
    user.role = "teacher";
  }

  return User.create(user);
};

exports.updateAllGroups = async () => {
  const groups = await Group.findAll();
  return Promise.all(
    groups.map(async group => {
      await exports.updateLessonDates(group);
      await officeEndpoints.updateClass(group.id);
    })
  );
};

exports.updateLessonDates = async group => {
  if (!schedule.shouldBeSynced(group)) return;
  const { id, schoolYear, period, day } = group;
  for (let i = 0; i < 9; i++) {
    const date = schedule.getLessonDate(schoolYear, period, i + 1, day);
    await Lesson.update(
      { date },
      {
        where: {
          courseGroupId: id,
          numberInBlock: i + 1
        }
      }
    );
  }
};

exports.addLessons = async (groupId, schoolYear, period, day) => {
  for (let i = 0; i < 9; i++) {
    await Lesson.create({
      courseGroupId: groupId,
      date: schedule.getLessonDate(schoolYear, period, i + 1, day),
      numberInBlock: i + 1
    });
  }
};

exports.findEvaluation = async (userId, groupId) => {
  const group = await groupDb.getGroup(groupId);
  const evaluation = await Evaluation.findOne({
    attributes: ["id", "userId", "type", "assesment", "explanation"],
    order: [["id", "DESC"]],
    raw: true,
    where: { userId, courseId: group.courseId },
    include: [
      {
        model: User,
        attributes: ["id", "email", "displayName"]
      }
    ]
  });
  if (evaluation == null) {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["displayName", "email"]
    });
    return {
      displayName: user.displayName,
      email: user.email,
      assesment: "",
      courseName: group.courseName,
      subject: group.subjectName,
      explanation: "",
      type: "decimal",
      courseId: formatCourseId(group.courseId),
      period: group.period,
      userId
    };
  }

  return {
    displayName: evaluation["user.displayName"],
    email: evaluation["user.email"],
    assesment: evaluation.assesment,
    courseName: group.courseName,
    subject: group.subjectName,
    explanation: evaluation.explanation,
    type: evaluation.type,
    period: group.period,
    courseId: formatCourseId(group.courseId),
    userId
  };
};

exports.getEvaluation = async school => {
  const where = school
    ? { school: { [Op.or]: school.split("||") } }
    : undefined;
  const pts = await Participant.findAll({
    attributes: ["userId", "courseGroupId"],
    order: [["courseGroupId", "DESC"]],
    where: { participatingRole: "student" },
    include: [
      {
        model: User,
        attributes: ["school"],
        where: where
      }
    ]
  });
  let evs = await Promise.all(
    pts.map(p => exports.findEvaluation(p.userId, p.courseGroupId))
  );
  return [].concat(evs);
};

exports.getEnrollment = async school => {
  const where = school
    ? { school: { [Op.or]: school.split("||") } }
    : undefined;
  return Enrollment.findAll({
    raw: true,
    include: [
      {
        model: Group,
        attributes: ["id", "period", "createdAt"],
        include: [
          {
            model: Course,
            attributes: [["name", "courseName"]],
            include: {
              model: Subject,
              attributes: ["id", "name"]
            }
          }
        ]
      },
      {
        model: User,
        attributes: [
          "email",
          "preferedEmail",
          "displayName",
          "school",
          "year",
          "level"
        ],
        where: where
      }
    ]
  }).then(enrl =>
    enrl.map(e => {
      return {
        email: e["user.email"],
        courseName: e["course_group.course.courseName"],
        subjectName: e["course_group.course.subject.name"],
        accepted: e["accepted"],
        courseId: formatCourseId(e["course_group.course.id"]),
        period: e["course_group.period"],
        displayName: e["user.displayName"],
        school: e["user.school"],
        year: e["user.year"],
        level: e["user.level"],
        preferedEmail: e["user.preferedEmail"],
        createdAt: moment(e["createdAt"]).format("lll")
      };
    })
  );
};

exports.getUserData = async school => {
  const where = school
    ? { school: { [Op.or]: school.split("||") } }
    : undefined;
  return User.findAll({
    where: where,
    attributes: [
      "email",
      "role",
      "school",
      "displayName",
      "year",
      "level",
      "preferedEmail",
      "profile",
      "phoneNumber",
      "id"
    ],
    raw: true
  });
};

exports.getCourseIdsData = async school => {
  return Course.findAll({
    attributes: ["name", "id"],
    include: {
      model: Subject,
      attributes: ["name"]
    },
    raw: true
  }).then(course =>
    course.map(e => {
      return {
        courseName: e["name"],
        subjectName: e["subject.name"],
        courseId: formatCourseId(e["id"])
      };
    })
  );
};

exports.setAlias = async (token, oldUserId, newUserId) => {
  return LoggedIn.findOne({
    where: {
      token: token,
      active: true,
      userId: oldUserId
    }
  }).then(login => {
    login.update({
      userId: newUserId
    });
  });
};
