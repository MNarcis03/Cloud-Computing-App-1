// Load config file
require('dotenv').config();

// Modules
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const request = require('request');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const { parse } = require('querystring');

// Settings
const hostname = '127.0.0.1';
const port = 3000;

// Controllers
const indexController = require('./controllers/indexController');
const loggerController = require('./controllers/loggerController');
const resourceController = require('./controllers/resourceController');

// Server
const server = http.createServer((req, res) => {
    resourceController(req, res, fs);
    loggerController(req, res, chalk);
    indexController(req, res, fs, ejs, request, parse);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});