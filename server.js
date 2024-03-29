const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const api = require('./routes/index.js');

const PORT = process.env.PORT || 3005;

const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
	res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
	res.sendFile(path.join(__dirname, '/public/pages/notes.html'))
);

// Wildcard route to direct users to application's homepage for any undefined routes
app.get('*', (req, res) =>
	res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Start the server and listen on the specified port
app.listen(PORT, () =>
	console.log(`App listening at http://localhost:${PORT} 🚀`)
);