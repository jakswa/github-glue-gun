const Hapi = require('hapi');
const TP = require('./tp');

const PORT = process.env.PORT || 5000;

const server = Hapi.server({ port: PORT });

server.route({
  method: 'GET',
  path: '/health-check',
  handler: function(request, h) {
    return h.response('OK').code(200);
  }
});

server.route({
  method: 'GET',
  path: '/hello',
  handler: function(request, h) {
    return 'hello world ...query is: ' + JSON.stringify(request.query);
  }
});

server.route({
  method: 'POST',
  path: '/github_glue',
  handler: function(request, h) {
    console.log("POST /github_glue - " + JSON.stringify(request.payload));

    let pr = request.payload.pull_request || {};
    let entID = pr.body && TP.parseEntityID(pr.body);
    if (entID) {
      TP.link(entID, pr.url)
        .then(() => console.log(`spotted ${entID}, glued to ${pr.url}`));
    }

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
