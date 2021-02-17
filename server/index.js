const express = require('express');

const app = express();

const port = 8070;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
app.set('etag', false);
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});
app.use(express.static('server'));
app.use(express.static('dist'));
