const express = require("express");
const app = express();

const port = 8070;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
app.use(express.static('server'))
app.use(express.static('dist'))
