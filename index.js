const Hapi = require('hapi');
const PORT = process.env.PORT || 5000;
const fs = require('fs');
const path = require('path');

// Loading plugins
var plugins = [];
fs.readdirSync(path.join(__dirname, "plugins")).forEach(function(file) {
  plugins.push(require("./plugins/" + file));
});

const server = Hapi.server({ port: PORT });

server.route({
  method: 'GET',
  path: '/health-check',
  handler: (request, h) => { return h.response('OK').code(200) }
});

server.route({
  method: 'POST',
  path: '/github_glue',
  handler: function(request, h) {
    plugins.forEach((plugin) => plugin.payloadReceived(request.payload));
    return h.response('OK').code(201);
  }
});

async function start() {
  try {
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

start();
console.log('Server running at:', server.info.uri);
