const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// environment variables
process.env.NODE_ENV = 'development';

// config variables
const config = require('./config/config.js');

// Allow cors for development purpose
app.use(cors());

require('./routes/routes')(app);

// Get index.html 
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => { 
	console.log(`Smokeweb listening on port ${port}!`);
});
