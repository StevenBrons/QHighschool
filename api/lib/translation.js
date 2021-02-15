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
	"user.schoolLocation": "Schoollocatie",
	"user.examSubjects": "Examenvakken",
	"user.examRights": "Aanvullende voorwaarden bij toetsing",
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