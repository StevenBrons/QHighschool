const Group = require("../dec/CourseGroupDec");
const Course = require("../dec/CourseDec");
const Subject = require("../dec/SubjectDec");
const Participant = require("../dec/ParticipantDec");
const User = require("../dec/UserDec");
const Enrollment = require("../dec/EnrollmentDec");
const Lesson = require("../dec/LessonDec");
const Evaluation = require("../dec/EvaluationDec");
const Presence = require("../dec/PresenceDec");
const functionDb = require("./FunctionDB");
const userDb = require("./UserDB");
const schedule = require("../lib/schedule");
const officeEndpoints = require("../office/officeEndpoints");
const mailApi = require("../mail/mailApi");
const Op = require("sequelize").Op;

exports._mapGroup = data => {
  let groupName = data.course.name;
  groupName = groupName.charAt(0).toUpperCase() + groupName.slice(1);
  return {
    id: data.id + "",
    courseId: data.courseId,
    day: data.day,
    period: data.period,
    schoolYear: data.schoolYear,
    enrollableFor: data.enrollableFor,
    courseName: groupName,
    courseDescription: data.course.description,
    remarks: data.course.remarks,
    studyTime: data.course.studyTime,
    subjectId: data.course.subject.id,
    subjectName: data.course.subject.name,
    subjectDescription: data.course.subject.description,
    subjectAbbreviation: data.course.subject.abbreviation,
    teacherId: data.participants[0] ? data.participants[0].user.id : null,
    teacherName: data.participants[0]
      ? data.participants[0].user.displayName
      : null,
    graphId: data.graphId
  };
};

exports.getGroups = async userId => {
  let groups = await Group.findAll({
    order: [["period", "ASC"]],
    include: [
      {
        model: Course,
        attributes: ["name", "description", "remarks", "studyTime"],
        include: [
          {
            model: Subject,
            attributes: ["id", "name", "description"]
          }
        ]
      },
      {
        model: Participant,
        limit: 1,
        where: { participatingRole: "teacher" },
        include: [
          {
            model: User,
            attributes: ["id", "displayName"]
          }
        ]
      }
    ]
  });
  groups = groups.map(this._mapGroup);
  let evaluations = groups.map(_ => null);
  if (userId != null) {
    evaluations = await Promise.all(groups.map(group => userDb.getEvaluation(userId, group.courseId)));
  }
  groups = groups
    .map((group, index) => {
      return {
        ...group,
        enrollable: schedule.shouldBeSynced(group),
        evaluation: evaluations[index],
      }
    });
  return groups;
};

exports.setFullGroup = async data => {
  let group = await Group.findByPk(data.groupId);
  group = await group.update(data);
  await functionDb.updateLessonDates(group);
  await officeEndpoints.updateClass(group.id);
  return group;
};

exports.setGroup = async data => {
  Group.findByPk(data.groupId).then(group => {
    return group.update(data);
  });
};

exports.getGroup = async (groupId, userId) => {
  let group = await Group.findByPk(groupId, {
    order: [["period", "ASC"]],
    include: [
      {
        model: Course,
        attributes: ["name", "description", "remarks", "studyTime"],
        include: [{ model: Subject }]
      },
      {
        model: Participant,
        limit: 1,
        where: { participatingRole: "teacher" },
        include: [
          {
            model: User,
            attributes: ["id", "displayName"]
          }
        ]
      }
    ]
  });
  group = this._mapGroup(group);
  if (userId != null) {
    group.evaluation = await userDb.getEvaluation(userId, group.courseId);
  }
  group.enrollable = schedule.shouldBeSynced(group);
  return group;
};

exports.setGraphId = async (groupId, graphId) => {
  const g = await Group.findByPk(groupId);
  g.update({ graphId });
};

exports.getEnrollments = async (groupId, school = "%") => {
  return Enrollment.findAll({
    attributes: [],
    where: {
      courseGroupId: groupId,
      accepted: "false"
    },
    include: [
      {
        model: User,
        order: [["displayName", "DESC"]],
        where: {
          school: {
            [Op.like]: school
          }
        }
      }
    ]
  }).then(e => e.map(e => e.user));
};

exports.getParticipants = async (groupId, teacher, school = "%") => {
  const participants = await Participant.findAll({
    attributes: ["participatingRole", "userId"],
    where: {
      courseGroupId: groupId
    },
    include: {
      model: User,
      attributes: teacher
        ? [
          "id",
          "role",
          "school",
          "firstName",
          "lastName",
          "displayName",
          "year",
          "profile",
          "level",
          "preferedEmail",
          "phoneNumber",
          "email"
        ]
        : [
          "id",
          "role",
          "school",
          "displayName",
          "firstName",
          "lastName",
          "level",
          "profile",
          "year"
        ],
      where: {
        school: {
          [Op.like]: school
        }
      },
      order: [["displayName", "DESC"]]
    }
  });
  return participants.map(p => {
    return {
      ...p.dataValues.user.dataValues,
      participatingRole: p.dataValues.participatingRole
    };
  });
};

exports.addUserToGroup = async (userId, courseGroupId, participatingRole) => {
  await _addParticipant(userId, courseGroupId, participatingRole);

  if (participatingRole === "student") {
    await _acceptEnrollment(userId, courseGroupId);
  }
  officeEndpoints.addParticipantByUserId(
    userId,
    courseGroupId,
    participatingRole
  );
};

async function _acceptEnrollment(userId, courseGroupId) {
  return Enrollment.update(
    {
      accepted: "true"
    },
    {
      where: {
        userId,
        courseGroupId
      }
    }
  );
}

async function _addParticipant(userId, courseGroupId, participatingRole) {
  return Participant.findOrCreate({
    where: {
      userId,
      courseGroupId
    },
    defaults: {
      userId,
      courseGroupId,
      participatingRole
    }
  });
}

exports.getLessons = async (groupId, userId) => {
  if (userId == null) {
    return Lesson.findAll({ where: { courseGroupId: groupId } });
  } else {
    return Lesson.findAll({
      where: { courseGroupId: groupId }
    }).then(async lessons => {
      const presences = await Promise.all(
        lessons.map(lesson =>
          Presence.findOne({
            attributes: ["lessonId", "userId", "userStatus"],
            where: {
              lessonId: lesson.id,
              userId: userId
            }
          })
        )
      );
      return lessons.map((lesson, index) =>
        presences[index] == null
          ? lesson
          : { ...lesson.dataValues, userStatus: presences[index].userStatus }
      );
    });
  }
};

exports.setLesson = async lesson => {
  return Lesson.findByPk(lesson.id).then(l => {
    if (l.courseGroupId === lesson.courseGroupId) {
      return l.update(lesson);
    }
  });
};

exports.getPresence = async (groupId, school = "%") => {
  return Presence.findAll({
    include: [
      {
        model: Lesson,
        attributes: [],
        where: {
          courseGroupId: groupId
        }
      },
      {
        model: User,
        where: {
          school: {
            [Op.like]: school
          }
        }
      }
    ]
  });
};

exports.setPresence = async ({ userId, lessonId, status }, courseGroupId) => {
  const pres = await Presence.findOne({
    where: {
      userId,
      lessonId
    },
    include: {
      model: Lesson,
      where: {
        courseGroupId
      }
    }
  });
  if (pres == null) {
    const lesson = await Lesson.findByPk(lessonId);
    if (lesson.courseGroupId + "" !== courseGroupId + "")
      return new Error("Lesson Group Wrong");
    return Presence.create({
      lessonId,
      userId,
      status
    });
  }
  return pres.update({
    status
  });
};

exports.isCertificateWorthy = ({ evaluation }) => {
  if (evaluation != null) {
    const assesment = evaluation.assesment + "";
    switch (evaluation.type) {
      case "decimal":
        const x = assesment.replace(/\./g, "_$comma$_").replace(/,/g, ".").replace(/_\$comma\$_/g, ",");
        return x >= 5.5;
      case "stepwise":
        return assesment === "G" || assesment === "V";
      case "check":
        return assesment === "passed";
    }
  }
  return false;
}

exports.getEvaluations = async (groupId, school = "%") => {
  const participants = await Participant.findAll({
    attributes: ["userId"],
    where: { courseGroupId: groupId, participatingRole: "student" },
    include: [{
      model: User,
      where: {
        school: {
          [Op.like]: school
        }
      }
    }, {
      model: Group,
      include: {
        model: Course,
      }
    }]
  });
  const evaluations = participants.map(p => userDb.getEvaluation(p.userId, p.course_group.course.id));
  return Promise.all(evaluations);
};

exports.updateUserStatus = async (userId, lessonId, newStatus) => {
  const p = await Presence.findOne({ where: { userId, lessonId } });
  if (p != null) {
    p.update({ userStatus: newStatus });
  } else {
    const lesson = await Lesson.findByPk(lessonId);
    const groupIds = await userDb.getParticipatingGroupIds(userId);
    if (groupIds.indexOf(lesson.courseGroupId + "") !== -1) {
      return Presence.create({
        lessonId,
        userId,
        userStatus: newStatus
      });
    } else {
      throw new Error("You are not a member of the group of this lesson");
    }
  }
};

exports.addGroup = async ({ courseId, mainTeacherId }) => {
  const g = {
    day: "maandag",
    courseId,
    period: 1,
    schoolYear: "2019/2020"
  };

  const group = await Group.create(g);
  await functionDb.addLessonsIfNecessary(group);
  await Participant.create({
    participatingRole: "teacher",
    courseGroupId: group.id,
    userId: mainTeacherId
  });
  officeEndpoints.updateClass(group.id);
  return group;
};

exports.setEvaluation = async (ev) => {
  mailApi.sendEvaluationChangedMail(ev);
  return Evaluation.create({
    userId: ev.userId,
    assesment: ev.assesment,
    type: ev.type,
    explanation: ev.explanation,
    updatedByUserId: ev.updatedByUserId,
    courseId: ev.courseId
  });
};

exports.getGraphIdFromGroupId = async groupId => {
  const group = await Group.findByPk(groupId, { attributes: ["graphId"] });
  return group.graphId;
};

exports.getSubjectIdOfGroupId = async groupId => {
  const g = await Group.findByPk(groupId, {
    attributes: [],
    raw: true,
    include: {
      model: Course,
      attributes: ["subjectId"]
    }
  });
  return g["course.subjectId"] + "";
};

exports.getParticipatingGroupsIds = async userId => {
  return Participant.findAll({
    where: { userId },
    attributes: ["courseGroupId"]
  }).map(u => u.courseGroupId + "");
};
