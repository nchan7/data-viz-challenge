/* eslint-disable no-console */

const express = require('express');

const DEFAULT_PORT = 8080;
const port = parseInt(process.argv[2]) || DEFAULT_PORT;

const app = express();

// Serve static files relative to the project root.
app.use(express.static('./'));
app.listen(port, () => console.log(`server listening on port ${port}`));
