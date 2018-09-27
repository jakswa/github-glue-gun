const fetch = require('node-fetch');

// tp:Bugs/1234 or tp:UserStory/1234
const PATTERN = /(fixes|links) tp:([0-9]+)/;
const TP_HOST = process.env.TP_HOST;
const TP_TOKEN = process.env.TP_TOKEN; 
const BASE_URL = `https://${TP_HOST}/api/v1`;

class TargetProcess {
  static payloadReceived(payload) {
    let action = payload.action;
    let pr = payload.pull_request || payload.comment || {};
    let entID = pr.body && this.parseEntityID(pr.body);
    if (['opened', 'created'].includes(action) && entID) {
      this.link(entID, pr.html_url)
        .then(() => console.log(`spotted ${entID}, glued to ${pr.html_url}`));
    }
  }

  static parseEntityID(text) {
    let match = text.match(PATTERN);
    return match && match[2];
  }

  static link(entityID, linkURL) {
    return fetch(`${BASE_URL}/Comments?access_token=${TP_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ General: { Id: entityID }, Description: `glued up to ${linkURL}` })
    })
  }
}

module.exports = TargetProcess;
