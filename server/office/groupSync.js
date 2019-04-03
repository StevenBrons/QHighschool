const graph = require("./graph");

exports.createTeam = async () => {
	const body = {
		"memberSettings": {
			"allowCreateUpdateChannels": false,
			"allowDeleteChannels": false,
			"allowAddRemoveApps": false,
			"allowCreateUpdateRemoveTabs": false,
			"allowCreateUpdateRemoveConnectors": false
		},
		"guestSettings": {
			"allowCreateUpdateChannels": false,
			"allowDeleteChannels": false
		},
		"messagingSettings": {
			"allowUserEditMessages": true,
			"allowUserDeleteMessages": true,
			"allowOwnerDeleteMessages": true,
			"allowTeamMentions": true,
			"allowChannelMentions": true
		},
		"funSettings": {
			"allowGiphy": true,
			"giphyContentRating": "moderate",
			"allowStickersAndMemes": true,
			"allowCustomMemes": true
		}
	}

	await graph.mainClient.api("/groups/49/team").put(body);
}