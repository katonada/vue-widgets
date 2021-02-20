const express = require('express');
const engine = require('consolidate');
const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '..', '.env.server')
});

const port = process.env.PORT;

// hardcoded URL, this can be any server you like,
// port has to begin with : sign
const appHost = 'http://127.0.0.1';
const appPort = ':8080';
const appUrl = `${appHost}${appPort}`;

const app = express();

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
app.set('etag', false);
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

app.set('views', `${__dirname}/views`);
app.engine('html', engine.mustache);
app.set('view engine', 'html');

app.get('/', (req, res) => {
    // const appUrl = `${host}:${port}`;
    res.render(`${__dirname}/views/index.html`, { appUrl });
});

app.get('/test', (req, res) => {
    // const appUrl = `${host}:${port}`;
    res.render(`${__dirname}/views/test.html`, { appUrl });
});

app.use(express.static('server'));
app.use(express.static('dist'));
