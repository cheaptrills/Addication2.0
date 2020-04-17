const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { join } = require("path");
const http = require("http");

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

let server = http.createServer(app);
require("./primus/primus").go(server);
server.listen(port);

//app.listen(port, () => console.log(`Server lisiting on port ${port}`));