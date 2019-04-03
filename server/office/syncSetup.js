var graph = require('@microsoft/microsoft-graph-client');

async function getAccessToken(req) {
  if (req.user) {
    var storedToken = req.user.oauthToken;
    if (storedToken) {
      if (storedToken.expired()) {
        var newToken = await storedToken.refresh();
        req.user.oauthToken = newToken;
        return newToken.token.access_token;
      }
      return storedToken.token.access_token;
    }
  }
}

function getAuthenticatedClient(accessToken) {
  const client = graph.Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });
  return client;
}

module.exports.init = async function init(accessToken, refreshToken) {
  const client = getAuthenticatedClient(accessToken);
  const events = await client
    .api('/me/events')
    .select('subject,organizer,start,end')
    .orderby('createdDateTime DESC')
    .get();
  console.log(events);
}

module.exports.getAccessToken = getAccessToken;