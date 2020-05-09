const table = {
	"evaluation.assesment": "Beoordeling",
	"evaluation.explanation": "Uitleg beoordeling",
	"evaluation.type": "Type beoordeling",
	"user.email": "Schoolemail",
	"user.role": "Hoofdrol",
	"user.school": "School",
	"user.displayName": "Leerlingnaam",
	"user.year": "Leerjaar",
	"user.level": "Opleidingsniveau",
	"user.preferedEmail": "Voorkeursemail",
	"user.profile": "Profiel",
	"user.phoneNumber": "Telefoonnummer",
	"user.id": "QH-id",
	"course_group.id": "Groepcode",
	"course_group.period": "Blok",
	"course.id": "Modulecode",
	"course.name": "Modulenaam",
	"subject.name": "Vaknaam",
	"enrollment.accepted": "Inschrijving geaccepteerd",
	"enrollment.accepted": "Inschrijving geaccepteerd",
	"updatedByUser.displayName": "Aangepast door",
}

this.formatId = (idName, courseId = "") => {
  return "#" + idName + (courseId + "").padStart(4, "0");
}

this.translate = (key) => {
	const s = key.split(".");
	const normalisedKey = s.slice(s.length - 2).join(".");
	const value = table[normalisedKey];
	if (value == null) {
		console.error("NO TRANSLATION FOUND FOR " + key)
		return "NO_TRANSLATION_FOUND";
	}
	return value
}

this.extractFromObject = (keys, modelName, object) => {
  return keys.reduce((tot, key) => {
    let res = tot;
    const fullPath = [modelName].concat(key.split("."));
    const normalisedKey = fullPath.slice(fullPath.length - 2).join(".");
		let value = object[key];
    switch (normalisedKey) {
      case "course_group.id":
        value = this.formatId("G", value);
        break;
      case "course.id":
        value = this.formatId("M", value);
        break;
    }
    res[this.translate(fullPath.join("."))] = value;
    return res;
  }, {})
}