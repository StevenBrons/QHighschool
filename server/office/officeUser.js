const graph = require("./graph");

exports.getUserDetails = async (accessToken) => {
	const client = graph.getAuthenticatedClient(accessToken);
	const userData = await client.api("/me").get();
	return {
		email: userData.userPrincipalName,
		firstName: userData.givenName,
		lastName: userData.surname,
		displayName: userData.displayName,
		school: null,
		role: "student",
		jobTitle: userData.jobTitle,
		preferedEmail: userData.userPrincipalName,
	}
}
