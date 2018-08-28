## Github Glue Gun

A generic github hook destination app. One day it'll be plugin-based but right
now it's just a Target Process commenter.

### Installation

- `npm install`
- `TP_HOST=... TP_TOKEN=... node index.js`

### Deployment

This app is configured by these ENV vars:
- `TP_HOST` - the target process host to send comments to
- `TP_TOKEN` - the authentication token to use, when sending comments
- `PORT` - the port to run this app on (default 5000)
