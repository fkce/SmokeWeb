const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()
const port = 3000

const https = require('https');
const fs = require('fs');

// Allow cors for development purpose
app.use(cors())

require('./routes/routes')(app)

// Get index.html 
app.use(express.static(path.join(__dirname, 'public')))

const options = {
  key: fs.readFileSync('/home/mimooh/privkey.pem'),
  cert: fs.readFileSync('/home/mimooh/fullchain.pem')
};

var httpsServer = https.createServer(options, app)
httpsServer.listen(port)
