const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { join } = require("path");

const ApiRouter = require("./routes/api");
dotenv.config();
const app = express();
var jsonParser = bodyParser.json()
app.use(jsonParser);
const port = process.env.PORT || 3000;

app.use("/api", ApiRouter);

app.use((_, res) => {
    res.sendFile(join(__dirname, "build", "index.html"));
});

app.listen(port, () => console.log(`Server lisiting on port ${port}`));