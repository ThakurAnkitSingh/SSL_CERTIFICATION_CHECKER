const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const routes = require('./api/v1/routes/index'); // Adjust the path if needed

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Use the v1 routes
app.use("/v1", routes);

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
});

module.exports = app;