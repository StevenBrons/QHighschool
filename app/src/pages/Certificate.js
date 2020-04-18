import React, { Component } from "react";
import { getEnrolLments, getGroups, getParticipatingGroups, getSubjects } from "../store/actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { isCertificateWorthy, translateAssessment } from "./group/Evaluation";
import jspdf from "jspdf"
import Page from "../pages/Page"
import Progress from "../components/Progress"

class Certificate extends Component {

	constructor(props) {
		super(props);

		// Keep track whether we have already generated a pdf.
		this.state = {
			generatedPdf: false,
			images: {
				background: "jpg",
				course_header: "png",
				portfolio_header: "png",
				signature: "png",
				quadraam_logo: "png"
			}
		};

		// Load all the images in the state.
		Object.keys(this.state.images).forEach(key => {
			let imageData = new Image();
			imageData.src = "/images/certificate/" + key + "." + this.state.images[key];
			imageData.onload = () => {
				this.state.images[key] = imageData;
			}
		});
	}

	/**
		* Adds a page to an existing pdf, or generates a base
		* pdf to work with. This new page has all the images pre-applied.
		*
		* @param pdf A pdf object (optional)
		* @returns A pdf object.
		*/
	makeBase(pdf = new jspdf({
		orientation: "p",
		unit: "mm",
		format: "a4",
		putOnlyUsedFonts: true,
		floatPrecision: 16
	})) {
		// Add a page count.
		if (!pdf.hasOwnProperty("page_count")) {
			pdf.page_count = 1;
		} else {
			pdf.addPage();
			pdf.page_count++;
		}

		// Setup some formatting stuff.
		pdf.setFontSize(12);
		pdf.setFont("helvetica", "normal");

		// Image has a ratio of 0.7:1
		pdf.addImage(this.state.images.background, "jpg", 0, 0, 210, 300);
		// Image has a ratio of 3.66:1
		pdf.addImage(this.state.images.course_header, "png", 20, 0, 150, 41);
		// Image has a ratio of 2.54:1
		pdf.addImage(this.state.images.signature, "png", 45, 190, 120, 47);
		// Image has a ratio of 3.43:1
		pdf.addImage(this.state.images.quadraam_logo, "png", 70, 240, 70, 20);

		return pdf;
	}

	/**
		* Grabs the data using the groupId provided and
		* puts that as first page in the pdf certificate.
		*
		* @param groupId The id of the group to generate a certificate for.
		* @param pdf The pdf object.
		*/
	addModule(groupId, pdf) {
		if (!this.props.groups) {
			console.log("No groups found");
			return;
		}

		if (!this.props.groups.hasOwnProperty(groupId + "")) {
			console.log("That group id cannot be found!");
			return;
		}

		if (!this.props.groups[groupId].hasOwnProperty("evaluation")) {
			console.log("That module has no evaluation!");
			return;
		}

		// Fetch the data.
		let data = this.props.groups[groupId];

		// Add the text.
		pdf.text("Hierbij verklaart Quadraam dat", 105, 60, { align: "center" });

		pdf.setFontStyle("bold");
		pdf.setFontSize(25);
		pdf.text(data.evaluation.displayName, 105, 70, { align: "center", maxWidth: 175 });
		pdf.setFontSize(12);
		pdf.setFontStyle("normal");

		pdf.text("de Q-Highschool module", 105, 87, { align: "center" });

		pdf.setFontStyle("bold");
		pdf.setFontSize(28);
		pdf.text(data.courseName, 105, 100, { align: "center", maxWidth: 175 });
		pdf.setFontSize(12);
		pdf.setFontStyle("normal");

		pdf.text("van " + data.studyTime.toString() + " studie-uren en onderdeel van het parcours informatica successvol heeft afgesloten met de beoordeling", 105, 125, { align: "center", maxWidth: 120 });

		pdf.setFontStyle("bold");
		pdf.setFontSize(28);
		pdf.text(translateAssessment(data.evaluation), 105, 145, { align: "center" });
		pdf.setFontSize(12);
		pdf.setFontStyle("normal");

		let date = data.evaluation.hasOwnProperty("date") ? data.evaluation.date.toString() : data.schoolYear.toString();
		pdf.text(date, 105, 168, { align: "center" });
	}

	/**
	 * Adds default text to a new portfolio page.
	 *
	 * @param pdf The pdf to add the text to.
	 * @param name Name of the student for the header.
	 */
	portfolioBasePage(pdf, name) {
		// Set the name header.
		pdf.text("Hierbij verklaart Quadraam dat", 80, 50);

		pdf.setFontSize(25);
		pdf.setFontStyle("bold");
		pdf.text(name, 107, 60, { align: "center" });

		pdf.setFontSize(12);
		pdf.setFontStyle("normal");
		pdf.text("de volgende Q-Highschool modules heeft afgerond", 60, 70);

		// Make the header for the portfolio table.
		pdf.setFontStyle("bold");
		pdf.text("Naam module", 20, 100);
		pdf.text("Studietijd", 130, 100);
		pdf.text("Datum", 170, 100);
		pdf.setFontStyle("normal");
	}

	/**
		* Gathers data for the portfolio page(s) in the certificate,
		* then adds the data in a nicely formatted way to the
		* certificate.
		*
		* @param pdf The pdf object.
		*/
	addPortfolio(pdf) {
		if (!this.props.groups)
			return;

		let name = undefined;

		// Construct the portfolio table.
		let heightOffset = 1;
		pdf.setFontStyle("normal");
		Object.keys(this.props.groups).forEach((key) => {
			let val = this.props.groups[key];
			let data = {};

			if (!val.hasOwnProperty("evaluation"))
				return;

			// Add another page if there are too many modules.
			if (heightOffset % 6 === 0) {
				this.makeBase(pdf);
				this.portfolioBasePage(pdf, name);
				heightOffset = 1;
			}

			// Get the student name, if not already set.
			if (name === undefined && val.evaluation.hasOwnProperty("displayName") && val.evaluation.displayName.length > 0) {
				name = val.evaluation.displayName.toString();
				this.portfolioBasePage(pdf, name);
			}

			// Get the module name.
			if (val.hasOwnProperty("courseName"))
				data.name = val.courseName.toString();
			else
				return;

			// Get the study credits.
			if (val.hasOwnProperty("studyTime"))
				data.time = val.studyTime.toString();
			else
				data.time = "-";

			// Get the date of evaluation.
			if (val.evaluation.hasOwnProperty("date"))
				data.date = val.evaluation.date.toString();
			else
				data.date = val.hasOwnProperty("schoolYear") ? val.schoolYear : "Niet bekend.";

			// Get the grade data.
			if (val.evaluation.hasOwnProperty("assesment") && val.evaluation.assesment.length > 0 && isCertificateWorthy(val.evaluation))
				data.grade = translateAssessment(val.evaluation)
			else
				return;

			// Construct a pdf row.
			let height = heightOffset++ * 13 + (100 + 13);
			pdf.text(data.name, 20, height, { maxWidth: 70 });

			// Set the color to Quadraam orange and make the text bold.
			// After putting the text down, revert to original settings.
			pdf.setTextColor("#F0831F");
			pdf.setFontStyle("bold");
			pdf.text(data.grade, 90, height);
			pdf.setFontStyle("normal");
			pdf.setTextColor("#000000");

			pdf.text(data.time + " uur", 130, height);
			pdf.text(data.date, 170, height);
		});
	}

	/**
		* Fixes the page count to be even by adding
		* a page when the current count is odd.
		* @param pdf The pdf object.
		*/
	fixPageCount(pdf) {
		if (pdf.hasOwnProperty("page_count") && pdf.page_count % 2 !== 0) {
			pdf.addPage();
			pdf.page_count++;
		}
	}

	/**
		* Generate a certificate based on the url given.
		* If a groupId is specified, then use that to get a
		* module specific certificate.
		*
		* In all cases add the portfolio and make sure the
		* amount of pages is even.
		*/
	doGenerate() {
		if (this.state.generatedPdf)
			return;

		if (!this.props.groups) {
			this.props.getParticipatingGroups();
			return;
		}

		if (!this.props.enrollmentIds) {
			this.props.getEnrollments();
			return;
		}

		// Make the base pdf.
		let pdf = this.makeBase();

		// Add a single module if requested.
		if (this.props.match.params.hasOwnProperty("groupId") && this.props.match.params.groupId !== null) {
			this.addModule(this.props.match.params.groupId, pdf);
		} else {
			// Add the portfolio page(s).
			this.addPortfolio(pdf);

			// Make sure the page count is always even in case we're printing a portfolio.
			this.fixPageCount(pdf);
		}

		// Open the pdf in this window.
		// window.location = pdf.output("bloburi", "Certificaat Q-Highschool.pdf");

		// Save the pdf
		pdf.save("Certificaat Q-Highschool.pdf");

		// Make sure we do not generate the pdf multiple times.
		let newState = this.state;
		newState.generatedPdf = true;
		this.setState(newState);
	}

	/**
		* Render the page.
		* @returns a JSX page.
		*/
	render() {
		// Generate the pdf.
		this.doGenerate();

		// Go back if the certificate is generated,
		if (this.state.generatedPdf) {
			return (
				<Page>
					<p>Certificaat is klaar!</p>
				</Page>
			)
		} else {
			return (<Page>
				<p>Een moment geduld a.u.b. </p>
				<Progress />
			</Page>)
		}
	}
}

function mapStateToProps(state) {
	return {
		groups: state.groups,
		participatingGroupIds: state.users[state.userId].participatingGroupIds,
		enrollmentIds: state.users[state.userId].enrollmentIds,
		role: state.role,
		schoolYear: state.schoolYear,
		currentPeriod: state.currentPeriod,
		userId: state.userId
	};
}

function mapDispatchToProps(dispatch) {
	return {
		getSubjects: () => dispatch(getSubjects()),
		getGroups: () => dispatch(getGroups()),
		getEnrollments: () => dispatch(getEnrolLments()),
		getParticipatingGroups: () => dispatch(getParticipatingGroups())
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)((Certificate)));